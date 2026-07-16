import joblib
import numpy as np
from pathlib import Path


def load_model():
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    model_path = models_dir / 'placement_model.pkl'
    features_path = models_dir / 'placement_features.pkl'
    try:
        model = joblib.load(model_path)
        feature_names = joblib.load(features_path)
        return model, feature_names
    except FileNotFoundError:
        print("Warning: Placement model not found. Train the model first.")
        print("Run: python -m ml_app.ml_models.train_models")
        return None, None


def predict_placement(cgpa, skills_count, internship_count, projects_count,
                      certifications_count, aptitude_score, communication_score):
    model, feature_names = load_model()
    if model is None:
        return {'error': 'Model not loaded. Please train the model first.'}

    features = np.array([[
        cgpa, skills_count, internship_count, projects_count,
        certifications_count, aptitude_score, communication_score
    ]])

    prediction = model.predict(features)[0]
    prediction_proba = model.predict_proba(features)[0]

    confidence = float(max(prediction_proba) * 100)
    placement_probability = float(prediction_proba[1] * 100) if len(prediction_proba) == 2 else float(prediction_proba[0] * 100)

    return {
        'prediction': int(prediction),
        'placement_probability': round(placement_probability, 2),
        'confidence': round(confidence, 2),
        'is_high_chance': bool(prediction == 1),
        'message': 'Student has high placement chances!' if prediction == 1 else 'Student needs improvement.'
    }
