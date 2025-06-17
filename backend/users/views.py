from django.contrib.auth import get_user_model # type: ignore
from rest_framework import generics, permissions # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from .serializers import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
