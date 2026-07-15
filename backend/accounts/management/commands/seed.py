from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pets.models import Pet, UserPet
from bookings.models import Service, Availability, Booking

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with test users and pets"

    def handle(self, *args, **options):
        users_data = [
            {
                'username': 'joao', 'email': 'joao@test.com', 'name': 'Joao Vieira',
                'user_type': 'owner', 'role': 'user', 'description': 'Dog lover from Vila Nova de Gaia',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5'
            },
            {
                'username': 'isabel', 'email': 'isabel@test.com', 'name': 'Isabel Tootill', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5'
            },
            {
                'username': 'ricardo', 'email': 'ricardo@test.com', 'name': 'Ricardo Garcia', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5'
            },
            {
                'username': 'daniela', 'email': 'daniela@test.com', 'name': 'Daniela Padilha', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5'
            },
            {
                'username': 'gabriel', 'email': 'gabriel@test.com', 'name': 'Gabriel LaRoque', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat & Dog lover from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5'
            },
            {
                'username': 'maria', 'email': 'maria@test.com', 'name': 'Maria Santos',
                'user_type': 'provider', 'role': 'user', 'description': 'Professional dog walker from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.8'
            },
            {
                'username': 'carlos', 'email': 'carlos@test.com', 'name': 'Carlos Ferreira',
                'user_type': 'provider', 'role': 'user', 'description': 'Cat sitter and groomer from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.6'
            },
        ]

        created_users = []
        for data in users_data:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': data['email'],
                    'name': data['name'],
                    'user_type': data['user_type'],
                    'role': data['role'],
                    'description': data['description'],
                    'country': data['country'],
                    'city': data['city'],
                    'rating': data['rating']
                }
            )
            if created:
                user.set_password('Test1234!')
                user.save()
            created_users.append(user)

        pets_data = [
            {'name': 'Zeus', 'type': 'dog', 'owner': created_users[0]},
            {'name': 'Kyara', 'type': 'cat', 'owner': created_users[0]},
            {'name': 'sushi', 'type': 'cat', 'owner': created_users[1]},
            {'name': 'quiwi', 'type': 'cat', 'owner': created_users[1]},
            {'name': 'Rei', 'type': 'cat', 'owner': created_users[2]},
            {'name': 'Ritinha', 'type': 'cat', 'owner': created_users[2]}
        ]

        for data in pets_data:
            pet, create = Pet.objects.get_or_create(
                name = data['name'],
                type = data['type'],
            )
            UserPet.objects.get_or_create(user=data['owner'], pet=pet)

        maria = created_users[5]
        carlos = created_users[6]
        joao = created_users[0]
        isabel = created_users[1]
        zeus = Pet.objects.get(name='Zeus')
        sushi = Pet.objects.get(name='sushi')

        service_maria, _ = Service.objects.get_or_create(
            user=maria, type='dog_walking',
            defaults={'description': 'Daily walks in the park', 'price': '15.00', 'currency': 'EUR', 'price_unit': 'per_hour', 'duration_minutes': 60}
        )
        service_carlos, _ = Service.objects.get_or_create(
            user=carlos, type='cat_sitting',
            defaults={'description': 'Cat sitting at your home', 'price': '12.00', 'currency': 'EUR', 'price_unit': 'per_day', 'duration_minutes': None}
        )

        Availability.objects.get_or_create(
            user=maria, start_date='2026-07-14', end_date='2026-07-31',
            defaults={'time_slots': 'Weekdays 09:00-12:00', 'price': '15.00', 'currency': 'EUR'}
        )
        Availability.objects.get_or_create(
            user=carlos, start_date='2026-07-14', end_date='2026-07-31',
            defaults={'time_slots': 'Weekends 10:00-18:00', 'price': '12.00', 'currency': 'EUR'}
        )

        Booking.objects.get_or_create(
            requester=joao, provider=maria, service=service_maria, pet=zeus, date='2026-07-15',
            defaults={'start_time': '09:00', 'end_time': '10:00', 'location': 'Parque da Cidade, Porto', 'message': 'Zeus needs a long walk', 'currency': 'EUR'}
        )
        Booking.objects.get_or_create(
            requester=isabel, provider=carlos, service=service_carlos, pet=sushi, date='2026-07-16',
            defaults={'start_time': '10:00', 'end_time': '18:00', 'location': 'Rua de Santa Catarina, Porto', 'message': 'Sushi needs feeding twice a day', 'currency': 'EUR'}
        )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
