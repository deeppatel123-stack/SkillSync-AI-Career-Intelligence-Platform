"""
Main URL configuration for the ai_platform project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include ML app URLs under /api/ prefix
    path('api/', include('ml_app.urls')),
]
