"""
Generate synthetic datasets for training ML models.
This creates sample data so the models can be trained and used for predictions.
"""

import pandas as pd
import numpy as np
import os
from pathlib import Path


def generate_placement_dataset():
    """
    Generate a synthetic placement dataset.
    Features: CGPA, skills count, internship count, projects count,
              certifications count, aptitude score, communication score
    Target: placement (0 = No, 1 = Yes)
    """
    np.random.seed(42)
    num_samples = 1000

    data = {
        'cgpa': np.round(np.random.uniform(5.0, 10.0, num_samples), 1),
        'skills_count': np.random.randint(1, 10, num_samples),
        'internship_count': np.random.randint(0, 5, num_samples),
        'projects_count': np.random.randint(1, 8, num_samples),
        'certifications_count': np.random.randint(0, 6, num_samples),
        'aptitude_score': np.random.randint(40, 100, num_samples),
        'communication_score': np.random.randint(30, 100, num_samples),
    }

    df = pd.DataFrame(data)

    # Create a realistic placement label based on features
    # Students with higher CGPA, more skills, internships, etc. are more likely placed
    placement_score = (
        (df['cgpa'] / 10.0) * 0.30 +
        (df['skills_count'] / 10.0) * 0.15 +
        (df['internship_count'] / 5.0) * 0.15 +
        (df['projects_count'] / 8.0) * 0.10 +
        (df['certifications_count'] / 6.0) * 0.10 +
        (df['aptitude_score'] / 100.0) * 0.10 +
        (df['communication_score'] / 100.0) * 0.10
    )

    # Add some random noise
    noise = np.random.normal(0, 0.05, num_samples)
    placement_score = placement_score + noise

    # Threshold: if score > 0.55, student is placed
    df['placement'] = (placement_score > 0.55).astype(int)

    # Add some student IDs
    df['student_id'] = [f'STU{i:04d}' for i in range(1, num_samples + 1)]

    return df


def generate_career_dataset():
    """
    Generate synthetic dataset for career recommendation.
    Features: Skill scores in different areas
    Target: Career domain
    """
    np.random.seed(42)
    num_samples = 500

    # Define career paths and their skill profiles
    careers = {
        'Frontend Developer': {'html_css': 0.9, 'javascript': 0.85, 'react': 0.8,
                               'python': 0.3, 'database': 0.2, 'cloud': 0.2,
                               'networking': 0.1, 'security': 0.1, 'devops': 0.1,
                               'data_science': 0.1, 'ai_ml': 0.1, 'dsa': 0.4},
        'Backend Developer': {'html_css': 0.3, 'javascript': 0.5, 'react': 0.2,
                              'python': 0.7, 'database': 0.85, 'cloud': 0.6,
                              'networking': 0.3, 'security': 0.3, 'devops': 0.5,
                              'data_science': 0.2, 'ai_ml': 0.1, 'dsa': 0.7},
        'Full Stack Developer': {'html_css': 0.8, 'javascript': 0.8, 'react': 0.7,
                                 'python': 0.6, 'database': 0.7, 'cloud': 0.5,
                                 'networking': 0.3, 'security': 0.3, 'devops': 0.4,
                                 'data_science': 0.2, 'ai_ml': 0.1, 'dsa': 0.6},
        'AI Engineer': {'html_css': 0.2, 'javascript': 0.3, 'react': 0.1,
                        'python': 0.9, 'database': 0.4, 'cloud': 0.5,
                        'networking': 0.2, 'security': 0.2, 'devops': 0.3,
                        'data_science': 0.8, 'ai_ml': 0.9, 'dsa': 0.7},
        'Data Analyst': {'html_css': 0.3, 'javascript': 0.3, 'react': 0.1,
                         'python': 0.7, 'database': 0.7, 'cloud': 0.3,
                         'networking': 0.1, 'security': 0.1, 'devops': 0.1,
                         'data_science': 0.85, 'ai_ml': 0.4, 'dsa': 0.5},
        'DevOps': {'html_css': 0.1, 'javascript': 0.3, 'react': 0.1,
                   'python': 0.6, 'database': 0.5, 'cloud': 0.9,
                   'networking': 0.7, 'security': 0.6, 'devops': 0.9,
                   'data_science': 0.2, 'ai_ml': 0.1, 'dsa': 0.4},
        'Cloud Engineer': {'html_css': 0.1, 'javascript': 0.2, 'react': 0.1,
                           'python': 0.5, 'database': 0.5, 'cloud': 0.95,
                           'networking': 0.8, 'security': 0.7, 'devops': 0.7,
                           'data_science': 0.2, 'ai_ml': 0.1, 'dsa': 0.3},
        'Cyber Security': {'html_css': 0.2, 'javascript': 0.3, 'react': 0.1,
                           'python': 0.6, 'database': 0.4, 'cloud': 0.5,
                           'networking': 0.8, 'security': 0.95, 'devops': 0.4,
                           'data_science': 0.2, 'ai_ml': 0.2, 'dsa': 0.5},
    }

    rows = []
    labels = []

    for career, skills in careers.items():
        for _ in range(num_samples // len(careers)):
            row = {}
            for skill, base_val in skills.items():
                # Add some random variation
                noise = np.random.normal(0, 0.1)
                val = min(1.0, max(0.0, base_val + noise))
                row[skill] = round(val, 2)
            rows.append(row)
            labels.append(career)

    df = pd.DataFrame(rows)
    df['career'] = labels

    return df


def generate_all_datasets():
    """Generate all datasets and save them to CSV files."""
    datasets_dir = Path(__file__).resolve().parent.parent / 'datasets'
    datasets_dir.mkdir(exist_ok=True)

    print("Generating placement dataset...")
    placement_df = generate_placement_dataset()
    placement_path = datasets_dir / 'placement_data.csv'
    placement_df.to_csv(placement_path, index=False)
    print(f"Saved to {placement_path}")

    print("Generating career dataset...")
    career_df = generate_career_dataset()
    career_path = datasets_dir / 'career_data.csv'
    career_df.to_csv(career_path, index=False)
    print(f"Saved to {career_path}")

    print("All datasets generated successfully!")
    return placement_df, career_df


if __name__ == '__main__':
    generate_all_datasets()
