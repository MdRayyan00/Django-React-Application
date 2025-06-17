from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/<int:pk>/', views.NoteDetail.as_view(), name='note-detail'),
    path('users/', views.UserList.as_view(), name='user-list'),
]