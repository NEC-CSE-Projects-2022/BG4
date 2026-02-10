from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import os
import hashlib
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# REFUGE dataset characteristics
REFUGE_DATASET_PATH = "c:/Users/vallu/Downloads/glaucoma-vision-demo-main/glaucoma-vision-demo-main/REFUGE_sample"

def is_refuge_dataset_image(img, img_hash=None):
    """
    Check if the uploaded image is from the REFUGE dataset
    This validates against known REFUGE dataset characteristics
    """
    try:
        h, w, c = img.shape
        
        print(f"🔍 Checking if image is from REFUGE dataset")
        print(f"📏 Image dimensions: {h}x{w}")
        
        # 1. REFUGE dataset images have specific dimensions
        # Most REFUGE images are around 512x512, 1024x1024, or similar
        valid_sizes = [
            (512, 512), (1024, 1024), (2048, 2048), 
            (512, 512), (1024, 1024), (2056, 2124), (1634, 1634)
        ]
        
        # Check if dimensions match REFUGE dataset (allowing some variation)
        size_match = False
        for ref_h, ref_w in valid_sizes:
            if abs(h - ref_h) <= 50 and abs(w - ref_w) <= 50:
                size_match = True
                break
        
        if not size_match:
            print(f"❌ Dimensions {h}x{w} don't match REFUGE dataset")
            return False
        
        # 2. REFUGE images are high-quality medical images
        if h < 400 or w < 400:
            print("❌ Image too small for REFUGE dataset")
            return False
        
        # 3. Aspect ratio check (REFUGE images are typically square or nearly square)
        aspect_ratio = w / h
        if aspect_ratio < 0.9 or aspect_ratio > 1.1:
            print(f"❌ Aspect ratio {aspect_ratio:.2f} not typical for REFUGE")
            return False
        
        # 4. Color analysis - REFUGE fundus images have specific characteristics
        b, g, r = cv2.split(img)
        r_mean = r.mean()
        g_mean = g.mean()
        b_mean = b.mean()
        
        print(f"🎨 RGB means - R:{r_mean:.1f}, G:{g_mean:.1f}, B:{b_mean:.1f}")
        
        # REFUGE fundus images typically have:
        # - Red channel dominant (blood vessels)
        # - Moderate green channel  
        # - Lower blue channel
        if not (r_mean > g_mean > b_mean):
            print("❌ RGB distribution not typical for REFUGE fundus")
            return False
        
        # 5. Brightness and contrast typical of medical fundus images
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()
        contrast = gray.std()
        
        print(f"📈 Brightness: {brightness:.1f}, Contrast: {contrast:.1f}")
        
        # REFUGE images have specific brightness range
        if brightness < 60 or brightness > 160:
            print("❌ Brightness outside REFUGE range")
            return False
        
        # Should have good contrast (medical imaging quality)
        if contrast < 30:
            print("❌ Too low contrast for REFUGE quality")
            return False
        
        # 6. Texture and edge analysis - REFUGE images have complex retinal structures
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (h * w)
        
        print(f"🔲 Edge density: {edge_density:.4f}")
        
        # REFUGE images have rich retinal structure
        if edge_density < 0.03:
            print("❌ Too few edges for REFUGE fundus")
            return False
        
        # 7. Check for medical imaging characteristics
        # REFUGE images shouldn't have UI elements, text, etc.
        
        # Color variance should be high (medical images)
        r_var = r.var()
        g_var = g.var()
        b_var = b.var()
        
        print(f"🎨 RGB variance - R:{r_var:.1f}, G:{g_var:.1f}, B:{b_var:.1f}")
        
        if r_var < 1500 or g_var < 1500 or b_var < 1500:
            print("❌ Low color variance (not REFUGE quality)")
            return False
        
        # 8. Check for typical fundus structures
        # REFUGE images should have optic disc and blood vessel patterns
        
        # Look for bright circular region (optic disc)
        blurred = cv2.GaussianBlur(gray, (9, 9), 2)
        circles = cv2.HoughCircles(
            blurred, cv2.HOUGH_GRADIENT, dp=1.2, minDist=100,
            param1=50, param2=30, minRadius=30, maxRadius=150
        )
        
        if circles is None:
            print("❌ No optic disc detected (not REFUGE fundus)")
            return False
        
        print("✅ PASSED: Image matches REFUGE dataset characteristics")
        return True
        
    except Exception as e:
        print(f"❌ REFUGE validation error: {e}")
        return False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("🚀 New prediction request")
        
        # -------- READ IMAGE --------
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

        # -------- STRICT REFUGE DATASET VALIDATION --------
        is_refuge = is_refuge_dataset_image(img)
        if not is_refuge:
            return jsonify({
                "validation": False, 
                "error": "❌ INVALID IMAGE: This image is not from the REFUGE dataset. Please upload only REFUGE dataset retinal fundus images for glaucoma screening. This system is specifically trained and validated for REFUGE dataset images only."
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

@app.route("/test_refuge", methods=["GET"])
def test_refuge():
    """Test endpoint to check REFUGE dataset validation"""
    return jsonify({
        "message": "REFUGE dataset validation is active",
        "dataset_path": REFUGE_DATASET_PATH,
        "validation_criteria": [
            "Image dimensions (512x512, 1024x1024, etc.)",
            "Square aspect ratio",
            "Medical imaging quality",
            "Fundus color characteristics",
            "Optic disc detection",
            "Retinal structure complexity"
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
