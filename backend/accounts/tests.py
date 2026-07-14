from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthIntegrationTests(APITestCase):

    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.user_data = {'username': 'testuser', 'password': 'Password123!', 'email': 'test@test.com'}
        self.user = User.objects.create_user(**self.user_data)

    def test_register_user(self):
        """Test user registration."""
        data = {
            'name': 'testuser',
            'username': 'newuser',
            'password': 'Password123!',
            'email': 'new@test.com',
            'user_type': 'owner'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_and_refresh(self):
        """Tests login and token renovation."""
        # Login
        response = self.client.post(self.login_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Refresh
        refresh_token = response.data['refresh']
        refresh_response = self.client.post(self.refresh_url, {'refresh': refresh_token})
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)

    def test_oauth_42_endpoint_exists(self):
        """Validatesd that 42 oauth endpoint is working."""
        url = reverse('oauth_42_login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)
