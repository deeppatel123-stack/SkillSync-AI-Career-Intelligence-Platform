"""
Career Role Recommendation - Training Script
College Practical Style
Based on skills, projects, internships, certifications, and interested domain only.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
from pathlib import Path

np.random.seed(42)
n = 1200

roles = {
    'Frontend Developer': {
        'Python': 0.1, 'Java': 0.1, 'JavaScript': 0.95, 'React': 0.9,
        'Node': 0.2, 'Express': 0.1, 'MongoDB': 0.1, 'SQL': 0.1,
        'HTML': 0.95, 'CSS': 0.95, 'Git': 0.7, 'DSA': 0.2,
        'Communication': 0.6, 'Problem_Solving': 0.5,
        'Projects_Count': 0.7, 'Internship_Count': 0.3, 'Certification_Count': 0.3,
        'Interested_Domain': 0
    },
    'Backend Developer': {
        'Python': 0.8, 'Java': 0.7, 'JavaScript': 0.3, 'React': 0.1,
        'Node': 0.9, 'Express': 0.85, 'MongoDB': 0.7, 'SQL': 0.9,
        'HTML': 0.2, 'CSS': 0.1, 'Git': 0.8, 'DSA': 0.7,
        'Communication': 0.4, 'Problem_Solving': 0.7,
        'Projects_Count': 0.6, 'Internship_Count': 0.5, 'Certification_Count': 0.4,
        'Interested_Domain': 1
    },
    'Full Stack Developer': {
        'Python': 0.6, 'Java': 0.4, 'JavaScript': 0.85, 'React': 0.8,
        'Node': 0.7, 'Express': 0.7, 'MongoDB': 0.6, 'SQL': 0.7,
        'HTML': 0.8, 'CSS': 0.8, 'Git': 0.85, 'DSA': 0.6,
        'Communication': 0.6, 'Problem_Solving': 0.7,
        'Projects_Count': 0.8, 'Internship_Count': 0.5, 'Certification_Count': 0.5,
        'Interested_Domain': 2
    },
    'Data Analyst': {
        'Python': 0.8, 'Java': 0.1, 'JavaScript': 0.2, 'React': 0.1,
        'Node': 0.1, 'Express': 0.1, 'MongoDB': 0.3, 'SQL': 0.9,
        'HTML': 0.2, 'CSS': 0.1, 'Git': 0.6, 'DSA': 0.4,
        'Communication': 0.7, 'Problem_Solving': 0.8,
        'Projects_Count': 0.5, 'Internship_Count': 0.4, 'Certification_Count': 0.5,
        'Interested_Domain': 3
    },
    'Data Scientist': {
        'Python': 0.95, 'Java': 0.2, 'JavaScript': 0.2, 'React': 0.1,
        'Node': 0.1, 'Express': 0.1, 'MongoDB': 0.3, 'SQL': 0.7,
        'HTML': 0.1, 'CSS': 0.1, 'Git': 0.7, 'DSA': 0.8,
        'Communication': 0.6, 'Problem_Solving': 0.9,
        'Projects_Count': 0.6, 'Internship_Count': 0.5, 'Certification_Count': 0.6,
        'Interested_Domain': 4
    },
    'AI/ML Engineer': {
        'Python': 0.95, 'Java': 0.3, 'JavaScript': 0.2, 'React': 0.1,
        'Node': 0.1, 'Express': 0.1, 'MongoDB': 0.2, 'SQL': 0.4,
        'HTML': 0.1, 'CSS': 0.1, 'Git': 0.7, 'DSA': 0.85,
        'Communication': 0.5, 'Problem_Solving': 0.85,
        'Projects_Count': 0.7, 'Internship_Count': 0.5, 'Certification_Count': 0.6,
        'Interested_Domain': 4
    },
    'DevOps Engineer': {
        'Python': 0.7, 'Java': 0.3, 'JavaScript': 0.2, 'React': 0.1,
        'Node': 0.3, 'Express': 0.2, 'MongoDB': 0.4, 'SQL': 0.3,
        'HTML': 0.1, 'CSS': 0.1, 'Git': 0.9, 'DSA': 0.3,
        'Communication': 0.5, 'Problem_Solving': 0.6,
        'Projects_Count': 0.5, 'Internship_Count': 0.4, 'Certification_Count': 0.5,
        'Interested_Domain': 5
    },
    'QA Engineer': {
        'Python': 0.5, 'Java': 0.4, 'JavaScript': 0.4, 'React': 0.1,
        'Node': 0.2, 'Express': 0.2, 'MongoDB': 0.2, 'SQL': 0.6,
        'HTML': 0.3, 'CSS': 0.2, 'Git': 0.6, 'DSA': 0.3,
        'Communication': 0.7, 'Problem_Solving': 0.7,
        'Projects_Count': 0.3, 'Internship_Count': 0.3, 'Certification_Count': 0.4,
        'Interested_Domain': 6
    },
    'UI/UX Designer': {
        'Python': 0.1, 'Java': 0.1, 'JavaScript': 0.4, 'React': 0.3,
        'Node': 0.1, 'Express': 0.1, 'MongoDB': 0.1, 'SQL': 0.1,
        'HTML': 0.9, 'CSS': 0.9, 'Git': 0.5, 'DSA': 0.1,
        'Communication': 0.9, 'Problem_Solving': 0.6,
        'Projects_Count': 0.8, 'Internship_Count': 0.4, 'Certification_Count': 0.3,
        'Interested_Domain': 7
    },
    'Cyber Security Analyst': {
        'Python': 0.7, 'Java': 0.3, 'JavaScript': 0.3, 'React': 0.1,
        'Node': 0.2, 'Express': 0.2, 'MongoDB': 0.2, 'SQL': 0.5,
        'HTML': 0.2, 'CSS': 0.1, 'Git': 0.7, 'DSA': 0.5,
        'Communication': 0.5, 'Problem_Solving': 0.7,
        'Projects_Count': 0.4, 'Internship_Count': 0.3, 'Certification_Count': 0.5,
        'Interested_Domain': 8
    },
}

rows = []
labels = []
for role, profile in roles.items():
    for _ in range(n // len(roles)):
        row = {}
        for feature, base in profile.items():
            noise = np.random.normal(0, 0.12)
            val = np.clip(base + noise, 0, 1)
            if feature in ['Projects_Count', 'Internship_Count', 'Certification_Count']:
                row[feature] = int(np.clip(base * np.random.randint(3, 8), 0, 10))
            elif feature == 'Interested_Domain':
                row[feature] = profile['Interested_Domain']
            else:
                row[feature] = round(val, 2)
        rows.append(row)
        labels.append(role)

df = pd.DataFrame(rows)
df['Career_Role'] = labels

datasets_dir = Path(__file__).resolve().parent.parent / 'datasets'
datasets_dir.mkdir(exist_ok=True)
csv_path = datasets_dir / 'career_role.csv'
df.to_csv(csv_path, index=False)
print(f"Dataset saved to {csv_path}")

df = pd.read_csv(csv_path)

feature_cols = [
    'Python', 'Java', 'JavaScript', 'React', 'Node', 'Express',
    'MongoDB', 'SQL', 'HTML', 'CSS', 'Git', 'DSA',
    'Communication', 'Problem_Solving',
    'Projects_Count', 'Internship_Count', 'Certification_Count',
    'Interested_Domain'
]
X = df[feature_cols]
y = df['Career_Role']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=120, max_depth=14, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nActual vs Predicted (first 15):")
for i in range(15):
    print(f"  Actual: {y_test.iloc[i]:25s}  Predicted: {y_pred[i]}")

models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
models_dir.mkdir(exist_ok=True)
model_path = models_dir / 'career_role_model.pkl'
joblib.dump(model, model_path)
print(f"\nModel saved to {model_path}")

features_path = models_dir / 'career_role_features.pkl'
joblib.dump(feature_cols, features_path)
print(f"Features saved to {features_path}")
