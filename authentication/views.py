from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings
from rest_framework import status
from django.contrib.auth.models import update_last_login

from portal.models import Alumni, Staff
from .models import *
from .serializers import UserSerializer, LoginSerializer

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


# Create your views here.
class RegisterView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        flag = False
        # try:
        #     profile = Alumni.objects.get(email=request.data['email'])
        # except Alumni.DoesNotExist:
        #     try:
        #         profile = Staff.objects.get(email=request.data['email'])
        #         flag = True
        #     except Staff.DoesNotExist:
        #         context = {
        #             'message': 'Profile related to this email not found'
        #         }
        #         return Response(context, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.save()
            user.is_staff = flag
            # profile.user = user
            user.save()
            # profile.save()
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)

            context = {
                'message': 'Registered successfully!',
                'token': token,
                'success': True
            }

            return Response(context, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            context = {
                'message': 'Logged in successfully!',
                'token': serializer.data.get('token'),
                'is_staff': serializer.data['is_staff'],
                'success': True
            }
            return Response(context, status=status.HTTP_200_OK)

        context = {
            'message': 'Failed to login',
            'success': False
        }

        return Response(context, status=status.HTTP_401_UNAUTHORIZED)
