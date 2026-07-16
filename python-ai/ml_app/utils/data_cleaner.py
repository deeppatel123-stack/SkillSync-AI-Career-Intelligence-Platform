"""
Utility functions for cleaning and preparing datasets using Pandas.
"""

import pandas as pd
import numpy as np


def clean_dataset(df):
    """
    Clean a dataset by removing duplicates and handling missing values.
    
    Args:
        df: pandas DataFrame
    
    Returns:
        Cleaned pandas DataFrame
    """
    # Create a copy to avoid modifying the original
    df_clean = df.copy()

    # Remove duplicate rows
    before_count = len(df_clean)
    df_clean = df_clean.drop_duplicates()
    after_count = len(df_clean)
    duplicates_removed = before_count - after_count

    # Handle missing values
    # For numeric columns, fill with median
    numeric_cols = df_clean.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df_clean[col].isnull().any():
            df_clean[col] = df_clean[col].fillna(df_clean[col].median())

    # For text columns, fill with empty string or mode
    text_cols = df_clean.select_dtypes(include=['object']).columns
    for col in text_cols:
        if df_clean[col].isnull().any():
            df_clean[col] = df_clean[col].fillna('')

    missing_handled = int(before_count - df_clean.isnull().sum().sum())

    return df_clean, {
        'duplicates_removed': duplicates_removed,
        'missing_values_handled': missing_handled,
        'rows_before': before_count,
        'rows_after': after_count
    }


def validate_csv_structure(df, required_columns):
    """
    Validate that a CSV has the required columns.
    
    Args:
        df: pandas DataFrame
        required_columns: list of column names that must exist
    
    Returns:
        (is_valid, missing_columns)
    """
    df_columns = set(df.columns.str.lower())
    required_lower = [col.lower() for col in required_columns]

    missing = []
    for col in required_lower:
        if col not in df_columns:
            missing.append(col)

    is_valid = len(missing) == 0
    return is_valid, missing


def prepare_placement_features(df):
    """
    Prepare feature matrix for placement prediction.
    Expects columns: cgpa, skills_count, internship_count, projects_count,
                     certifications_count, aptitude_score, communication_score
    """
    required_cols = [
        'cgpa', 'skills_count', 'internship_count', 'projects_count',
        'certifications_count', 'aptitude_score', 'communication_score'
    ]

    # Map column names (handle different cases)
    df_renamed = df.rename(columns=str.lower)

    features = pd.DataFrame()
    for col in required_cols:
        if col in df_renamed.columns:
            features[col] = pd.to_numeric(df_renamed[col], errors='coerce')
        else:
            features[col] = 0

    # Fill any NaN values
    features = features.fillna(0)

    return features


def prepare_career_features(df):
    """
    Prepare feature matrix for career recommendation.
    Expects skill score columns.
    """
    required_cols = [
        'html_css', 'javascript', 'react', 'python', 'database', 'cloud',
        'networking', 'security', 'devops', 'data_science', 'ai_ml', 'dsa'
    ]

    df_renamed = df.rename(columns=str.lower)

    features = pd.DataFrame()
    for col in required_cols:
        if col in df_renamed.columns:
            features[col] = pd.to_numeric(df_renamed[col], errors='coerce')
        else:
            features[col] = 0

    features = features.fillna(0)
    return features


def generate_skill_distribution(df, skill_column='skills'):
    """Count occurrences of each skill in a dataset."""
    all_skills = []
    for skills_str in df[skill_column].dropna():
        skill_list = [s.strip() for s in str(skills_str).split(',')]
        all_skills.extend(skill_list)

    skill_counts = pd.Series(all_skills).value_counts()
    return skill_counts.to_dict()


def generate_department_report(df):
    """Generate placement report grouped by department/career domain."""
    if 'career_domain' not in df.columns or 'placement' not in df.columns:
        return {}

    report = df.groupby('career_domain').agg(
        total_students=('placement', 'count'),
        placed_students=('placement', 'sum'),
        placement_percentage=('placement', 'mean')
    ).reset_index()

    report['placement_percentage'] = (report['placement_percentage'] * 100).round(1)
    return report.to_dict('records')


def generate_company_hiring_report(df):
    """Generate hiring report grouped by company."""
    if 'company_joined' not in df.columns:
        return {}

    report = df.groupby('company_joined').agg(
        total_hired=('student_id', 'count'),
        avg_package=('package', 'mean')
    ).reset_index()

    report['avg_package'] = report['avg_package'].round(2)
    # Filter out "Not Placed"
    report = report[report['company_joined'] != 'Not Placed']
    report = report.sort_values('total_hired', ascending=False)

    return report.to_dict('records')
