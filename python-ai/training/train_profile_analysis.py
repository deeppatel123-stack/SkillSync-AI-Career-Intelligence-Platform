"""
Profile Analysis - Training Script (College Practical Style)
DecisionTreeClassifier: Excellent, Good, Average, Needs Improvement
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path

np.random.seed(42)
n = 1200

df = pd.DataFrame({
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
})

def get_category(row):
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
    score += np.random.randint(-6, 7)
    if score >= 62: return 'Excellent'
    elif score >= 45: return 'Good'
    elif score >= 30: return 'Average'
    return 'Needs Improvement'

df['Profile_Category'] = df.apply(get_category, axis=1)

datasets_dir = Path(__file__).resolve().parent.parent / 'datasets'
datasets_dir.mkdir(exist_ok=True)
df.to_csv(datasets_dir / 'profile_analysis.csv', index=False)
print(f"Dataset saved, shape: {df.shape}")
print(df['Profile_Category'].value_counts())

feature_cols = ['Technical_Skills', 'Projects', 'Internships', 'Certifications',
                'CGPA', 'Has_GitHub', 'Has_LinkedIn', 'Has_Portfolio',
                'Languages_Known', 'Soft_Skills', 'Workshops']
X = df[feature_cols]
y = df['Profile_Category']

encoder = LabelEncoder()
y_enc = encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

model = DecisionTreeClassifier(max_depth=12, min_samples_split=5, random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print(f"\nAccuracy: {acc:.2%}")

models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
models_dir.mkdir(exist_ok=True)

joblib.dump(model, models_dir / 'profile_analysis_model.pkl')
joblib.dump(encoder, models_dir / 'profile_analysis_encoder.pkl')
joblib.dump(feature_cols, models_dir / 'profile_analysis_features.pkl')
print("\nModel, encoder, and feature names saved.")
