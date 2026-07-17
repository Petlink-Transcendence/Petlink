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

    def test_login_refresh_and_logout(self):
        """
        Tests the complete auth cicle (login, refresh, logout, refresh)
        """
        # Login
        response = self.client.post(self.login_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data['access']
        refresh_token = response.data['refresh']

        # Initial resresh(must work while logged in)
        refresh_response = self.client.post(self.refresh_url, {'refresh': refresh_token})
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)

        # Logout (invalidates the refresh token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_url = reverse('auth_logout')
        logout_response = self.client.post(logout_url, {'refresh_token': refresh_token})
        self.assertEqual(logout_response.status_code, status.HTTP_205_RESET_CONTENT)

        # Final refresh (must fail after logout)
        refresh_failed_response = self.client.post(self.refresh_url, {'refresh': refresh_token})
        self.assertEqual(refresh_failed_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_oauth_42_endpoint_exists(self):
        """Validatesd that 42 oauth endpoint is working."""
        url = reverse('oauth_42_login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)

class AdminStatsIntegrationTests(APITestCase):

    def setUp(self):
        self.stats_url = reverse('admin-stats')
        # Create an admin user
        self.admin_user = User.objects.create_user(
            username='adminuser',
            password='AdminPassword123!',
            email='admin@test.com',
            role='admin',
            user_type='owner'
        )
        # Create a regular user
        self.regular_user = User.objects.create_user(
            username='regularuser',
            password='UserPassword123!',
            email='user@test.com',
            role='user',
            user_type='owner'
        )

    def test_admin_can_access_stats(self):
        """Verify that an admin can retrieve admin stats."""
        # Authenticate as admin
        login_url = reverse('token_obtain_pair')
        login_res = self.client.post(login_url, {'username': 'adminuser', 'password': 'AdminPassword123!'})
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_token = login_res.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data)
        self.assertIn('active_bookings', response.data)
        self.assertIn('pending_bookings', response.data)
        self.assertIn('total_reviews', response.data)

    def test_non_admin_cannot_access_stats(self):
        """Verify that a non-admin gets 403 Forbidden."""
        # Authenticate as regular user
        login_url = reverse('token_obtain_pair')
        login_res = self.client.post(login_url, {'username': 'regularuser', 'password': 'UserPassword123!'})
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_token = login_res.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_access_stats(self):
        """Verify that an unauthenticated request gets 401 Unauthorized."""
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_stats_counts(self):
        """Verify that stats count values are correct."""
        from bookings.models import Booking, Service, Review
        from pets.models import Pet
        
        # Create some test bookings and reviews
        # First we need a service, pet, and users
        sitter = User.objects.create_user(
            username='sitteruser',
            password='SitterPassword123!',
            email='sitter@test.com',
            role='user',
            user_type='provider'
        )
        service = Service.objects.create(
            user=sitter,
            type=Service.ServiceType.DOG_WALKING,
            price=15.00,
            price_unit=Service.PriceUnit.PER_HOUR
        )
        pet = Pet.objects.create(
            name='Rex',
            type=Pet.PetType.DOG,
            breed='German Shepherd'
        )
        # Create one confirmed booking, one pending booking, one completed booking
        Booking.objects.create(
            requester=self.regular_user,
            provider=sitter,
            service=service,
            pet=pet,
            status=Booking.Status.CONFIRMED,
            date='2026-07-20',
            start_time='10:00:00',
            end_time='11:00:00'
        )
        Booking.objects.create(
            requester=self.regular_user,
            provider=sitter,
            service=service,
            pet=pet,
            status=Booking.Status.PENDING,
            date='2026-07-21',
            start_time='10:00:00',
            end_time='11:00:00'
        )
        completed_booking = Booking.objects.create(
            requester=self.regular_user,
            provider=sitter,
            service=service,
            pet=pet,
            status=Booking.Status.COMPLETED,
            date='2026-07-19',
            start_time='10:00:00',
            end_time='11:00:00'
        )
        # Create a review
        Review.objects.create(
            reviewer=self.regular_user,
            reviewee=sitter,
            booking=completed_booking,
            rating=5,
            comment='Excellent!'
        )

        # Authenticate as admin and request stats
        login_url = reverse('token_obtain_pair')
        login_res = self.client.post(login_url, {'username': 'adminuser', 'password': 'AdminPassword123!'})
        access_token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Admin + Regular + Sitter = 3
        self.assertEqual(response.data['total_users'], 3)
        self.assertEqual(response.data['active_bookings'], 1)
        self.assertEqual(response.data['pending_bookings'], 1)
        self.assertEqual(response.data['total_reviews'], 1)
