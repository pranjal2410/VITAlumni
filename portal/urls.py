from django.urls import path
from .views import *

urlpatterns = [
    path('branch-list/', BranchListView.as_view(), name='branch-list'),
    path('updates/', FeedView.as_view(), name='feed'),
    path('greet/', GreetView.as_view(), name='greet'),
    path('delete-update/', OperateUpdateView.as_view(), name='delete-update'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('get-pending-list/', PendingView.as_view(), name='pending-list'),
]
