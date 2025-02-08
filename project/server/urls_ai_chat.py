from django.urls import path

from . import views

urlpatterns = [
    path("Communicate",views.answer,name="Communicate"),
    path("GenHeadMessageId",views.gen_head_message_id,name="GenHeadMessageId")
]


