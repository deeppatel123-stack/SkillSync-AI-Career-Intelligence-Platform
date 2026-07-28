from django.urls import path
from ml_app import views

urlpatterns = [
    path('health/', views.health, name='health'),
    path('careers/', views.careers, name='careers'),
    path('profile-analysis/', views.profile_analysis, name='profile-analysis'),
    path('career-role/', views.career_role, name='career-role'),
    path('skill-gap/', views.skill_gap, name='skill-gap'),
    path('learning-roadmap/', views.learning_roadmap, name='learning-roadmap'),
]
