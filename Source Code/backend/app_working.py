from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64

app = Flask(__name__)
CORS(app)

def is_refuge_dataset_image(img):
    """Quick validation for REFUGE dataset images"""
    try:
        h, w, c = img.shape
        
        print(f"🔍 Checking image: {h}x{w}")
        
        # Basic size check
        if h < 300 or w < 300:
            print("❌ Too small")
            return False
        
        # Aspect ratio (should be roughly square)
        aspect_ratio = w / h
        if aspect_ratio < 0.7 or aspect_ratio > 1.4:
            print("❌ Bad aspect ratio")
            return False
        
        # Color check (fundus images are reddish)
        if len(img.shape) == 3:
            b, g, r = cv2.split(img)
            if r.mean() <= g.mean():
                print("❌ Not red dominant")
                return False
        
        # Brightness check
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()
        if brightness < 40 or brightness > 200:
            print("❌ Bad brightness")
            return False
        
        print("✅ Valid REFUGE image")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("🚀 New request")
        
        if "image" not in request.files:
            return jsonify({"validation": False, "error": "No image file"})

        file = request.files["image"]
        img_bytes = file.read()
        img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"validation": False, "error": "Invalid image format"})

        # Validate if it's REFUGE image
        is_refuge = is_refuge_dataset_image(img)
        if not is_refuge:
            return jsonify({
                "validation": False, 
                "error": "❌ INVALID IMAGE: This is NOT a REFUGE dataset image. Please upload ONLY REFUGE dataset retinal fundus images."
            })

        # Create simple mock prediction for valid REFUGE images
        print("🎯 Creating prediction...")
        
        # Simple mock data
        cdr_area = 0.45
        cdr_vertical = 0.42
        prediction = "Normal"
        probability = 0.85
        
        # Create simple masks
        h, w = 224, 224
        disc_mask = np.zeros((h, w), dtype=np.uint8)
        cup_mask = np.zeros((h, w), dtype=np.uint8)
        
        # Add some circular regions
        center_x, center_y = w // 2, h // 2
        radius = 30
        
        y, x = np.ogrid[:h, :w]
        disc_mask[((x - center_x)**2 + (y - center_y)**2 <= radius**2)] = 255
        cup_mask[((x - center_x)**2 + (y - center_y)**2 <= (radius//2)**2)] = 255
        
        # Create overlay
        img_resized = cv2.resize(img, (224, 224))
        overlay = img_resized.copy()
        overlay[disc_mask > 0] = [0, 255, 0]  # green disc
        overlay[cup_mask > 0] = [0, 0, 255]    # red cup
        
        # Create heatmap
        heatmap = cv2.applyColorMap(disc_mask, cv2.COLORMAP_JET)
        
        # Encode images
        def encode_img(image):
            _, buffer = cv2.imencode(".png", image)
            return base64.b64encode(buffer).decode("utf-8")
        
        print(f"✅ Prediction complete: {prediction}")
        
        return jsonify({
            "validation": True,
            "cdr": {
                "area": cdr_area,
                "vertical": cdr_vertical
            },
            "prediction": prediction,
            "probability": probability,
            "segmentation": {
                "disc": encode_img(disc_mask),
                "cup": encode_img(cup_mask),
                "overlay": encode_img(overlay)
            },
            "gradcam": encode_img(heatmap)
        })

    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({
            "validation": False,
            "error": f"Server error: {str(e)}"
        })

if __name__ == "__main__":
    print("🚀 Starting REFUGE-only server...")
    app.run(host="0.0.0.0", port=5000, debug=True)
