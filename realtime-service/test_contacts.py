import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from chat.views import chat_contacts
from django.test import RequestFactory
import jwt

# generate a fake jwt for user id 1 (or whatever Gabriel's ID is, let's use 1 and 2 to test)
token = jwt.encode({'user_id': 1}, 'django-insecure-k37&y8g(4t6s^%u$90b(c)@b37t5t)w^z*x_h7824#1o^p6-h^', algorithm='HS256')

req = RequestFactory().get('/chat/contacts/')
req.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
import pprint
pprint.pprint(chat_contacts(req).data)
