from rest_framework.views import exception_handler
from rest_framework import serializers

from whereami.serializers import ErrorCodes, ErrorSerializer

def validation_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, serializers.ValidationError):
        serializer = ErrorSerializer(data={'code': ErrorCodes.VALIDATION_ERROR, 'message': next(iter(exc.detail)),
                                           'validation_errors': response.data})
        if serializer.is_valid():
          response.data = serializer.data
    return response