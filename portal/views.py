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
        context = {
            'success': True,
            'feed': getFeed(request.user, True)
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


class GreetView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        if request.user.is_staff:
            person = Staff.objects.get(user=request.user)
        else:
            person = Alumni.objects.get(user=request.user)
        update_id = request.data.get('id')
        update = Updates.objects.get(id=update_id)
        try:
            person.greeted.get(id=update_id)
            person.greeted.remove(Updates.objects.get(id=update_id))
            update.greets -= 1
        except Updates.DoesNotExist:
            person.greeted.add(Updates.objects.get(id=update_id))
            update.greets += 1
        update.save()
        person.save()
        context = {
            'success': True
        }
        return Response(context, status=status.HTTP_200_OK)


class OperateUpdateView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        update = Updates.objects.get(id=request.data['id'])
        update.delete()
        return Response(status=status.HTTP_200_OK)


class UserProfileView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        user = request.user
        if user.is_staff:
            person = Staff.objects.get(user=user)
        else:
            person = Alumni.objects.get(user=user)
        try:
            person_updates = Updates.objects.filter(user=user).order_by('-created_on')
        except Updates.DoesNotExist:
            person_updates = []
        user_context = {'name': user.first_name + ' ' + user.last_name, 'email': user.email}
        for update in person_updates:
            if update.is_profile_pic:
                user_context['profile_pic'] = update.photo.url
                break
        for update in person_updates:
            if update.is_cover_pic:
                user_context['cover_pic'] = update.photo.url

        user_context['is_staff'] = user.is_staff
        user_context['connections'] = len(person.connections.all())
        user_context['date_joined'] = user.date_registered

        feed_context = getFeed(user)

        context = {
            'user_data': user_context,
            'feed_data': feed_context,
        }
        return Response(context, status=status.HTTP_200_OK)


def getFeed(user, all_feed=False):
    if all_feed:
        updates = Updates.objects.all().order_by('-created_on')
    else:
        updates = Updates.objects.filter(user=user).order_by('-created_on')
    if user.is_staff:
        person = Staff.objects.get(user=user)
    else:
        person = Alumni.objects.get(user=user)
    greeted_list = person.greeted
    feed = []
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
        dp_update = Updates.objects.filter(user=update.user, is_profile_pic=True).order_by('-created_on')
        update_dict['user_dp'] = dp_update.first().photo.url if len(dp_update) > 0 else update.user.first_name[
            0].upper()
        update_dict['id'] = update.id
        update_dict['greets'] = len(update.staff_set.all()) + len(update.alumni_set.all())
        update_dict['by_self'] = update.user == user
        try:
            greeted_list.get(id=update.id)
            update_dict['is_greeted'] = True
        except Updates.DoesNotExist:
            update_dict['is_greeted'] = False

        feed.append(update_dict)

    return feed
