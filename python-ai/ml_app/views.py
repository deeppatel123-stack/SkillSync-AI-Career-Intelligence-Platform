import json
import csv
import io
import pandas as pd
from pathlib import Path

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ml_app.ml_models.placement_predictor import predict_placement
from ml_app.ml_models.career_recommender import recommend_career
from ml_app.ml_models.learning_roadmap import generate_roadmap

from ml_app.serializers import (
    PlacementPredictionSerializer,
    CareerRecommendationSerializer,
    LearningRoadmapSerializer,
)
from ml_app.utils.data_cleaner import (
    generate_skill_distribution,
    generate_department_report,
    generate_company_hiring_report,
)


class HealthCheckAPIView(APIView):
    def get(self, request):
        return Response({
            'status': 'ok',
            'service': 'SkillSync AI Platform',
            'version': '1.0.0'
        })


class PredictPlacementAPIView(APIView):
    def post(self, request):
        serializer = PlacementPredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = predict_placement(
            cgpa=data['cgpa'],
            skills_count=data['skills_count'],
            internship_count=data['internship_count'],
            projects_count=data['projects_count'],
            certifications_count=data['certifications_count'],
            aptitude_score=data['aptitude_score'],
            communication_score=data['communication_score']
        )
        return Response(result)


class RecommendCareerAPIView(APIView):
    def post(self, request):
        serializer = CareerRecommendationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        result = recommend_career(serializer.validated_data)
        return Response(result)


class GenerateLearningRoadmapAPIView(APIView):
    def post(self, request):
        serializer = LearningRoadmapSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = generate_roadmap(data['career'], data.get('skills', []))
        return Response(result)


class GetAnalyticsAPIView(APIView):
    def get(self, request):
        dataset_type = request.query_params.get('dataset_type', 'student')
        datasets_dir = Path(__file__).resolve().parent / 'datasets'
        dataset_path = datasets_dir / f'{dataset_type}_data.csv'

        if not dataset_path.exists():
            return Response({
                'error': f'Dataset {dataset_type}_data.csv not found.'
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            df = pd.read_csv(dataset_path)
            result = {}

            if 'skills' in df.columns:
                result['skill_distribution'] = generate_skill_distribution(df)
            if 'career_domain' in df.columns:
                result['department_report'] = generate_department_report(df)
            if 'company_joined' in df.columns:
                result['company_report'] = generate_company_hiring_report(df)

            result['total_records'] = len(df)
            result['columns'] = list(df.columns)
            return Response(result)

        except Exception as e:
            return Response({
                'error': f'Error processing dataset: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadDatasetAPIView(APIView):
    def post(self, request):
        dataset_type = request.data.get('dataset_type')
        file = request.FILES.get('file')

        if not dataset_type:
            return Response({'error': 'dataset_type is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not file:
            return Response({'error': 'file is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not file.name.endswith('.csv'):
            return Response({'error': 'Only CSV files are accepted.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            content = file.read().decode('utf-8')
            csv_reader = csv.reader(io.StringIO(content))
            headers = next(csv_reader)

            datasets_dir = Path(__file__).resolve().parent / 'datasets'
            datasets_dir.mkdir(exist_ok=True)

            file_path = datasets_dir / f'{dataset_type}_data.csv'
            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                f.write(content)

            return Response({
                'success': True,
                'message': f'{dataset_type} dataset uploaded successfully.',
                'file_path': str(file_path),
                'columns': headers,
                'rows': sum(1 for _ in csv_reader)
            })

        except Exception as e:
            return Response({
                'error': f'Error uploading dataset: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAvailableCareersAPIView(APIView):
    def get(self, request):
        careers = [
            'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
            'AI Engineer', 'Data Analyst', 'DevOps', 'Cloud Engineer', 'Cyber Security'
        ]
        return Response({'careers': careers})


class GetAvailableCompaniesAPIView(APIView):
    def get(self, request):
        companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Flipkart', 'Swiggy', 'Zomato', 'Razorpay']
        return Response({'companies': companies})


class GetPlacementStatisticsAPIView(APIView):
    def get(self, request):
        datasets_dir = Path(__file__).resolve().parent / 'datasets'
        dataset_path = datasets_dir / 'placement_data.csv'

        if not dataset_path.exists():
            return Response({'error': 'Placement dataset not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            df = pd.read_csv(dataset_path)
            total_students = len(df)
            placed_students = int(df['placement'].sum())

            return Response({
                'total_students': total_students,
                'placed_students': placed_students,
                'not_placed': total_students - placed_students,
                'placement_percentage': round((placed_students / total_students) * 100, 2),
                'avg_cgpa': round(float(df['cgpa'].mean()), 2),
                'avg_aptitude': round(float(df['aptitude_score'].mean()), 2),
                'avg_communication': round(float(df['communication_score'].mean()), 2),
            })

        except Exception as e:
            return Response({'error': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
