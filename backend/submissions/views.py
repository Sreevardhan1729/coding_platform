from bson import ObjectId
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Submission
from .serializers import SubmissionSerializer
from .judge import run_code
from problems.models import Problem
import json

LANGUAGE_MAP = {"python": 71, "cpp": 54, "javascript": 63}  # Judge0 ids

class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        problem = Problem.objects.get(slug=request.data["problem_slug"])
        language_id = LANGUAGE_MAP[request.data["language"]]
        results = []
        all_passed = True

        for tc in problem.test_cases:
            judge_res = run_code(request.data["code"], language_id, tc["input_data"])
            output = judge_res["stdout"] or ""
            verdict = "AC" if output.strip() == tc["expected_output"].strip() else "WA"
            results.append({ 
                "input": tc["input_data"], 
                "expected": tc["expected_output"], 
                "output": output, 
                "status": verdict 
            })
            all_passed &= verdict == "AC"

        submission = Submission.objects.create(
            user=request.user,
            problem=problem,
            code=request.data["code"],
            language=request.data["language"],
            verdict="Accepted" if all_passed else "Wrong Answer",
            score=100.0 if all_passed else 0.0,
        )
        
        return Response({
            "id": str(submission.id),  # Convert ObjectId to string
            "verdict": submission.verdict,
            "results": results
        })

