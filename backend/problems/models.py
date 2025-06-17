from djongo import models

class TestCase(models.Model):
    input_data = models.TextField()
    expected_output = models.TextField()
    hidden = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.input_data[:20]}..."

    class Meta:
        managed = False  # Tells Django not to manage this model in the database

class Problem(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    constraints = models.TextField(blank=True)
    samples = models.JSONField(default=list)
    test_cases = models.JSONField(default=list)

    def __str__(self):
        return self.title