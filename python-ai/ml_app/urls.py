from django.urls import path
from ml_app import views

urlpatterns = [
    path('health/', views.HealthCheckAPIView.as_view(), name='health-check'),
    path('predict-placement/', views.PredictPlacementAPIView.as_view(), name='predict-placement'),
    path('recommend-career/', views.RecommendCareerAPIView.as_view(), name='recommend-career'),
    path('learning-roadmap/', views.GenerateLearningRoadmapAPIView.as_view(), name='learning-roadmap'),
    path('analytics/', views.GetAnalyticsAPIView.as_view(), name='analytics'),
    path('upload-dataset/', views.UploadDatasetAPIView.as_view(), name='upload-dataset'),
    path('placement-statistics/', views.GetPlacementStatisticsAPIView.as_view(), name='placement-statistics'),
    path('careers/', views.GetAvailableCareersAPIView.as_view(), name='available-careers'),
    path('companies/', views.GetAvailableCompaniesAPIView.as_view(), name='available-companies'),
]
