import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path

np.random.seed(42)
n = 1200

data = {
    'Technical_Skills': np.random.randint(2, 18, n),
    'Projects': np.random.randint(0, 10, n),
    'Internships': np.random.randint(0, 5, n),
    'Certifications': np.random.randint(0, 8, n),
    'CGPA': np.round(np.random.uniform(5.0, 10.0, n), 2),
    'Has_GitHub': np.random.randint(0, 2, n),
    'Has_LinkedIn': np.random.randint(0, 2, n),
    'Has_Portfolio': np.random.randint(0, 2, n),
    'Languages_Known': np.random.randint(1, 5, n),
    'Soft_Skills': np.random.randint(0, 6, n),
    'Workshops': np.random.randint(0, 5, n),
}

df = pd.DataFrame(data)

def assign_category(row):
    score = 0
    if row['Technical_Skills'] >= 12: score += 15
    elif row['Technical_Skills'] >= 7: score += 10
    elif row['Technical_Skills'] >= 4: score += 5
    if row['Projects'] >= 6: score += 15
    elif row['Projects'] >= 3: score += 10
    elif row['Projects'] >= 1: score += 5
    if row['Internships'] >= 3: score += 15
    elif row['Internships'] >= 1: score += 8
    if row['Certifications'] >= 5: score += 10
    elif row['Certifications'] >= 2: score += 6
    elif row['Certifications'] >= 1: score += 3
    if row['CGPA'] >= 9.0: score += 12
    elif row['CGPA'] >= 7.5: score += 8
    elif row['CGPA'] >= 6.0: score += 4
    if row['Has_GitHub']: score += 5
    if row['Has_LinkedIn']: score += 3
    if row['Has_Portfolio']: score += 5
    if row['Languages_Known'] >= 3: score += 4
    elif row['Languages_Known'] >= 2: score += 2
    if row['Soft_Skills'] >= 4: score += 5
    elif row['Soft_Skills'] >= 2: score += 3
    if row['Workshops'] >= 3: score += 5
    elif row['Workshops'] >= 1: score += 2

    noise = np.random.randint(-6, 7)
    score += noise

    if score >= 62: return 'Excellent'
    elif score >= 45: return 'Good'
    elif score >= 30: return 'Average'
    else: return 'Needs Improvement'

df['Resume_Category'] = df.apply(assign_category, axis=1)

datasets_dir = Path(__file__).resolve().parent.parent / 'datasets'
datasets_dir.mkdir(exist_ok=True)
csv_path = datasets_dir / 'resume_analysis.csv'
df.to_csv(csv_path, index=False)
print(f"Dataset saved to {csv_path}")
print(f"Shape: {df.shape}")
dist = df['Resume_Category'].value_counts()
print(f"Category distribution:\n{dist}\n")
if dist.min() < 2:
    print("WARNING: Some classes have < 2 samples. Adjust thresholds.\n")

feature_cols = [
    'Technical_Skills', 'Projects', 'Internships', 'Certifications',
    'CGPA', 'Has_GitHub', 'Has_LinkedIn', 'Has_Portfolio',
    'Languages_Known', 'Soft_Skills', 'Workshops'
]
X = df[feature_cols]
y = df['Resume_Category']

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

model = DecisionTreeClassifier(max_depth=12, min_samples_split=5, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2%}")
print("\nClassification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=label_encoder.classes_
))

models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
models_dir.mkdir(exist_ok=True)

model_path = models_dir / 'resume_analysis_model.pkl'
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")

encoder_path = models_dir / 'resume_analysis_encoder.pkl'
joblib.dump(label_encoder, encoder_path)
print(f"Label encoder saved to {encoder_path}")

features_path = models_dir / 'resume_analysis_features.pkl'
joblib.dump(feature_cols, features_path)
print(f"Feature names saved to {features_path}")

