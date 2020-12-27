from datetime import datetime, timedelta, date

from authentication.models import User
from authentication.serializers import UserSerializer
from .models import *
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['name', 'total_passed', 'registered_passed', 'total_staff', 'registered_staff']


class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Updates
        fields = ['text', 'created_on']

    def create(self, validated_data):
        update = Updates.objects.create(
            text=validated_data['text'],
            created_on=datetime.now(),
        )

        return update


class EditSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    contact = serializers.IntegerField(default=0)
    birthday = serializers.DateField()
    graduation = serializers.DateField()
    branch = serializers.CharField(max_length=50)

    def create(self, validated_data):
        user = User.objects.get(email=validated_data['email'])
        if user.last_edited is None:
            user.first_name = validated_data['first_name']
            user.last_name = validated_data['last_name']
        elif user.last_edited + timedelta(days=60) < date.today():
            user.first_name = validated_data['first_name']
            user.last_name = validated_data['last_name']
        user.contact = validated_data['contact']
        user.birthday = validated_data['birthday']
        profile = Profile.objects.get(user=user)
        profile.graduation = validated_data['graduation']
        profile.branch = Branch.objects.get(name=validated_data['branch'])
        user.last_edited = datetime.utcnow()

        user.save()
        profile.save()

        return profile

    def validate(self, data):
        return {
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'contact': data['contact'],
            'birthday': data['birthday'],
            'graduation': data['graduation'],
            'branch': data['branch'],
            'email': data['email']
        }


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ['email', 'graduation', 'user']

    def update(self, profile, validated_data):
        user_data = validated_data['user']
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        profile.user = user
        profile.graduation = validated_data['graduation']

        profile.save()

        return profile
