import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': event.get('notification_type', 'notification'),
            'content': event.get('content', ''),
            'reference_id': event.get('reference_id'),
            'reference_type': event.get('reference_type'),
        }))

    async def connection_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'connection_updated',
            'action': event.get('action'),
            'follower_id': event.get('follower_id'),
            'following_id': event.get('following_id'),
            'content': event.get('content', '')
        }))