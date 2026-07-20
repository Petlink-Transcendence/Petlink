# WebSocket Documentation - realtime-service

## Overview
The realtime-service handles all WebSocket (WS) connections for Petlink.
It runs on port 8001 and uses Django Channels with Redis as the channel layer.

---

## How to Connect
### Chat WS

```
ws://localhost/ws/chat/{user_id}/
```

### Notifications WS
```
ws://localhost/ws/notifications/{user_id}/
```

Replace `{user_id}` with the ID of the logged-in user.

---

## Event Types
### Chat Events

#### Sending a message
The client sends:
```json
{
    "recipient_id": 123,
    "content": "Hello!"
}
```

#### Receiving a message
The client receives:
```json
{
    "sender_id": 456,
    "content": "Hello!"
}
```

### Notification Events

#### Receiving a notification
The client receives:
```json
{
    "type": "new_message",
    "content": "You have a new message",
    "reference_id": 1,
    "reference_type": "message"
}
```

#### Notification types
| Type | Description |
|---|---|
| `new_message` | A new chat message was received |
| `new_follower` | Someone followed the user |
| `booking_request` | A new booking was requested |
| `booking_confirmed` | A booking was confirmed |
| `booking_cancelled` | A booking was cancelled |
| `new_review` | A new review was received |

---

## REST Endpoints

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/chat/messages/{user_id}/?sender_id={id}` | Fetch conversation history (last 50 messages) |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications/{user_id}/` | List notifications ordered by created_at DESC |
| PUT | `/notifications/{id}/read/` | Mark single notification as read |
| PUT | `/notifications/{user_id}/read-all/` | Mark all notifications as read |
| DELETE | `/notifications/{id}/delete/` | Delete a notification |
| POST | `/internal/notify/` | Internal endpoint for cross-service notification triggers |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts/` | List posts (paginated, soft-delete filtered) |
| POST | `/posts/create/` | Create a post |
| GET | `/posts/{id}/` | Single post view |
| PUT | `/posts/{id}/update/` | Update own post |
| DELETE | `/posts/{id}/delete/` | Soft delete own post |
| POST | `/posts/{id}/like/` | Like a post |
| DELETE | `/posts/{id}/like/` | Unlike a post |

---

## Internal Notify Endpoint
Used by core-service to trigger notifications from booking and follow events.
```
POST http://realtime-service:8001/internal/notify/
Content-Type: application/json

{
"user_id": <recipient user id>,
"type": "booking_confirmed",
"content": "Your booking has been confirmed",
"reference_id": <booking_id>,
"reference_type": "booking"
}
```

Response:
```
201 → {"status": "notification sent"}
400 → {"error": "user_id, type and content are required"}
```

---

## Notes
- WebSocket connections require the user_id in the URL
- Authentication via JWT is handled by core-service
- Redis must be running for WebSocket connections to work
- The `internal/notify/` endpoint requires no authentication
  (internal Docker network only)