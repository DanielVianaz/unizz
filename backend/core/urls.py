from django.urls import path
from . import views

urlpatterns = [
    path('reserva/', views.criar_reserva, name='api-reserva'),
    path('contacto/', views.criar_contacto, name='api-contacto'),
]
