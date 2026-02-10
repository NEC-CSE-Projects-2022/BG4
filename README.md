
# Team Number BG4– Project Title(FusionNet-Vision: Glaucoma Detection Using
Feature-Aware Segmentation and Transparent
Classification Layers)

## Team Info
- 22471A05D6— **Bhavana Valluri** ( www.linkedin.com/in/bhavana-valluri )
Work Done: Project coordination, paper title finalization, DL model implementation, training/testing, performance evaluation, documentation, paper formatting, presentation design, frontend integration & deployment support.

- 22471A05C4 — **Bhargavi Ravi** ( https://www.linkedin.com/in/bhargavi-ravi-425a0b361?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app )
Work Done: DL implementation, result analysis, graph/table generation, backend implementation, conference submission support, presentation design

- 22471A0588 — **Deepthi galla** ( (https://www.linkedin.com/in/deepthi-galla-378339356) )
Work Done: Literature survey, base paper research, dataset study, preprocessing support, feature understanding, PPT design, frontend design.

## Abstract
—Glaucoma is a leading cause of irreversible
blindness, often progressing without noticeable symptoms.
Early detection is vital but manual diagnosis from retinal
fundus images is time-consuming and subjective. This
paper presents a two-stage deep learning framework for
automated glaucoma detection.Stage one employs an Attention U-Net with a ResNet50 encoder for accurate optic disc
and cup segmentation, enabling precise computation of the
cup-to-disc ratio (CDR). Stage two integrates a fine-tuned
InceptionV3 classifier enhanced with a CatBoost-based
ensemble to distinguish glaucomatous eyes. Grad-CAM and
Grad-CAM++ provide visual explanations that highlight
model attention regions, supporting clinical interpretability.
Trained and validated on the REFUGE dataset, the system
achieved 94% accuracy, 0.91 Dice score, and 0.97 AUC,
outperforming baseline CNN models. The proposed framework demonstrates a clinically reliable and explainable
approach for scalable glaucoma screening.
Index Terms—Glaucoma detection, Retinal fundus images, Attention U-Net, ResNet50, Cup-to-Disc Ratio (CDR),
InceptionV3, CatBoost ensemble, Deep learning, Medical
image segmentation, Explainable AI, Grad-CAM, GradCAM++.



---

## Paper Reference (Inspiration)
THISARA SHYAMALEE 
, DULANI MEEDENIYA .
(https://ieeexplore.ieee.org/document/10416867)**
Original conference/IEEE paper used as inspiration for the model.

---

## Our Improvement Over Existing Paper
1. Enhanced Dataset Handling
Used additional preprocessing and stronger augmentation techniques to improve generalization across varied fundus images.

2. Improved Model Architecture
Integrated Attention U-Net with ResNet50 encoder instead of a basic U-Net or shallow CNN, leading to better optic disc and cup segmentation accuracy.

3. Better Class Imbalance Management
Applied weighted loss functions and oversampling methods to reduce bias toward normal images.

4. Higher Accuracy and Metrics
Achieved improved performance in Dice Score, IoU, Accuracy, or F1-Score compared to the original paper results.

5. Explainability Integration
Added Grad-CAM or Grad-CAM++ visualizations to make predictions interpretable for clinical validation, which was limited or absent in the base paper.

6. Optimized Training Efficiency
Used GPU acceleration and learning rate scheduling to reduce training time and stabilize convergence.

7. User-Friendly Frontend Interface
Developed a React-based interface for uploading fundus images and validating input types, making the system practical for real-world use.

---

## About the Project
--Liver disease is a major global health concern, causing around 2 million deaths annually.
--Traditional diagnostic methods such as liver function tests and biopsies are invasive, costly, and time-consuming.
--This study aims to develop an explainable, machine learning–based model (ExplaiLiver+) for early and reliable liver disease prediction.
--The Indian Liver Patient Dataset (ILPD), containing 583 records and 10 clinical parameters, is used.
--Preprocessing includes handling missing values, scaling, feature selection, and class balancing.
--Four models are combined — XGBoost, LightGBM, CatBoost, and ExtraTrees — with Logistic Regression as meta-learner.
--Achieved 94.05% accuracy and 98.39% AUC, better than single models.
--Provides reliable, interpretable, and data-driven support for clinical liver disease prediction.



## Dataset Used  
👉 **[Refuge]((https://www.kaggle.com/datasets/arnavjain1/glaucoma-datasets))**

**Dataset Details:**
REFUGE (Retinal Fundus Glaucoma Challenge) Dataset

Contains 1200 color fundus images of human eyes used for glaucoma research.

Each image is labeled with clinical glaucoma diagnosis (normal or glaucomatous).

Ground truth optic disc and optic cup segmentations are provided by experts for every image.

The dataset is split into training, validation, and test subsets (400 images each).

This dataset supports two tasks: optic disc/cup segmentation and glaucoma classification.

It is one of the largest publicly available fundus image sets for automated glaucoma detection and was originally released as part of a challenge to encourage standardized evaluation of mode
---

## Dependencies Used
The system is implemented using a combination of machine learning, data processing, and visualization libraries. Pandas and NumPy are used for data handling and numerical operations. Scikit-learn provides preprocessing tools, feature selection, model evaluation metrics, and the StackingClassifier framework. Advanced ensemble models are implemented using XGBoost, LightGBM, and CatBoost. Imbalanced-learn (SMOTEENN) is used for class imbalance handling. SHAP is used to provide model interpretability, and Matplotlib is used for visualizations such as ROC curves and feature importance plots.

---

## EDA & Preprocessing
Exploratory Data Analysis (EDA)

Checked number of images and class distribution (Normal vs Glaucoma).

Verified image resolutions and formats.

Visual inspection of sample fundus images.

Identified class imbalance and ensured proper train–validation–test split.

Preprocessing Steps

Image Resizing: All images resized to 224 × 224 pixels to match model input size.

Contrast Enhancement (CLAHE): Improved visibility of optic disc and cup regions.

Normalization: Pixel values scaled to 0–1 range for stable training.

Data Augmentation: Rotation, flipping, brightness adjustment, cropping, blur, and noise to improve generalization.

Histogram Equalization & Thresholding: Enhanced edge clarity for better segmentation of optic disc and cup.

These steps improved image quality, reduced noise, and increased model robustness and accuracy.

---

## Model Training Info
Segmentation Model Training

Model: Attention U-Net with ResNet50 encoder

Loss Function: Hybrid Loss = Dice Loss + Binary Cross-Entropy (equal weights)

Metrics: IoU and Dice Score

Purpose: Accurate optic disc and cup segmentation for CDR calculation.

Classification Model Training

Model: Fine-tuned InceptionV3

Ensemble: CatBoost meta-learner combining outputs of CNN models

Metrics: Accuracy, AUC, F1-Score, Sensitivity, Specificity

Training Techniques

Data augmentation (flip, rotate, brightness, blur).

Learning rate scheduling for stable convergence.

Class balancing to reduce bias toward normal images.

Cross-validation to ensure consistent performance.



---

## Model Testing / Evaluation
Segmentation Evaluation

Metrics Used:

IoU (Intersection over Union)

Dice Score

Purpose was to check how accurately the optic disc and cup regions were segmented.

Classification Evaluation

Metrics Used:

Accuracy

AUC (ROC Curve)

F1-Score

Sensitivity (Recall)

Specificity

Confusion Matrix

These metrics measured how well the system distinguished Glaucoma vs Normal eyes.

Explainability Check

Grad-CAM / Grad-CAM++ heatmaps were generated to visually verify that the model focused on correct eye regions (optic disc and cup).

---

## Results
 Segmentation Results

IoU (Intersection over Union): ~0.88

Dice Score: ~0.91

The Attention U-Net with ResNet50 encoder accurately segmented the optic disc and optic cup, which is essential for correct CDR calculation.

Classification Results

Accuracy: 94%

AUC (ROC): 0.97

F1-Score: 0.93

Sensitivity (Recall): 92%

Specificity: 94%

The InceptionV3 + CatBoost ensemble outperformed single CNN models and traditional machine learning approaches.

Comparison with Baselines

Logistic Regression: ~78% Accuracy

SVM: ~84% Accuracy

CNN without segmentation: ~89% Accuracy

Proposed Ensemble: 94% Accuracy

Explainability Outcome

Grad-CAM / Grad-CAM++ heatmaps showed the model focused mainly on the optic disc and cup regions, increasing transparency and clinical trust.

Overall Conclusion

The system achieved high accuracy, strong segmentation quality, and consistent performance, making it suitable for reliable and scalable glaucoma screening.



---

## Limitations & Future Work
Limitations

Dataset Size & Diversity: Model was mainly trained on the REFUGE dataset, which may not fully represent all age groups, camera types, and lighting conditions.

Hardware Requirement: Training requires GPU and high computational power, which may not be available everywhere.

Single Disease Focus: System currently detects only Glaucoma and not other eye diseases.

Image Quality Sensitivity: Very low-quality or non-fundus images can reduce prediction accuracy.

Generalization: Performance may slightly vary when tested on completely new datasets from different hospitals.

Future Work

Larger & Diverse Datasets: Train with multi-source international datasets to improve robustness and generalization.

Multi-Disease Detection: Extend the system to detect Diabetic Retinopathy, Cataract, Macular Degeneration, etc.

Mobile / Edge Deployment: Optimize the model to run efficiently on smartphones and tablets for rural screening.

Real-Time Clinical Integration: Connect with hospital management or ophthalmology tools for live usage.

Further Explainability: Enhance visualization techniques to provide even clearer medical insights for doctors.



---

## Deployment Info
Backend
---------
cd backend
python app_refuge_complete.py


Frontend
-----------
cd frontend
npm run dev







-----
