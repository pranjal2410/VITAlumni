from django.contrib.auth import authenticate

from .models import *
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import update_last_login

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'contact']

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data['email'], password=validated_data['password'])

        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.contact = validated_data['contact']

        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)
    is_staff = serializers.BooleanField(default=False, read_only=True)
    name = serializers.CharField(max_length=255, read_only=True)
    is_otp_verified = serializers.BooleanField(default=False)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError('Invalid login Credentials')

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        update_last_login(None, user)

        return {
            'email': user.email,
            'token': token,
            'is_staff': user.is_staff,
            'name': user.first_name + ' ' + user.last_name,
            'is_otp_verified': user.otp_verified
        }
