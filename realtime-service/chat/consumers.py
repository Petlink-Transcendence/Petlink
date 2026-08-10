import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Message
from notifications.models import Notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        url_user_id = self.scope['url_route']['kwargs']['user_id']

        query_string = self.scope['query_string'].decode()
        token = parse_qs(query_string).get('token', [None])[0]

        authenticated_user_id = self.get_user_id_from_token(token)

        if authenticated_user_id is None or str(authenticated_user_id) != str(url_user_id):
            await self.close(code=4001)
            return

        self.user_id = authenticated_user_id
        self.room_group_name = f'chat_{self.user_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.update_online_status(True)

    def get_user_id_from_token(self, token):
        if not token:
            return None
        try:
            return AccessToken(token)['user_id']
        except (InvalidToken, TokenError):
            return None

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.update_online_status(False)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
            return

        recipient_id = data.get('recipient_id')
        content = data.get('content')
        temp_id = data.get('temp_id')

        if recipient_id is None or not content:
            await self.send(text_data=json.dumps({'error': 'recipient_id and content are required'}))
            return

        real_id = await self.save_message(recipient_id, content)

        sender_name = await self.get_sender_name()
        notif_content = f'You have a new message from {sender_name}.'

        await database_sync_to_async(Notification.objects.create)(
            user_id=recipient_id,
            actor_id=int(self.user_id),
            type='new_message',
            content=notif_content,
            reference_id=int(self.user_id),
            reference_type='message',
        )

        await self.channel_layer.group_send(
            f'chat_{recipient_id}',
            {
                'type': 'chat_message',
                'message_id': real_id,
                'sender_id': self.user_id,
                'content': content,
            }
        )

        await self.channel_layer.group_send(
            f'notifications_{recipient_id}',
            {
                'type': 'send_notification',
                'notification_type': 'new_message',
                'content': notif_content,
                'reference_id': int(self.user_id),
                'reference_type': 'message',
            }
        )

        if temp_id is not None:
            await self.channel_layer.group_send(
                f'chat_{self.user_id}',
                {
                    'type': 'message_sent_ack',
                    'temp_id': temp_id,
                    'real_id': real_id,
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message_id': event['message_id'],
            'sender_id': event['sender_id'],
            'content': event['content'],
        }))

    async def message_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_deleted',
            'message_id': event['message_id'],
        }))

    async def message_sent_ack(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_sent_ack',
            'temp_id': event['temp_id'],
            'real_id': event['real_id'],
        }))

    @database_sync_to_async
    def save_message(self, recipient_id, content):
        message = Message.objects.create(
            sender_id=self.user_id,
            recipient_id=recipient_id,
            content=content
        )
        return message.id

    @database_sync_to_async
    def update_online_status(self, status):
        from django.db import connection
        try:
            with connection.cursor() as cursor:
                if status:
                    cursor.execute(
                        'UPDATE accounts_user SET online_status = %s WHERE id = %s',
                        [True, self.user_id]
                    )
                else:
                    cursor.execute(
                        'UPDATE accounts_user SET online_status = %s, last_seen = %s WHERE id = %s',
                        [False, timezone.now(), self.user_id]
                    )
        except Exception as e:
            print(f"Could not update online status: {e}")

    @database_sync_to_async
    def get_sender_name(self):
        from django.db import connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT name, username FROM accounts_user WHERE id = %s", [self.user_id])
                row = cursor.fetchone()
                if row:
                    return row[0] or row[1] or "Someone"
        except Exception:
            pass
        return "Someone"