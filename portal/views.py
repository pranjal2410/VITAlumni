from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import User
from .serializers import *
from .models import *
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


# Create your views here.
class HomeView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        notices = getNotices(Updates.objects.filter(is_notice=True).order_by('-created_on')[:5])

        context = {
            'success': True,
            'notices': notices,
        }

        return Response(context, status=status.HTTP_200_OK)


class BranchListView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches, many=True)
        serialized_branches = serializer.data
        for branch in serialized_branches:
            years = set([profile.graduation.year for profile in Profile.objects.filter(branch__name=branch['name'])])
            history = []
            for year in years:
                history.append({
                    'year': year,
                    'total_registered': Profile.objects.filter(branch__name=branch['name'], graduation__year=year).count()
                })
            branch['history'] = history
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
            if update.is_profile_pic:
                update.user.profile_pic = update
            elif update.is_cover_pic:
                update.user.cover_pic = update
            update.user.save()

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
                'name': pending.sender.user.first_name + ' ' + pending.sender.user.last_name,
                'profile_pic': pending.sender.user.profile_pic.photo.url if pending.sender.user.profile_pic else None,
                'approved': pending.approved
            })
        context = {
            'pending_list': pending_list,
            'success': True,
        }

        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        email = request.data['email']
        sender = Profile.objects.get(email=email)
        connection = Connection.objects.get(sender=sender, receiver=profile.email)
        connection.approved = True
        connection.save()
        try:
            connection = Connection.objects.get(sender=profile, receiver=sender.email)
            connection.approved = True
            connection.save()
        except Connection.DoesNotExist:
            pass
        profile.connections.add(sender)
        sender.connections.add(profile)
        sender.save()
        profile.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        people = getPeople(request.data['search'], request.user)

        context = {
            'people': people,
            'success': True
        }

        return Response(context, status=status.HTTP_200_OK)


class RequestView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        email = request.data['email']
        try:
            Connection.objects.get(sender=Profile.objects.get(email=email), receiver=request.user.email)
        except Connection.DoesNotExist:
            Connection.objects.create(sender=Profile.objects.get(user=request.user), receiver=email).save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PersonProfileView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        user = User.objects.get(slug=request.data['slug'])
        person = Profile.objects.get(user=user)
        user_context = getUserProfile(Profile.objects.get(user=request.user))
        person_context = getUserProfile(person, Profile.objects.get(user=request.user))

        feed_context = getFeed(user=user, request_user=request.user)

        context = {
            'user_data': user_context,
            'person_data': person_context,
            'feed_data': feed_context,
        }
        return Response(context, status=status.HTTP_200_OK)


class EditProfileView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        user_context = getUserProfile(Profile.objects.get(user=request.user))
        user_context['first_name'] = request.user.first_name
        user_context['last_name'] = request.user.last_name

        context = {
            'user_data': user_context,
            'success': True,
        }

        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EditSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            context = {
                'success': True,
            }

            return Response(context, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


def getFeed(user, all_feed=False, request_user=None):
    if all_feed:
        updates = Updates.objects.all().order_by('-created_on')
    else:
        updates = Updates.objects.filter(user=user).order_by('-created_on')
    if request_user is not None:
        person = Profile.objects.get(user=request_user)
    else:
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
        update_dict['user_dp'] = update.user.profile_pic.photo.url if update.user.profile_pic else \
            update.user.first_name[
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


def getUserProfile(profile, user_profile=None):
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
    user_context['branch'] = profile.branch.name if profile.branch is not None else ''
    user_context['contact'] = profile.user.contact
    user_context['graduation'] = profile.graduation

    if user_profile is not None:
        try:
            is_approved = Connection.objects.get(sender=profile,
                                                 receiver=user_profile.user.email).approved
            is_sent = True
        except Connection.DoesNotExist:
            try:
                is_approved = Connection.objects.get(sender=user_profile,
                                                     receiver=profile.user.email).approved
                is_sent = True
            except Connection.DoesNotExist:
                is_approved = False
                is_sent = False
        user_context['is_approved'] = is_approved
        user_context['is_sent'] = is_sent

    return user_context


def getConnectionList(profile):
    connection_list = []
    for connection in profile.connections.all():
        connection_list.append({
            'email': connection.email,
            'name': connection.user.first_name + ' ' + connection.user.last_name,
            'profile_pic': connection.user.profile_pic.photo.url if connection.user.profile_pic else None,
            'slug': connection.user.slug
        })

    return connection_list


def getPeople(search, request_user):
    people = []
    if len(search.split(' ')) > 1:
        user_list = User.objects.filter(first_name__contains=search.split(' ')[0],
                                        last_name__contains=search.split(' ')[1])
    else:
        user_list = set(list(User.objects.filter(first_name__contains=search)) +
                        list(User.objects.filter(last_name__contains=search)))
    for user in user_list:
        if not user.is_superuser and not user == request_user:
            try:
                is_approved = Connection.objects.get(sender=Profile.objects.get(user=request_user),
                                                     receiver=user.email).approved
                is_sent = True
            except Connection.DoesNotExist:
                try:
                    is_approved = Connection.objects.get(sender=Profile.objects.get(user=user),
                                                         receiver=request_user.email).approved
                    is_sent = True
                except Connection.DoesNotExist:
                    is_approved = False
                    is_sent = False
            people.append({
                'email': user.email,
                'name': user.first_name + ' ' + user.last_name,
                'profile_pic': user.profile_pic.photo.url if user.profile_pic else None,
                'is_approved': is_approved,
                'is_sent': is_sent,
                'slug': user.slug,
            })

    return people


def getNotices(updates):
    notices = []
    for update in updates:
        notices.append({
            'created_on': update.created_on,
            'title': update.title,
            'text': update.text,
            'photo': update.photo.url if update.photo != 'null' else None,
            'doc': update.doc.url if update.doc != 'null' else None,
            'posted_by': update.user.first_name + ' ' + update.user.last_name,
            'email': update.user.email
        })
    return notices
