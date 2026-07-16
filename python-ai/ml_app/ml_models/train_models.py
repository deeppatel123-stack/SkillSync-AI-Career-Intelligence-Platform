"""
Script to train all ML models and save them using joblib.
Run this script after setting up the project to generate the trained model files.
"""

import os
import sys
from pathlib import Path

# Add the project root to the path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_platform.settings')

import django
django.setup()

import joblib
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from ml_app.utils.dataset_generator import generate_all_datasets
from ml_app.utils.data_cleaner import (
    clean_dataset,
    prepare_placement_features,
    prepare_career_features
)


def train_placement_model():
    """
    Train a Decision Tree model for placement prediction.
    """
    print("\n=== Training Placement Prediction Model (Decision Tree) ===")

    # Load or generate dataset
    dataset_path = Path(__file__).resolve().parent.parent / 'datasets' / 'placement_data.csv'
    if dataset_path.exists():
        df = pd.read_csv(dataset_path)
    else:
        df, _, _ = generate_all_datasets()
        df = pd.read_csv(dataset_path)

    # Clean the dataset
    df_clean, report = clean_dataset(df)
    print(f"Cleaning report: {report}")

    # Prepare features and target
    X = prepare_placement_features(df_clean)
    y = df_clean['placement']

    # Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Create and train the Decision Tree model
    model = DecisionTreeClassifier(
        max_depth=5,        # Limit depth to prevent overfitting
        min_samples_split=10,  # Minimum samples to split a node
        min_samples_leaf=5,    # Minimum samples at a leaf node
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2f}")

    # Get feature importance
    feature_names = X.columns.tolist()
    importance = model.feature_importances_
    for name, imp in zip(feature_names, importance):
        print(f"  {name}: {imp:.3f}")

    # Save the model
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    models_dir.mkdir(exist_ok=True)

    model_path = models_dir / 'placement_model.pkl'
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

    # Save the feature names for later use
    features_path = models_dir / 'placement_features.pkl'
    joblib.dump(feature_names, features_path)

    return model, accuracy


def train_career_model():
    """
    Train a Random Forest model for career recommendation.
    """
    print("\n=== Training Career Recommendation Model (Random Forest) ===")

    # Load or generate dataset
    dataset_path = Path(__file__).resolve().parent.parent / 'datasets' / 'career_data.csv'
    if dataset_path.exists():
        df = pd.read_csv(dataset_path)
    else:
        df, _, _ = generate_all_datasets()
        df = pd.read_csv(dataset_path)

    # Clean the dataset
    df_clean, report = clean_dataset(df)
    print(f"Cleaning report: {report}")

    # Prepare features and target
    X = prepare_career_features(df_clean)
    y = df_clean['career']

    # Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Create and train the Random Forest model
    model = RandomForestClassifier(
        n_estimators=100,    # Number of trees
        max_depth=10,        # Limit depth
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2f}")

    # Get feature importance
    feature_names = X.columns.tolist()
    importance = model.feature_importances_
    for name, imp in zip(feature_names, importance):
        print(f"  {name}: {imp:.3f}")

    # Save the model
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    models_dir.mkdir(exist_ok=True)

    model_path = models_dir / 'career_model.pkl'
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

    # Save the feature names for later use
    features_path = models_dir / 'career_features.pkl'
    joblib.dump(feature_names, features_path)

    return model, accuracy


def train_all_models():
    """Train all ML models."""
    print("=" * 50)
    print("Starting ML Model Training")
    print("=" * 50)

    # Generate datasets first
    print("\nGenerating datasets...")
    generate_all_datasets()

    # Train all models
    placement_model, placement_acc = train_placement_model()
    career_model, career_acc = train_career_model()

    print("\n" + "=" * 50)
    print("Training Complete!")
    print(f"Placement Prediction Model Accuracy: {placement_acc:.2%}")
    print(f"Career Recommendation Model Accuracy: {career_acc:.2%}")
    print("=" * 50)

    return {
        'placement_model': placement_model,
        'career_model': career_model,
    }


if __name__ == '__main__':
    train_all_models()
