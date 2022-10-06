"""
ASGI config for whereami_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'whereami_server.settings')
from django.core.asgi import get_asgi_application
# this has to be first command; otherwise "Apps aren't loaded yet."
asgi_app = get_asgi_application()
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import whereami.routing
from whereami.auth import JWTAuthMiddlewareStack

from django.core.asgi import get_asgi_application



application = ProtocolTypeRouter({
    "http": asgi_app,
    # (http->django views is added by default)
    'websocket': JWTAuthMiddlewareStack(
        URLRouter(
            whereami.routing.websocket_urlpatterns
        )
    ),
})