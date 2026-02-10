from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

def validate_fundus_image(img):
    """Strict validation to ensure image is actually a retinal fundus photograph"""
    try:
        h, w, c = img.shape
        
        print(f"🔍 Validating image - Shape: {img.shape}")
        
        # 1. Size check - fundus images are typically larger
        if h < 300 or w < 300:
            print("❌ Image too small for fundus")
            return False
        
        # 2. Aspect ratio check - fundus images are roughly square
        aspect_ratio = w / h
        if aspect_ratio < 0.8 or aspect_ratio > 1.25:
            print(f"❌ Bad aspect ratio: {aspect_ratio:.2f}")
            return False
        
        # 3. Color distribution analysis - fundus has specific characteristics
        b, g, r = cv2.split(img)
        r_mean = r.mean()
        g_mean = g.mean()
        b_mean = b.mean()
        
        print(f"📊 RGB means - R:{r_mean:.1f}, G:{g_mean:.1f}, B:{b_mean:.1f}")
        
        # Fundus images typically have:
        # - Red channel dominant (due to blood vessels)
        # - Moderate green channel
        # - Lower blue channel
        if not (r_mean > g_mean > b_mean):
            print("❌ RGB distribution not typical of fundus")
            return False
        
        # 4. Brightness and contrast analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()
        contrast = gray.std()
        
        print(f"📈 Brightness: {brightness:.1f}, Contrast: {contrast:.1f}")
        
        # Fundus images have specific brightness range
        if brightness < 50 or brightness > 180:
            print("❌ Brightness outside fundus range")
            return False
        
        # Should have reasonable contrast (not flat like screenshots)
        if contrast < 20:
            print("❌ Too low contrast (possible screenshot)")
            return False
        
        # 5. Edge and texture analysis
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (h * w)
        
        print(f"🔲 Edge density: {edge_density:.4f}")
        
        # Fundus images have complex structures (blood vessels, optic disc)
        if edge_density < 0.02:  # Too few edges = likely screenshot/UI
            print("❌ Too few edges (likely screenshot)")
            return False
        
        # 6. Check for typical screenshot characteristics
        # Screenshots often have uniform backgrounds, text, UI elements
        
        # Check for large uniform areas (common in screenshots)
        kernel = np.ones((50, 50), np.uint8)
        uniform_areas = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
        uniform_ratio = np.sum(uniform_areas < 10) / (h * w)
        
        if uniform_ratio > 0.3:
            print("❌ Too many uniform areas (likely screenshot)")
            return False
        
        # 7. Color variance check
        r_var = r.var()
        g_var = g.var()
        b_var = b.var()
        
        print(f"🎨 RGB variance - R:{r_var:.1f}, G:{g_var:.1f}, B:{b_var:.1f}")
        
        # Fundus images should have good color variation
        if r_var < 1000 or g_var < 1000 or b_var < 1000:
            print("❌ Low color variance (likely screenshot)")
            return False
        
        print("✅ PASSED: Valid fundus image")
        return True
        
    except Exception as e:
        print(f"❌ Validation error: {e}")
        return False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("🚀 New prediction request received")
        
        # -------- READ IMAGE --------
        if "image" not in request.files:
            return jsonify({"validation": False, "error": "No image file provided"})

        file = request.files["image"]
        img_bytes = file.read()
        img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"validation": False, "error": "Invalid image format"})

        # -------- STRICT FUNDUS IMAGE VALIDATION --------
        is_fundus = validate_fundus_image(img)
        if not is_fundus:
            return jsonify({
                "validation": False, 
                "error": "❌ INVALID IMAGE: This appears to be a screenshot or non-medical image. Please upload a retinal fundus photograph (eye fundus image) for glaucoma screening. The system only accepts ophthalmic fundus images."
            })

        # -------- MOCK PREDICTION (for testing validation) --------
        # In production, this would use the real model
        return jsonify({
            "validation": True,
            "cdr": {
                "area": 0.45,
                "vertical": 0.42
            },
            "prediction": "Normal",
            "probability": 0.85,
            "segmentation": {
                "disc": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
                "cup": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
                "overlay": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            },
            "gradcam": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        })

    except Exception as e:
        print(f"❌ Error in prediction: {e}")
        return jsonify({
            "validation": False,
            "error": f"Server error: {str(e)}"
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
