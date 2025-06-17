import json
from rest_framework import serializers
from .models import Submission
from bson import ObjectId

class ObjectIdEncoder(json.JSONEncoder):  # <-- Fix here
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"
        read_only_fields = ("verdict", "score", "created_at", "user")
        encoder_class = ObjectIdEncoder  # Optional, depends on how you're using it
