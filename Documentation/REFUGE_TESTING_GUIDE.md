# REFUGE Dataset Testing for Glaucoma Detection

This guide helps you test your glaucoma detection model on the REFUGE dataset from Kaggle.

## 📥 Download REFUGE Dataset

1. **Download from Kaggle**: https://www.kaggle.com/datasets/arnavjain1/glaucoma-datasets
2. **Alternative**: Official REFUGE challenge site: https://refuge.grand-challenge.org/

## 📁 Expected Dataset Structure

```
REFUGE_dataset/
├── training/
│   ├── glaucoma/
│   │   ├── g001.jpg
│   │   ├── g002.jpg
│   │   └── ...
│   └── non-glaucoma/
│       ├── n001.jpg
│       ├── n002.jpg
│       └── ...
├── validation/
│   ├── glaucoma/
│   └── non-glaucoma/
└── test/
    ├── glaucoma/
    └── non-glaucoma/
```

## 🚀 Quick Start

### Option 1: Streamlit Testing Interface (Recommended)

```bash
# Install dependencies
pip install -r refuge_requirements.txt

# Run the testing interface
streamlit run refuge_tester.py
```

### Option 2: Command Line Testing

```bash
# Update the dataset path in dataset_loader.py
python dataset_loader.py
```

## 🎯 Features

### Streamlit Interface (`refuge_tester.py`)
- **Dataset Overview**: View dataset statistics and structure
- **Batch Testing**: Test multiple images and get accuracy metrics
- **Single Image Test**: Test individual images with detailed results
- **Real-time Results**: See segmentation masks, CDR values, and Grad-CAM visualizations

### Dataset Loader (`dataset_loader.py`)
- **Automatic Detection**: Scans and validates dataset structure
- **Sample Extraction**: Creates smaller test sets for quick testing
- **Image Validation**: Checks image quality and format

## 📊 Testing Results

The interface provides:
- **Classification**: Glaucoma vs Normal with confidence scores
- **CDR Calculation**: Vertical and Area Cup-to-Disc Ratio
- **Segmentation**: Optic disc and cup masks
- **Explainability**: Grad-CAM heatmaps
- **Batch Metrics**: Accuracy and performance statistics

## 🔧 Configuration

### Update Dataset Path
In `refuge_tester.py`, update this line:
```python
dataset_path = "C:/your/actual/path/to/REFUGE/dataset"
```

### API Configuration
Ensure your Flask backend is running:
```bash
cd backend
python app.py
```

The Streamlit interface will connect to `http://localhost:5000/predict` automatically.

## 📈 Performance Metrics

When testing on REFUGE dataset:
- **Accuracy**: Percentage of correct predictions
- **Confidence Scores**: Model prediction confidence
- **CDR Analysis**: Cup-to-disc ratio measurements
- **Segmentation Quality**: Visual assessment of optic disc/cup segmentation

## 🎨 Sample Workflow

1. **Download** REFUGE dataset from Kaggle
2. **Extract** to maintain the folder structure
3. **Update** dataset path in the interface
4. **Start** your Flask backend (`python app.py`)
5. **Run** Streamlit interface (`streamlit run refuge_tester.py`)
6. **Test** individual images or run batch analysis
7. **Review** results and performance metrics

## 📝 Notes

- The REFUGE dataset contains 1200 images split equally into training/validation/test
- Images are color fundus photographs in JPEG format
- Ground truth labels are based on clinical diagnosis (not just image analysis)
- The dataset includes manual optic disc and cup annotations for validation

## 🔍 Troubleshooting

**Dataset not found?**
- Check the dataset path in the interface
- Ensure the folder structure matches the expected format
- Verify images are in .jpg or .png format

**API connection error?**
- Make sure Flask backend is running on localhost:5000
- Check that CORS is enabled in the backend
- Verify the `/predict` endpoint is accessible

**Low accuracy?**
- Ensure you're using the correct model file
- Check image preprocessing matches training conditions
- Verify dataset labels match your model's expected format
