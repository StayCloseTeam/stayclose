from .models import User, Circle, Content, Comments
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, CircleSerializer, ContentSerializer, CommentsSerializer
from django.db.models import Q

class LoggedInUserView(APIView):
  def get(self, request, format=None):
    current_user = self.request.user

    return Response(UserSerializer(current_user).data)


class UserViewSet(viewsets.ModelViewSet):
  """
  API Endpoint that allows users to be viewed or edited.
  """
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [
    permissions.AllowAny
  ]

class CircleViewSet(viewsets.ModelViewSet):
  """
  API Endpoint that allows circles to be viewed or edited.
  """
  queryset = Circle.objects.all()
  permission_classes = [
    permissions.AllowAny
  ]
  serializer_class = CircleSerializer

class ContentViewSet(viewsets.ModelViewSet):
  """
  API Endpoint that allows content to be viewed or edited.
  """
  queryset = Content.objects.all()
  serializer_class = ContentSerializer
  permission_classes = [
    permissions.AllowAny
  ]


class CommentsViewSet(viewsets.ModelViewSet):
  """
  API Endpoint that allows comments to be viewed or edited.
  """
  queryset = Comments.objects.all()
  serializer_class = CommentsSerializer
  permission_classes = [
    permissions.AllowAny
  ]

class UsersByCircle(APIView):
  def get(self, request, format=None):
    circle = request.query_params.get('id')
    users = User.objects.filter(pk__in=Circle.objects.filter(pk=circle).values('members'))
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class ContentByCircle(APIView):
  def get(self, request, format=None):
    circle = request.query_params.get('id')
    content = Content.objects.filter(circle=circle).order_by('-created_at')
    serializer = ContentSerializer(content, many=True)
    return Response(serializer.data)

class CurrentUserByUsername(APIView):
  def get(self, request, format=None):
    username = request.query_params.get('username')
    user = User.objects.filter(username=username)
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)

class CirclesByUser(APIView):
  def get(self, request, format=None):
      current_user = self.request.user
      admin_circles = Circle.objects.filter(admin=self.request.user)
      member_circles = Circle.objects.filter(members__pk = self.request.user.id)
      circles = member_circles.difference(admin_circles)
      circles = circles.union(admin_circles)
      serializer = CircleSerializer(circles, many=True)
      return Response(serializer.data)

class PendingCirclesByUser(APIView):
  def get(self, request, format=None):
      current_user = self.request.user
      pending_circles = Circle.objects.filter(pending_members__pk = self.request.user.id)
      serializer = CircleSerializer(pending_circles, many=True)
      return Response(serializer.data)

# class AdminOfPendingCircle(APIView):
#   def get(self, request, format=None):
#     current_user = self.request.user
#     admin_user = Users.objects.filter(admin=self.request.user)

# class AnyUserByUsername(APIView):
#   def get(self, request, format=None):
#     current_user = self.request.user

