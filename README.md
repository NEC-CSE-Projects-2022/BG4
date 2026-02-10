# BG4 - Glaucoma Detection Project

This project implements a comprehensive glaucoma detection system using deep learning techniques for fundus photography analysis.

## 📁 Project Structure

```
BG4/
├── dataset/                    # REFUGE dataset for training and testing
├── Documentation/             # Project documentation and guides
│   └── REFUGE_TESTING_GUIDE.md # Complete testing instructions
├── Source Code/               # Implementation files
│   ├── frontend/              # React frontend application
│   ├── backend/               # Flask backend API
│   └── dataset_loader.py      # Dataset loading utilities
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- REFUGE Dataset (see Documentation/REFUGE_TESTING_GUIDE.md)

### Setup

1. **Backend Setup**
```bash
cd Source Code/backend
pip install -r requirements.txt
python app.py
```

2. **Frontend Setup**
```bash
cd Source Code/frontend
npm install
npm run dev
```

3. **Dataset Testing**
```bash
# Follow the complete guide in Documentation/REFUGE_TESTING_GUIDE.md
pip install -r refuge_requirements.txt
streamlit run refuge_tester.py
```

## 🎯 Features

### Frontend (React + TypeScript)
- Modern UI with Tailwind CSS
- Image upload and preview
- Real-time prediction results
- Interactive visualizations

### Backend (Flask)
- RESTful API endpoints
- Deep learning model integration
- Image preprocessing pipeline
- CDR calculation and segmentation

### Dataset Support
- REFUGE dataset compatibility
- Automatic dataset validation
- Batch testing capabilities
- Performance metrics

## 📊 Model Capabilities

- **Classification**: Glaucoma vs Normal detection
- **Segmentation**: Optic disc and cup segmentation
- **CDR Analysis**: Cup-to-disc ratio calculation
- **Explainability**: Grad-CAM visualizations

## 🔧 Configuration

### Model Settings
Update model paths and parameters in:
- `Source Code/backend/model_config.py`
- `Source Code/frontend/src/services/api.ts`

### Dataset Path
Configure dataset location in:
- `dataset_loader.py`
- `refuge_tester.py`

## 📈 Performance

The system achieves:
- High accuracy on REFUGE dataset
- Real-time inference capabilities
- Comprehensive evaluation metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Documentation

- **Testing Guide**: See `Documentation/REFUGE_TESTING_GUIDE.md`
- **API Documentation**: Available in backend endpoints
- **Dataset Format**: Detailed in the testing guide

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔍 Troubleshooting

For common issues and solutions, refer to the troubleshooting section in `Documentation/REFUGE_TESTING_GUIDE.md`.

## 📞 Support

For questions and support:
- Check the documentation first
- Review existing issues
- Create new issues with detailed descriptions

---

**Note**: This project is part of the NEC CSE Projects 2022 initiative for BG4 team.
