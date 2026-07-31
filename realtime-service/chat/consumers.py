import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import Message
from notifications.models import Notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'chat_{self.user_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.update_online_status(True)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.update_online_status(False)

    async def receive(self, text_data):
        data = json.loads(text_data)
        recipient_id = data['recipient_id']
        content = data['content']

        await self.save_message(recipient_id, content)

        await database_sync_to_async(Notification.objects.create)(
            user_id=recipient_id,
            type='new_message',
            content='You have a new message.',
            reference_id=int(self.user_id),
            reference_type='message',
        )

        await self.channel_layer.group_send(
            f'chat_{recipient_id}',
            {
                'type': 'chat_message',
                'sender_id': self.user_id,
                'content': content,
            }
        )

        await self.channel_layer.group_send(
            f'notifications_{recipient_id}',
            {
                'type': 'send_notification',
                'notification_type': 'new_message',
                'content': f'You have a new message',
                'reference_id': int(self.user_id),
                'reference_type': 'message',
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'sender_id': event['sender_id'],
            'content': event['content'],
        }))

    @database_sync_to_async
    def save_message(self, recipient_id, content):
        Message.objects.create(
            sender_id=self.user_id,
            recipient_id=recipient_id,
            content=content
        )

    @database_sync_to_async
    def update_online_status(self, status):
        from django.db import connection
        try:
            with connection.cursor() as cursor:
                if status:
                    cursor.execute(
                        'UPDATE "user" SET online_status = %s WHERE user_id = %s',
                        [True, self.user_id]
                    )
                else:
                    cursor.execute(
                        'UPDATE "user" SET online_status = %s, last_seen = %s WHERE user_id = %s',
                        [False, timezone.now(), self.user_id]
                    )
        except Exception as e:
            print(f"Could not update online status: {e}")