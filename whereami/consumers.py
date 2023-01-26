import json
import time
import logging

from channels.generic.websocket import AsyncWebsocketConsumer


class ChallengeStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        if self.scope['user'].is_authenticated:
            self.challenge_id = self.scope['url_route']['kwargs']['challenge_id']
            self.challenge_group_name = 'challenge_%s' % self.challenge_id
            await self.channel_layer.group_add(self.challenge_group_name, self.channel_name)
            # call for update
            await super().connect()
            await self.force_resync()

    async def disconnect(self, close_code):
        await super().disconnect(close_code)
        await self.channel_layer.group_discard(self.challenge_group_name, self.channel_name)
        await self.force_resync()

    # tell clients to resend their current status
    async def force_resync(self):
        await self.channel_layer.group_send(
            self.challenge_group_name,
            {
                'type': 'resync',
                'sync_time': time.time()
            }
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        if 'user_data' in text_data_json:
            await self.handle_client_update(text_data_json)
        elif 'location' in text_data_json:
            await self.handle_ghost_update(text_data_json)

    async def handle_ghost_update(self, text_data_json):
            location = text_data_json['location']
            msg = {
                    "type": "ghost_update",
                    "location": {"lat": location['lat'], "lng": location['lng']},
                    "username": self.scope["user"].username,
                    "id": self.channel_name
                }
            logging.debug("send msg: {}", msg)
            await self.channel_layer.group_send(
                self.challenge_group_name,
                msg,
            )
        
    async def handle_client_update(self, text_data_json):
        data = text_data_json['user_data']
        sync_time = text_data_json['sync_time']
        msg = {
                "type": "client_update",
                "user_data": data,
                "sync_time": sync_time,
                "username": self.scope["user"].username,
                "id": self.channel_name
            }
        logging.debug("send msg: {}", msg)
        await self.channel_layer.group_send(
            self.challenge_group_name,
            msg,
        )

    # pass messages of type resync directly to client
    async def resync(self, event):
        await self.send(text_data=json.dumps(event))

    # pass messages of type client_update directly to client
    async def client_update(self, event):
        await self.send(text_data=json.dumps(event))

    # pass messages of type ghost_update directly to client
    async def ghost_update(self, event):
        await self.send(text_data=json.dumps(event))
