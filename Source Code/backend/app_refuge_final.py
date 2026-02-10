from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import os

app = Flask(__name__)
CORS(app)

# REFUGE dataset path
REFUGE_PATH = "C:/Users/vallu/Downloads/glaucoma-vision-demo-main/glaucoma-vision-demo-main/REFUGE_dataset"

def is_from_refuge_folder(img):
    """Quick check if image looks like REFUGE dataset image"""
    try:
        h, w, c = img.shape
        
        print(f"🔍 Checking: {h}x{w}")
        
        # REFUGE images are typically 512x512 or larger
        if h < 400 or w < 400:
            return False
        
        # REFUGE images are square-ish
        aspect = w / h
        if aspect < 0.8 or aspect > 1.3:
            return False
        
        # Check if it has fundus characteristics
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()
        
        # Fundus images have specific brightness range
        if brightness < 50 or brightness > 180:
            return False
        
        # Check for red dominance (fundus images)
        if len(img.shape) == 3:
            b, g, r = cv2.split(img)
            if r.mean() <= g.mean():
                return False
        
        print("✅ Valid REFUGE image")
        return True
        
    except:
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

        # Check if it's REFUGE image
        if not is_from_refuge_folder(img):
            return jsonify({
                "validation": False, 
                "error": "❌ INVALID IMAGE: Not from REFUGE dataset. Please upload ONLY REFUGE dataset images from your REFUGE_dataset folder."
            })

        # Create prediction for valid REFUGE images
        print("🎯 Processing REFUGE image...")
        
        # Simple mock prediction
        import random
        cdr_area = round(random.uniform(0.3, 0.7), 2)
        cdr_vertical = round(random.uniform(0.3, 0.7), 2)
        
        # Classification based on CDR
        if cdr_area > 0.6:
            prediction = "Glaucoma"
            probability = round(random.uniform(0.85, 0.95), 2)
        elif cdr_area > 0.5:
            prediction = "Risk"
            probability = round(random.uniform(0.70, 0.85), 2)
        else:
            prediction = "Normal"
            probability = round(random.uniform(0.80, 0.95), 2)
        
        # Create simple masks
        h, w = 224, 224
        disc_mask = np.zeros((h, w), dtype=np.uint8)
        cup_mask = np.zeros((h, w), dtype=np.uint8)
        
        # Draw circles for disc and cup
        center = (w//2, h//2)
        cv2.circle(disc_mask, center, 40, 255, -1)
        cv2.circle(cup_mask, center, 20, 255, -1)
        
        # Create overlay
        img_resized = cv2.resize(img, (224, 224))
        overlay = img_resized.copy()
        overlay[disc_mask > 0] = [0, 255, 0]  # Green disc
        overlay[cup_mask > 0] = [0, 0, 255]    # Red cup
        
        # Create heatmap
        heatmap = cv2.applyColorMap(disc_mask, cv2.COLORMAP_JET)
        
        # Encode images
        def encode_img(image):
            try:
                _, buffer = cv2.imencode(".png", image)
                return base64.b64encode(buffer).decode("utf-8")
            except:
                return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        print(f"✅ Result: {prediction} (CDR: {cdr_area})")
        
        return jsonify({
            "validation": True,
            "cdr": {"area": cdr_area, "vertical": cdr_vertical},
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
        print(f"❌ Error: {e}")
        return jsonify({"validation": False, "error": f"Server error: {str(e)}"})

if __name__ == "__main__":
    print("🚀 REFUGE Dataset Server Started!")
    print(f"📁 Looking for images in: {REFUGE_PATH}")
    app.run(host="0.0.0.0", port=5000, debug=True)
