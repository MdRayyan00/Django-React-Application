from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import UserSerializer, NoteSerializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from django.db.models import Q



class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializers
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user 
        return Note.objects.filter(Q(author=user) | Q(collaborators=user)).distinct()
        
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
            
class IsAuthorOrCollaborator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method in ['PUT', 'PATCH']:
            return request.user == obj.author or request.user in obj.collaborators.all()
        elif request.method == 'DELETE':
            return request.user == obj.author
        return False
    
class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializers
    permission_classes = [IsAuthenticated, IsAuthorOrCollaborator]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(Q(author=user) | Q(collaborators=user)).distinct()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    