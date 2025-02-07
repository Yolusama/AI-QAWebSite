from django.urls import path

from . import views

urlpatterns = [
    path("Heartbeat",views.heartbeat,name="Heartbeat")
]