import random

from django.conf import settings
from django.core.mail import send_mail
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
        try:
            profile = Alumni.objects.get(email=request.data['email'])
        except Alumni.DoesNotExist:
            try:
                profile = Staff.objects.get(email=request.data['email'])
                flag = True
            except Staff.DoesNotExist:
                context = {
                    'message': 'Profile related to this email not found'
                }
                return Response(context, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.save()
            user.is_staff = flag
            profile.user = user
            user.save()
            profile.save()
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)

            context = {
                'message': 'Registered successfully!',
                'token': token,
                'is_otp_verified': user.otp_verified,
                'success': True
            }

            return Response(context, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        staff = ['shripad.bhatlawande@vit.edu',
                 'swati.shilaskar@vit.edu',
                 'shital.raut@vit.edu',
                 'rupali.tornekar@vit.edu',
                 'sunil.tayde@vit.edu',
                 'ashwini.barbadekar@vit.edu',
                 'joyti.madake@vit.edu',
                 'suhas.bhise@vit.edu',
                 'siddharth.bhorge@vit.edu',
                 'mrunal.shidore@vit.edu',
                 'abhay.chopde@vit.edu',
                 'pooja.kulkarni@vit.edu',
                 'milind.kamble@vit.edu',
                 'vijay.mane@vit.edu',
                 'bharat.taralekar@vit.edu',
                 'medha.wyawahare@vit.edu',
                 'milind.tirmare@vit.edu',
                 'vaishali.jabade@vit.edu']
        for email in staff:
            try:
                Staff.objects.get(email=email)
            except Staff.DoesNotExist:
                Staff.objects.create(email=email).save()
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            context = {
                'message': 'Logged in successfully!',
                'token': serializer.data.get('token'),
                'is_staff': serializer.data.get('is_staff'),
                'success': True,
                'is_otp_verified': serializer.data.get('is_otp_verified')
            }
            return Response(context, status=status.HTTP_200_OK)

        context = {
            'message': 'Failed to login',
            'success': False
        }

        return Response(context, status=status.HTTP_401_UNAUTHORIZED)


class VerifyView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            otp = OTP.objects.get(user=request.user)
            key = random.randint(1000, 9999)
            otp.otp = key
            otp.created = datetime.now()
            otp.counter += 1
        except OTP.DoesNotExist:
            otp = OTP.objects.create(user=request.user, otp=random.randint(1000, 9999), counter=1)
        otp.save()

        try:
            send_mail(
                'OTP for Verification of email',
                f"Dear {request.user.first_name} {request.user.last_name},\nThe One Time Password required for "
                f"verification of email provided - {request.user.email} is given below.\n\nOTP : {otp.otp}\nThank you",
                settings.EMAIL_HOST_USER,
                ["newalkarpranjal2410.pn@gmail.com"],
                fail_silently=False
            )
            context = {
                'success': 'True',
                'message': 'Email sent successfully!',
            }
            return Response(context, status=status.HTTP_200_OK)
        except Exception as e:
            context = {
                'success': 'False',
                'message': 'Could not send email. Please try again later',
            }
            return Response(context, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        user = request.user
        key = request.data.get('otp')
        try:
            otp = OTP.objects.get(user=user, otp=key)
            user.otp_verified = True
            user.save()
            context = {
                'message': 'Email verified successfully!',
                'success': True,
            }
            return Response(context, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            context = {
                'message': 'OTP entered is incorrect!',
                'success': False,
            }
            return Response(context, status=status.HTTP_401_UNAUTHORIZED)
