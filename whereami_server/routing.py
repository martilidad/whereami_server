import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import whereami.routing
from whereami.auth import JWTAuthMiddlewareStack
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'whereami_server.settings')

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    # todo reenable auth
    'websocket': JWTAuthMiddlewareStack(
        URLRouter(
            whereami.routing.websocket_urlpatterns
        )
    ),
})
