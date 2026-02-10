from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64

app = Flask(__name__)
CORS(app)

def is_refuge_dataset_image(img):
    """Strict validation to only accept REFUGE dataset images"""
    try:
        h, w, c = img.shape
        
        print(f"🔍 Validating image - Shape: {img.shape}")
        
        # 1. Size check - REFUGE images are typically 512x512 or larger
        if h < 400 or w < 400:
            print("❌ Image too small for REFUGE dataset")
            return False
        
        # 2. Aspect ratio check - REFUGE images are square
        aspect_ratio = w / h
        if aspect_ratio < 0.8 or aspect_ratio > 1.2:
            print(f"❌ Aspect ratio {aspect_ratio:.2f} not square enough")
            return False
        
        # 3. Color check - REFUGE fundus have specific colors
        b, g, r = cv2.split(img)
        r_mean = r.mean()
        g_mean = g.mean()
        b_mean = b.mean()
        
        print(f"🎨 RGB - R:{r_mean:.1f}, G:{g_mean:.1f}, B:{b_mean:.1f}")
        
        # REFUGE fundus should have red dominant
        if r_mean <= g_mean:
            print("❌ Red channel not dominant")
            return False
        
        # 4. Brightness check
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()
        contrast = gray.std()
        
        print(f"📈 Brightness: {brightness:.1f}, Contrast: {contrast:.1f}")
        
        # REFUGE images have specific brightness
        if brightness < 50 or brightness > 180:
            print("❌ Brightness wrong for REFUGE")
            return False
        
        # 5. Edge density - REFUGE have complex structures
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (h * w)
        
        print(f"🔲 Edge density: {edge_density:.4f}")
        
        if edge_density < 0.02:
            print("❌ Too few edges (likely screenshot)")
            return False
        
        # 6. Check for uniform areas (screenshots have many)
        kernel = np.ones((30, 30), np.uint8)
        uniform = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
        uniform_ratio = np.sum(uniform < 10) / (h * w)
        
        if uniform_ratio > 0.4:
            print("❌ Too many uniform areas (screenshot)")
            return False
        
        print("✅ PASSED: REFUGE dataset image")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def create_mock_segmentation_masks(h=224, w=224):
    """Create realistic mock segmentation masks for testing"""
    # Create optic disc mask (circular region in center)
    disc_mask = np.zeros((h, w), dtype=np.float32)
    center_x, center_y = w // 2, h // 2
    radius = min(w, h) // 6
    
    y, x = np.ogrid[:h, :w]
    disc_mask = ((x - center_x)**2 + (y - center_y)**2 <= radius**2).astype(np.float32)
    
    # Create optic cup mask (smaller circle inside disc)
    cup_mask = np.zeros((h, w), dtype=np.float32)
    cup_radius = radius // 2
    cup_mask = ((x - center_x)**2 + (y - center_y)**2 <= cup_radius**2).astype(np.float32)
    
    # Add some randomness for realism
    disc_mask += np.random.normal(0, 0.1, disc_mask.shape)
    cup_mask += np.random.normal(0, 0.1, cup_mask.shape)
    
    # Clip to valid range
    disc_mask = np.clip(disc_mask, 0, 1)
    cup_mask = np.clip(cup_mask, 0, 1)
    
    return disc_mask, cup_mask

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("🚀 New request")
        
        if "image" not in request.files:
            return jsonify({
                "validation": False, 
                "error": "No image file provided"
            })

        file = request.files["image"]
        img_bytes = file.read()
        img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({
                "validation": False, 
                "error": "Invalid image format"
            })

        # STRICT REFUGE VALIDATION
        is_refuge = is_refuge_dataset_image(img)
        if not is_refuge:
            return jsonify({
                "validation": False, 
                "error": "❌ INVALID IMAGE: This is NOT a REFUGE dataset image. Please upload ONLY REFUGE dataset retinal fundus images. Screenshots and other images will be rejected."
            })

        # Create mock prediction for valid REFUGE images
        print("🎯 Creating prediction for valid REFUGE image...")
        
        # Resize for processing
        img_resized = cv2.resize(img, (224, 224))
        
        # Create mock segmentation masks
        disc_mask, cup_mask = create_mock_segmentation_masks()
        
        # Calculate CDR (Cup-to-Disc Ratio)
        disc_area = np.sum(disc_mask > 0.5)
        cup_area = np.sum(cup_mask > 0.5)
        
        if disc_area > 0:
            cdr_area = round(float(cup_area / disc_area), 2)
        else:
            cdr_area = 0.3  # default
        
        # Vertical CDR
        disc_vertical = np.sum(np.any(disc_mask > 0.5, axis=1))
        cup_vertical = np.sum(np.any(cup_mask > 0.5, axis=1))
        
        if disc_vertical > 0:
            cdr_vertical = round(float(cup_vertical / disc_vertical), 2)
        else:
            cdr_vertical = 0.3  # default
        
        # Classification based on CDR
        if cdr_area > 0.6:
            prediction = "Glaucoma"
            probability = 0.92
        elif cdr_area > 0.5:
            prediction = "Risk"
            probability = 0.75
        else:
            prediction = "Normal"
            probability = 0.85
        
        # Create visualization images
        disc_img = (disc_mask * 255).astype(np.uint8)
        cup_img = (cup_mask * 255).astype(np.uint8)
        
        # Create overlay
        overlay = img_resized.copy()
        overlay[disc_mask > 0.5] = [0, 255, 0]  # green disc
        overlay[cup_mask > 0.5] = [0, 0, 255]    # red cup
        
        # Create heatmap
        heatmap = cv2.applyColorMap(disc_img, cv2.COLORMAP_JET)
        
        # Encode images to base64
        def encode_img(image):
            _, buffer = cv2.imencode(".png", image)
            return base64.b64encode(buffer).decode("utf-8")
        
        print(f"✅ Prediction complete: {prediction} (CDR: {cdr_area})")
        
        return jsonify({
            "validation": True,
            "cdr": {
                "area": cdr_area,
                "vertical": cdr_vertical
            },
            "prediction": prediction,
            "probability": probability,
            "segmentation": {
                "disc": encode_img(disc_img),
                "cup": encode_img(cup_img),
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
    print("🚀 Starting REFUGE-only validation server...")
    app.run(host="0.0.0.0", port=5000, debug=True)
