from whereami_server.settings import *


CHANNEL_LAYERS['default'] = {'BACKEND': 'channels.layers.InMemoryChannelLayer'}
DATABASES['default'] = {'ENGINE': 'django.db.backends.sqlite3'}
