from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import BranchSerializer
from .models import *


# Create your views here.
class BranchListView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches, many=True)
        serialized_branches = serializer.data
        context = {
            'branches': serialized_branches,
            'success': True
        }

        return Response(context, status=status.HTTP_200_OK)