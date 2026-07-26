from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
    """Serializer for Pet"""

    class Meta:
        model = Pet
        fields = (
            'id', 'name', 'type', 'breed', 'age',
            'avatar', 'created_at'
        )
        read_only_fields = ('id', 'created_at')