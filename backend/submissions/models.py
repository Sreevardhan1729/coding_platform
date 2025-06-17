from djongo import models
from django.conf import settings

class Submission(models.Model):
    user      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem   = models.ForeignKey("problems.Problem", on_delete=models.CASCADE)
    language  = models.CharField(max_length=30)
    code      = models.TextField()
    verdict   = models.CharField(max_length=20, default="Pending")
    score     = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
