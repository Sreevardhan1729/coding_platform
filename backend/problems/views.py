from rest_framework import generics, permissions
from .models import Problem
from .serializers import ProblemSerializer

class ProblemListView(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ProblemDetailView(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = (permissions.IsAuthenticated,)
