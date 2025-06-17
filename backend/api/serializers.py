from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields  = ["id","username"]
        # extra_kwargs = {"password":{"write_only": True}}
        
    def create(self,validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializers(serializers.ModelSerializer):
    # Accept usernames for collaborators on create/update
    collaborators = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    collaborators_info = UserSerializer(source='collaborators', many=True, read_only=True)
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'author', 'author_username',
            'collaborators', 'collaborators_info', 'created_at'
        ]
        extra_kwargs = {'author': {'read_only': True}}

    def create(self, validated_data):
        collaborator_usernames = validated_data.pop('collaborators', [])
        note = Note.objects.create(**validated_data)
        if collaborator_usernames:
            users = User.objects.filter(username__in=collaborator_usernames)
            note.collaborators.set(users)
        return note

    def update(self, instance, validated_data):
        collaborator_usernames = validated_data.pop('collaborators', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if collaborator_usernames is not None:
            users = User.objects.filter(username__in=collaborator_usernames)
            instance.collaborators.set(users)
        return instance


