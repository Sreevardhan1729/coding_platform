from rest_framework import serializers
from .models import Problem, TestCase

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ('input_data', 'expected_output', 'hidden')

class ProblemSerializer(serializers.ModelSerializer):
    samples = TestCaseSerializer(many=True, required=False)
    test_cases = TestCaseSerializer(many=True, required=False)

    class Meta:
        model = Problem
        fields = ('_id', 'title', 'slug', 'description', 'constraints', 'samples', 'test_cases')
        read_only_fields = ('_id',)

    def create(self, validated_data):
        samples_data = validated_data.pop('samples', [])
        test_cases_data = validated_data.pop('test_cases', [])
        
        problem = Problem.objects.create(**validated_data)
        problem.samples = [dict(sample) for sample in samples_data]
        problem.test_cases = [dict(test_case) for test_case in test_cases_data]
        problem.save()
        
        return problem

    def update(self, instance, validated_data):
        samples_data = validated_data.pop('samples', None)
        test_cases_data = validated_data.pop('test_cases', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if samples_data is not None:
            instance.samples = [dict(sample) for sample in samples_data]
        if test_cases_data is not None:
            instance.test_cases = [dict(test_case) for test_case in test_cases_data]
        
        instance.save()
        return instance