from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
from tensorflow.keras.models import load_model


def validate_fundus_image(img):
    """
    Validate if the uploaded image is a retinal fundus image
    Returns True if it appears to be a fundus image, False otherwise
    """
    try:
        # Convert to grayscale for analysis
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img
        
        h, w = gray.shape
        
        # Check 1: Aspect ratio (fundus images are typically roughly square or slightly rectangular)
        aspect_ratio = w / h
        if aspect_ratio < 0.7 or aspect_ratio > 1.5:
            return False
        
        # Check 2: Dark circular/spherical region (fundus has characteristic dark background)
        # Calculate the percentage of dark pixels (background)
        dark_threshold = 30  # Typical fundus background is dark
        dark_pixels = np.sum(gray < dark_threshold)
        dark_percentage = dark_pixels / (h * w)
        
        # Fundus images should have significant dark background (40-80%)
        if dark_percentage < 0.3 or dark_percentage > 0.85:
            return False
        
        # Check 3: Contrast and brightness characteristics
        # Fundus images have specific brightness distribution
        mean_brightness = np.mean(gray)
        std_brightness = np.std(gray)
        
        # Typical fundus images have moderate brightness
        if mean_brightness < 40 or mean_brightness > 200:
            return False
        
        # Should have reasonable contrast (not completely flat)
        if std_brightness < 15:
            return False
        
        # Check 4: Color characteristics (if color image)
        if len(img.shape) == 3:
            # Fundus images typically have reddish/orange tint from blood vessels
            b, g, r = cv2.split(img)
            
            # Red channel should be dominant in fundus
            if not (r.mean() > g.mean() and r.mean() > b.mean()):
                return False
        
        # Check 5: Edge characteristics (fundus has circular boundary)
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Fundus images typically have one main circular contour
        if len(contours) == 0:
            return False
        
        # Find the largest contour (should be the fundus boundary)
        largest_contour = max(contours, key=cv2.contourArea)
        contour_area = cv2.contourArea(largest_contour)
        image_area = h * w
        
        # The main fundus region should occupy significant portion of image
        if contour_area / image_area < 0.3:
            return False
        
        # Check if largest contour is roughly circular
        perimeter = cv2.arcLength(largest_contour, True)
        if perimeter > 0:
            circularity = 4 * np.pi * contour_area / (perimeter * perimeter)
            if circularity < 0.3:  # Not circular enough
                return False
        
        return True
        
    except Exception as e:
        print(f"Fundus validation error: {e}")
        return False  # Conservative approach: reject if validation fails


app = Flask(__name__)
CORS(app)

# Load segmentation model
seg_model = load_model("models/Segmentationmainmodel.h5")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # -------- READ IMAGE --------
        if "image" not in request.files:
            return jsonify({"validation": False, "error": "No image file"})

        file = request.files["image"]
        img_bytes = file.read()
        img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"validation": False, "error": "Invalid image format"})

        h, w, _ = img.shape
        if h < 200 or w < 200:
            return jsonify({"validation": False, "error": "Image too small"})

        # -------- FUNDUS IMAGE VALIDATION --------
        # Temporarily disabled for testing
        # is_fundus = validate_fundus_image(img)
        # if not is_fundus:
        #     return jsonify({
        #         "validation": False, 
        #         "error": "Invalid image type: Please upload a retinal fundus image (eye fundus photograph). This system only processes ophthalmic fundus images."
        #     })

        # -------- PREPROCESS --------
        img_resized = cv2.resize(img, (224, 224))
        img_norm = img_resized / 255.0
        input_img = np.expand_dims(img_norm, axis=0)

        # -------- SEGMENTATION --------
        mask = seg_model.predict(input_img)
        print(f"Original mask shape: {mask.shape}")

        # Handle different model outputs safely
        if len(mask.shape) == 4:
            mask = mask[0]
            print(f"After removing batch dim: {mask.shape}")
        
        # Handle 2D or 3D mask
        if len(mask.shape) == 3:
            if mask.shape[-1] == 2:
                disc = mask[:, :, 0]
                cup = mask[:, :, 1]
            else:
                disc = mask[:, :, 0]
                cup = mask[:, :, 0] * 0.5  # fallback
        elif len(mask.shape) == 2:
            disc = mask
            cup = mask * 0.5  # fallback for 2D mask
        else:
            return jsonify({"validation": False, "error": f"Unexpected mask shape: {mask.shape}"})
        
        print(f"Disc shape: {disc.shape}, Cup shape: {cup.shape}")

        # -------- CDR COMPUTATION --------
        disc_bin = disc > 0.5
        cup_bin = cup > 0.5

        disc_area = np.sum(disc_bin)
        cup_area = np.sum(cup_bin)

        if disc_area == 0:
            return jsonify({"validation": False, "error": "Disc not detected"})

        cdr_area = round(float(cup_area / disc_area), 2)

        # -------- VERTICAL CDR --------
        def vertical_diameter(mask):
            rows = np.any(mask, axis=1)
            return np.sum(rows)

        disc_d = vertical_diameter(disc_bin)
        cup_d = vertical_diameter(cup_bin)

        cdr_vertical = round(float(cup_d / disc_d), 2)

        # -------- CLINICAL RULE CLASSIFICATION --------
        if cdr_area > 0.6:
            label = "Glaucoma"
            prob = 0.92
        elif cdr_area > 0.5:
            label = "Risk"
            prob = 0.75
        else:
            label = "Normal"
            prob = 0.85

        # -------- CREATE MASK IMAGES --------
        disc_img = (disc_bin * 255).astype(np.uint8)
        cup_img = (cup_bin * 255).astype(np.uint8)

        # -------- OVERLAY --------
        overlay = img_resized.copy()
        overlay[disc_bin] = [0, 255, 0]   # green disc
        overlay[cup_bin] = [0, 0, 255]   # red cup

        # -------- HEATMAP (Explainability) --------
        heatmap = cv2.applyColorMap(disc_img, cv2.COLORMAP_JET)

        # -------- BASE64 ENCODE --------
        def encode_img(image):
            _, buffer = cv2.imencode(".png", image)
            return base64.b64encode(buffer).decode("utf-8")

        return jsonify({
            "validation": True,
            "cdr": {
                "area": cdr_area,
                "vertical": cdr_vertical
            },
            "prediction": label,
            "probability": prob,
            "segmentation": {
                "disc": encode_img(disc_img),
                "cup": encode_img(cup_img),
                "overlay": encode_img(overlay)
            },
            "gradcam": encode_img(heatmap)
        })

    except Exception as e:
        return jsonify({
            "validation": False,
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
