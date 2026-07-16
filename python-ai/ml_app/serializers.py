"""
Serializers for the ML app API endpoints.
Converts complex data types to JSON for the REST API.
"""

from rest_framework import serializers


class PlacementPredictionSerializer(serializers.Serializer):
    """Serializer for placement prediction input."""
    cgpa = serializers.FloatField(min_value=0, max_value=10)
    skills_count = serializers.IntegerField(min_value=0)
    internship_count = serializers.IntegerField(min_value=0)
    projects_count = serializers.IntegerField(min_value=0)
    certifications_count = serializers.IntegerField(min_value=0)
    aptitude_score = serializers.IntegerField(min_value=0, max_value=100)
    communication_score = serializers.IntegerField(min_value=0, max_value=100)


class CareerRecommendationSerializer(serializers.Serializer):
    """Serializer for career recommendation input."""
    html_css = serializers.FloatField(min_value=0, max_value=1, default=0)
    javascript = serializers.FloatField(min_value=0, max_value=1, default=0)
    react = serializers.FloatField(min_value=0, max_value=1, default=0)
    python = serializers.FloatField(min_value=0, max_value=1, default=0)
    database = serializers.FloatField(min_value=0, max_value=1, default=0)
    cloud = serializers.FloatField(min_value=0, max_value=1, default=0)
    networking = serializers.FloatField(min_value=0, max_value=1, default=0)
    security = serializers.FloatField(min_value=0, max_value=1, default=0)
    devops = serializers.FloatField(min_value=0, max_value=1, default=0)
    data_science = serializers.FloatField(min_value=0, max_value=1, default=0)
    ai_ml = serializers.FloatField(min_value=0, max_value=1, default=0)
    dsa = serializers.FloatField(min_value=0, max_value=1, default=0)


class LearningRoadmapSerializer(serializers.Serializer):
    """Serializer for learning roadmap input."""
    career = serializers.CharField()
    skills = serializers.ListField(child=serializers.CharField(), required=False)


class AnalyticsSerializer(serializers.Serializer):
    """Serializer for analytics requests."""
    dataset_type = serializers.ChoiceField(
        choices=['placement', 'student', 'career'],
        required=True
    )


class DatasetUploadSerializer(serializers.Serializer):
    """Serializer for dataset upload."""
    dataset_type = serializers.ChoiceField(
        choices=['placement', 'student', 'career'],
        required=True
    )
