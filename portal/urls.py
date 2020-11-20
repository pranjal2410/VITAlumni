from django.urls import path
from .views import *

urlpatterns = [
    path('branch-list/', BranchListView.as_view(), name='branch-list'),
    path('updates/', FeedView.as_view(), name='feed')
]
