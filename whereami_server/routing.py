import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import whereami.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'whereami_server.settings')

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            whereami.routing.websocket_urlpatterns
        )
    ),
})
