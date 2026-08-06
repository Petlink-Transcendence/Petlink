from django.urls import path
from . import views

urlpatterns = [
    path('notifications/<int:user_id>/', views.list_notifications, name='list-notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_as_read, name='mark-as-read'),
    path('notifications/<int:user_id>/read-all/', views.mark_all_read, name='mark-all-read'),
    path('notifications/<int:notification_id>/delete/', views.delete_notification, name='delete-notification'),
    path('internal/notify/', views.internal_notify, name='internal-notify'),
    path('internal/notifications/user/<int:user_id>/', views.cleanup_user_notifications, name='cleanup-user-notifications'),
]