from django.urls import path

from . import views

urlpatterns = [
    path("Communicate",views.answer,name="Communicate")
]

