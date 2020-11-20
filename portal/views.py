from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


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


class FeedView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        feed = []
        updates = Updates.objects.all().order_by('-created_on')
        for update in updates:
            update_dict = {'text': update.text}
            if update.photo != 'null':
                update_dict['photo'] = update.photo.url
            if update.doc != 'null':
                update_dict['doc'] = update.doc.url
            update_dict['is_profile_pic'] = update.is_profile_pic
            update_dict['is_cover_pic'] = update.is_cover_pic
            update_dict['is_job_update'] = update.is_job_update
            update_dict['created_on'] = update.created_on
            update_dict['user'] = update.user.first_name + ' ' + update.user.last_name

            feed.append(update_dict)

        context = {
            'success': True,
            'feed': feed,
        }

        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        update_serializer = UpdateSerializer(data=request.data)
        if update_serializer.is_valid():
            update = update_serializer.save()
            if request.data['photo']:
                update.photo = request.data['photo']
            if request.data['doc']:
                update.doc = request.data['doc']
            update.user = request.user

            update.save()

            context = {
                'success': True,
                'message': 'Posted Successfully!',
            }

            return Response(context, status=status.HTTP_201_CREATED)

        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
