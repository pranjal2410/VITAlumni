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
            'user_data': getUserProfile(Profile.objects.get(user=request.user)),
            'feed': getFeed(request.user, True),
            'connection_list': getConnectionList(Profile.objects.get(user=request.user))
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
        person = Profile.objects.get(user=request.user)
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
        person = Profile.objects.get(user=user)
        user_context = getUserProfile(person)

        feed_context = getFeed(user)

        context = {
            'user_data': user_context,
            'feed_data': feed_context,
        }
        return Response(context, status=status.HTTP_200_OK)


class PendingView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        pending_list = []
        for pending in Connection.objects.filter(receiver=profile.email, approved=False):
            pending_list.append({
                'email': pending.sender.email,
                'name': pending.user.first_name + ' ' + pending.user.last_name,
                'profile_pic': pending.user.profile_pic.photo.url if pending.user.profile_pic else None
            })
        context = {
            'pending_list': pending_list,
            'success': True,
        }

        return Response(context, status=status.HTTP_200_OK)


def getFeed(user, all_feed=False):
    if all_feed:
        updates = Updates.objects.all().order_by('-created_on')
    else:
        updates = Updates.objects.filter(user=user).order_by('-created_on')
    person = Profile.objects.get(user=user)
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
        update_dict['user_dp'] = update.user.profile_pic.photo.url if update.user.profile_pic else update.user.first_name[
            0].upper()
        update_dict['id'] = update.id
        update_dict['greets'] = len(update.profile_set.all())
        update_dict['by_self'] = update.user == user
        try:
            greeted_list.get(id=update.id)
            update_dict['is_greeted'] = True
        except Updates.DoesNotExist:
            update_dict['is_greeted'] = False

        feed.append(update_dict)

    return feed


def getUserProfile(profile):
    updates = Updates.objects.filter(user=profile.user).order_by('-created_on')
    user_context = {'name': profile.user.first_name + ' ' + profile.user.last_name, 'email': profile.user.email}
    for update in updates:
        if update.is_profile_pic:
            user_context['profile_pic'] = update.photo.url
            break
    if profile.user.profile_pic is not None:
        user_context['profile_pic'] = profile.user.profile_pic.photo.url
    if profile.user.cover_pic is not None:
        user_context['cover_pic'] = profile.user.cover_pic.photo.url

    user_context['is_staff'] = profile.is_college_staff
    user_context['connections'] = len(profile.connections.all())
    user_context['date_joined'] = profile.user.date_registered
    user_context['birthday'] = profile.user.birthday
    user_context['branch'] = profile.branch
    user_context['contact'] = profile.user.contact

    return user_context


def getConnectionList(profile):
    connection_list = []
    for connection in profile.connections.all():
        connection_list.append({
            'email': connection.email,
            'name': connection.user.first_name + ' ' + connection.user.last_name,
            'profile_pic': connection.user.profile_pic.photo.url if connection.user.profile_pic else None
        })

    return connection_list
