from datetime import datetime

from .models import *
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class BranchSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    total_passed = serializers.IntegerField(default=0)
    registered_passed = serializers.IntegerField(default=0)
    total_staff = serializers.IntegerField(default=0)
    registered_staff = serializers.IntegerField(default=0)


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
