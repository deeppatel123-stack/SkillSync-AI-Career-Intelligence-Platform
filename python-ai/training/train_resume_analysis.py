"""
Resume Analysis - Training Script
College Practical Style
Uses profile-based features only (no manual scores)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from pathlib import Path

np.random.seed(42)
n = 600

data = {
    'Skills_Count': np.random.randint(2, 18, n),
    'Projects_Count': np.random.randint(0, 10, n),
    'Internship_Count': np.random.randint(0, 5, n),
    'Certification_Count': np.random.randint(0, 8, n),
    'Education_Level': np.random.randint(0, 4, n),
    'Has_Portfolio': np.random.randint(0, 2, n),
    'Has_GitHub': np.random.randint(0, 2, n),
    'Has_LinkedIn': np.random.randint(0, 2, n),
    'Languages_Known': np.random.randint(1, 5, n),
}

df = pd.DataFrame(data)

resume_score = (
    (df['Skills_Count'] / 18.0) * 20 +
    (df['Projects_Count'] / 10.0) * 15 +
    (df['Internship_Count'] / 5.0) * 15 +
    (df['Certification_Count'] / 8.0) * 10 +
    (df['Education_Level'] / 4.0) * 10 +
    df['Has_Portfolio'] * 10 +
    df['Has_GitHub'] * 8 +
    df['Has_LinkedIn'] * 5 +
    (df['Languages_Known'] / 5.0) * 7 +
    np.random.normal(0, 4, n)
)
df['Resume_Score'] = np.clip(resume_score, 0, 100).astype(int)

datasets_dir = Path(__file__).resolve().parent.parent / 'datasets'
datasets_dir.mkdir(exist_ok=True)
csv_path = datasets_dir / 'resume_analysis.csv'
df.to_csv(csv_path, index=False)
print(f"Dataset saved to {csv_path}")

df = pd.read_csv(csv_path)

feature_cols = ['Skills_Count', 'Projects_Count', 'Internship_Count',
                'Certification_Count', 'Education_Level', 'Has_Portfolio',
                'Has_GitHub', 'Has_LinkedIn', 'Languages_Known']
X = df[feature_cols]
y = df['Resume_Score']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")

print("\nActual vs Predicted (first 10):")
for i in range(10):
    print(f"  Actual: {y_test.iloc[i]:3d}  Predicted: {y_pred[i]:5.1f}")

models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
models_dir.mkdir(exist_ok=True)
model_path = models_dir / 'resume_analysis_model.pkl'
joblib.dump(model, model_path)
print(f"\nModel saved to {model_path}")

# Save feature names
features_path = models_dir / 'resume_analysis_features.pkl'
joblib.dump(feature_cols, features_path)
