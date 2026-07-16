import joblib
import numpy as np
from pathlib import Path


def load_model():
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    model_path = models_dir / 'career_model.pkl'
    features_path = models_dir / 'career_features.pkl'
    try:
        model = joblib.load(model_path)
        feature_names = joblib.load(features_path)
        return model, feature_names
    except FileNotFoundError:
        print("Warning: Career model not found. Train the model first.")
        print("Run: python -m ml_app.ml_models.train_models")
        return None, None


def recommend_career(skill_scores):
    model, feature_names = load_model()
    if model is None:
        return {'error': 'Model not loaded. Please train the model first.'}

    features = []
    for feature in feature_names:
        value = skill_scores.get(feature, 0)
        features.append(value)

    features_array = np.array([features])
    prediction = model.predict(features_array)[0]
    prediction_proba = model.predict_proba(features_array)[0]

    class_indices = np.argsort(prediction_proba)[::-1][:3]
    class_names = model.classes_

    recommendations = []
    for idx in class_indices:
        career_name = class_names[idx]
        probability = float(prediction_proba[idx] * 100)
        recommendations.append({
            'career': career_name,
            'match_percentage': round(probability, 2)
        })

    return {
        'top_recommendation': prediction,
        'confidence': round(float(max(prediction_proba) * 100), 2),
        'recommendations': recommendations
    }
