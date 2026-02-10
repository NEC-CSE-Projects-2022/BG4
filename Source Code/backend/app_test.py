from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64

app = Flask(__name__)
CORS(app)

def validate_fundus_image(img):
    """Validate if the uploaded image is a retinal fundus image"""
    try:
        h, w, c = img.shape
        
        print(f"Image shape: {img.shape}")
        
        # Basic size check
        if h < 200 or w < 200:
            print("Image too small")
            return False
        
        # Aspect ratio check
        aspect_ratio = w / h
        print(f"Aspect ratio: {aspect_ratio}")
        if aspect_ratio < 0.5 or aspect_ratio > 2.0:
            print("Bad aspect ratio")
            return False
        
        # Color check - fundus images usually have reddish tint
        b, g, r = cv2.split(img)
        r_mean = r.mean()
        g_mean = g.mean()
        b_mean = b.mean()
        
        print(f"RGB means: R={r_mean:.1f}, G={g_mean:.1f}, B={b_mean:.1f}")
        
        if r_mean <= g_mean or r_mean <= b_mean:
            print("Not enough red channel")
            return False
        
        # Brightness check
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()
        print(f"Brightness: {brightness:.1f}")
        
        if brightness < 30 or brightness > 200:
            print("Bad brightness")
            return False
        
        print("✅ Valid fundus image")
        return True
        
    except Exception as e:
        print(f"Validation error: {e}")
        return False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("🔍 New prediction request")
        
        # -------- READ IMAGE --------
        if "image" not in request.files:
            return jsonify({"validation": False, "error": "No image file"})

        file = request.files["image"]
        img_bytes = file.read()
        img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"validation": False, "error": "Invalid image format"})

        # -------- FUNDUS IMAGE VALIDATION --------
        is_fundus = validate_fundus_image(img)
        if not is_fundus:
            return jsonify({
                "validation": False, 
                "error": "Invalid image type: Please upload a retinal fundus image (eye fundus photograph). This system only processes ophthalmic fundus images."
            })

        # -------- MOCK PREDICTION (for testing) --------
        # Return mock data for now
        return jsonify({
            "validation": True,
            "cdr": {
                "area": 0.45,
                "vertical": 0.42
            },
            "prediction": "Normal",
            "probability": 0.85,
            "segmentation": {
                "disc": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",  # 1x1 black pixel
                "cup": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
                "overlay": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            },
            "gradcam": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        })

    except Exception as e:
        print(f"❌ Error in prediction: {e}")
        return jsonify({
            "validation": False,
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
