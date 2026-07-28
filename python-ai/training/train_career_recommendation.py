"""
Career Recommendation - Training Script (College Practical Style)
RandomForestClassifier: 10 career roles based on skills and experience
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
from pathlib import Path

np.random.seed(42)
n = 1200

role_profiles = {
    'Frontend Developer':     {'Python':0.1,'Java':0.1,'JavaScript':0.95,'React':0.9,'Node':0.2,'Express':0.1,'MongoDB':0.1,'SQL':0.1,'HTML':0.95,'CSS':0.95,'Git':0.7,'DSA':0.2,'Communication':0.6,'Problem_Solving':0.5,'Projects_Count':0.7,'Internship_Count':0.3,'Certification_Count':0.3,'Interested_Domain':0},
    'Backend Developer':      {'Python':0.8,'Java':0.7,'JavaScript':0.3,'React':0.1,'Node':0.9,'Express':0.85,'MongoDB':0.7,'SQL':0.9,'HTML':0.2,'CSS':0.1,'Git':0.8,'DSA':0.7,'Communication':0.4,'Problem_Solving':0.7,'Projects_Count':0.6,'Internship_Count':0.5,'Certification_Count':0.4,'Interested_Domain':1},
    'Full Stack Developer':   {'Python':0.6,'Java':0.4,'JavaScript':0.85,'React':0.8,'Node':0.7,'Express':0.7,'MongoDB':0.6,'SQL':0.7,'HTML':0.8,'CSS':0.8,'Git':0.85,'DSA':0.6,'Communication':0.6,'Problem_Solving':0.7,'Projects_Count':0.8,'Internship_Count':0.5,'Certification_Count':0.5,'Interested_Domain':2},
    'Data Analyst':           {'Python':0.8,'Java':0.1,'JavaScript':0.2,'React':0.1,'Node':0.1,'Express':0.1,'MongoDB':0.3,'SQL':0.9,'HTML':0.2,'CSS':0.1,'Git':0.6,'DSA':0.4,'Communication':0.7,'Problem_Solving':0.8,'Projects_Count':0.5,'Internship_Count':0.4,'Certification_Count':0.5,'Interested_Domain':3},
    'Data Scientist':         {'Python':0.95,'Java':0.2,'JavaScript':0.2,'React':0.1,'Node':0.1,'Express':0.1,'MongoDB':0.3,'SQL':0.7,'HTML':0.1,'CSS':0.1,'Git':0.7,'DSA':0.8,'Communication':0.6,'Problem_Solving':0.9,'Projects_Count':0.6,'Internship_Count':0.5,'Certification_Count':0.6,'Interested_Domain':4},
    'AI/ML Engineer':         {'Python':0.95,'Java':0.3,'JavaScript':0.2,'React':0.1,'Node':0.1,'Express':0.1,'MongoDB':0.2,'SQL':0.4,'HTML':0.1,'CSS':0.1,'Git':0.7,'DSA':0.85,'Communication':0.5,'Problem_Solving':0.85,'Projects_Count':0.7,'Internship_Count':0.5,'Certification_Count':0.6,'Interested_Domain':4},
    'DevOps Engineer':        {'Python':0.7,'Java':0.3,'JavaScript':0.2,'React':0.1,'Node':0.3,'Express':0.2,'MongoDB':0.4,'SQL':0.3,'HTML':0.1,'CSS':0.1,'Git':0.9,'DSA':0.3,'Communication':0.5,'Problem_Solving':0.6,'Projects_Count':0.5,'Internship_Count':0.4,'Certification_Count':0.5,'Interested_Domain':5},
    'QA Engineer':            {'Python':0.5,'Java':0.4,'JavaScript':0.4,'React':0.1,'Node':0.2,'Express':0.2,'MongoDB':0.2,'SQL':0.6,'HTML':0.3,'CSS':0.2,'Git':0.6,'DSA':0.3,'Communication':0.7,'Problem_Solving':0.7,'Projects_Count':0.3,'Internship_Count':0.3,'Certification_Count':0.4,'Interested_Domain':6},
    'UI/UX Designer':         {'Python':0.1,'Java':0.1,'JavaScript':0.4,'React':0.3,'Node':0.1,'Express':0.1,'MongoDB':0.1,'SQL':0.1,'HTML':0.9,'CSS':0.9,'Git':0.5,'DSA':0.1,'Communication':0.9,'Problem_Solving':0.6,'Projects_Count':0.8,'Internship_Count':0.4,'Certification_Count':0.3,'Interested_Domain':7},
    'Cyber Security Analyst': {'Python':0.7,'Java':0.3,'JavaScript':0.3,'React':0.1,'Node':0.2,'Express':0.2,'MongoDB':0.2,'SQL':0.5,'HTML':0.2,'CSS':0.1,'Git':0.7,'DSA':0.5,'Communication':0.5,'Problem_Solving':0.7,'Projects_Count':0.4,'Internship_Count':0.3,'Certification_Count':0.5,'Interested_Domain':8},
}

rows, labels = [], []
for role, profile in role_profiles.items():
    for _ in range(n // len(role_profiles)):
        row = {}
        for feat, base in profile.items():
            noise = np.random.normal(0, 0.12)
            val = np.clip(base + noise, 0, 1)
            if feat in ['Projects_Count', 'Internship_Count', 'Certification_Count']:
                row[feat] = int(np.clip(base * np.random.randint(3, 8), 0, 10))
            elif feat == 'Interested_Domain':
                row[feat] = profile['Interested_Domain']
            else:
                row[feat] = round(val, 2)
        rows.append(row)
        labels.append(role)

df = pd.DataFrame(rows)
df['Career_Role'] = labels

datasets_dir = Path(__file__).resolve().parent.parent / 'datasets'
datasets_dir.mkdir(exist_ok=True)
df.to_csv(datasets_dir / 'career_recommendation.csv', index=False)
print(f"Dataset saved, shape: {df.shape}")

feature_cols = ['Python', 'Java', 'JavaScript', 'React', 'Node', 'Express',
                'MongoDB', 'SQL', 'HTML', 'CSS', 'Git', 'DSA',
                'Communication', 'Problem_Solving',
                'Projects_Count', 'Internship_Count', 'Certification_Count',
                'Interested_Domain']
X = df[feature_cols]
y = df['Career_Role']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=120, max_depth=14, random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print(f"Accuracy: {acc:.2f}")

models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
models_dir.mkdir(exist_ok=True)
joblib.dump(model, models_dir / 'career_recommendation_model.pkl')
joblib.dump(feature_cols, models_dir / 'career_recommendation_features.pkl')
print("\nModel and features saved.")
