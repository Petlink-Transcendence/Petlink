from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pets.models import Pet, UserPet
from bookings.models import Service, Availability, Booking, Review

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with test users and pets"

    def handle(self, *args, **options):
        users_data = [
            {
                'username': 'Admin', 'email': 'admin@petlink.local', 'name': 'Admin',
                'user_type': 'owner', 'role': 'admin', 'description': 'PetLink administrator account',
                'country': 'Portugal', 'city': 'Porto', 'rating': None,
                'looking_for': []
            },
            {
                'username': 'joao', 'email': 'joao@test.com', 'name': 'Joao Vieira',
                'user_type': 'owner', 'role': 'user', 'description': 'Dog lover from Vila Nova de Gaia',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/joao.jpeg',
                'looking_for': ['dog walker', 'home visits', 'overnight stay']
            },
            {
                'username': 'isabel', 'email': 'isabel@test.com', 'name': 'Isabel Tootill', 'user_type': 'owner',
                'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/isabel.jpg',
                'looking_for': ['cat sitter', 'home visits']
            },
            {
                'username': 'ricardo', 'email': 'ricardo@test.com', 'name': 'Ricardo Garcia', 'user_type': 'owner',
                'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/ricardo.jpeg',
                'looking_for': ['cat sitter', 'home visits', 'overnight stay']
            },
            {
                'username': 'daniela', 'email': 'daniela@test.com', 'name': 'Daniela Padilha', 'user_type': 'owner',
                'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/daniela.jpeg',
                'looking_for': ['dog walker', 'home visits', 'overnight stay']
            },
            {
                'username': 'gabriel', 'email': 'gabriel@test.com', 'name': 'Gabriel La Rocque', 'user_type': 'owner',
                'role': 'user', 'description': 'Cat & Dog lover from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/gabriel.jpeg',
                'looking_for': ['cat sitter']
            },
            {
                'username': 'rafael', 'email': 'rafael@test.com', 'name': 'Rafael Castro', 'user_type': 'provider',
                'role': 'user', 'description': 'Passionate animal lover with 5+ years of experience caring for cats and small pets.',
                'country': 'Portugal', 'city': 'Porto', 'rating': '5', 'experience': '5+ years', 'price': '10-15 per hour',
                'sitter_pet_types': ['cats', 'dogs', 'small pets'], 'avatar': 'avatars/rafael.jpeg'
            },
            {
                'username': 'maria', 'email': 'maria@test.com', 'name': 'Maria Santos', 'user_type': 'provider',
                'role': 'user', 'description': 'Professional dog walker from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.8', 'avatar': 'avatars/maria.jpeg'
            },
            {
                'username': 'carlos', 'email': 'carlos@test.com', 'name': 'Carlos Ferreira', 'user_type': 'provider',
                'role': 'user', 'description': 'Cat sitter and groomer from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.6', 'avatar': 'avatars/carlos.jpeg'
            }
        ]

        for data in users_data:
            user, created = User.objects.get_or_create(username=data['username'], defaults={
                'email': data['email'], 'name': data['name'], 'user_type': data['user_type'],
                'role': data['role'], 'description': data['description'], 'country': data['country'],
                'city': data['city'], 'rating': data['rating'], 'avatar': data.get('avatar'),
                'experience': data.get('experience'), 'price': data.get('price'),
                'looking_for': data.get('looking_for', []), 'sitter_pet_types': data.get('sitter_pet_types', [])
            })
            if created:
                user.set_password('Test1234!')
                user.save()

        pets_data = [
            {'name': 'Zeus', 'type': 'dog', 'breed': 'Labrador', 'owner': User.objects.get(username='joao')},
            {'name': 'Kyara', 'type': 'cat', 'breed': 'Yorkshire', 'owner': User.objects.get(username='joao')},
            {'name': 'Sushi', 'type': 'cat', 'breed': 'black&white', 'owner': User.objects.get(username='isabel')},
            {'name': 'Quiwi', 'type': 'cat', 'breed': 'european', 'owner': User.objects.get(username='isabel')},
            {'name': 'Rei', 'type': 'cat', 'breed': 'siamese', 'owner': User.objects.get(username='ricardo')},
            {'name': 'Ritinha', 'type': 'cat', 'breed': 'tricolor', 'owner': User.objects.get(username='ricardo')},
            {'name': 'Bob', 'type': 'dog', 'breed': 'podengo', 'owner': User.objects.get(username='daniela')},
            {'name': 'Benny', 'type': 'dog', 'breed': 'podengo', 'owner': User.objects.get(username='daniela')}

        ]

        for data in pets_data:
            pet, _ = Pet.objects.get_or_create(name=data['name'], type=data['type'], breed=data['breed'])
            UserPet.objects.get_or_create(user=data['owner'], pet=pet)

        maria = User.objects.get(username='maria')
        carlos = User.objects.get(username='carlos')
        joao = User.objects.get(username='joao')
        isabel = User.objects.get(username='isabel')
        daniela = User.objects.get(username='daniela')
        zeus = Pet.objects.get(name='Zeus')
        sushi = Pet.objects.get(name='Sushi')

        service_maria, _ = Service.objects.get_or_create(user=maria, type='dog_walking', defaults={'description': 'Daily walks', 'price': '15.00', 'currency': 'EUR', 'price_unit': 'per_hour'})
        service_carlos, _ = Service.objects.get_or_create(user=carlos, type='cat_sitting', defaults={'description': 'Cat sitting', 'price': '12.00', 'currency': 'EUR', 'price_unit': 'per_day'})

        Availability.objects.get_or_create(user=maria, start_date='2026-07-14', end_date='2026-07-31', defaults={'time_slots': 'Weekdays 09:00-12:00', 'price': '15.00', 'currency': 'EUR'})
        Availability.objects.get_or_create(user=carlos, start_date='2026-07-14', end_date='2026-07-31', defaults={'time_slots': 'Weekends 10:00-18:00', 'price': '12.00', 'currency': 'EUR'})

        Booking.objects.get_or_create(requester=joao, provider=maria, service=service_maria, pet=zeus, date='2026-07-15', defaults={'start_time': '09:00', 'end_time': '10:00', 'location': 'Porto', 'message': 'Walk', 'currency': 'EUR'})
        Booking.objects.get_or_create(requester=isabel, provider=carlos, service=service_carlos, pet=sushi, date='2026-07-16', defaults={'start_time': '10:00', 'end_time': '18:00', 'location': 'Porto', 'message': 'Feed', 'currency': 'EUR'})

        reviews_data = [
            {
                'reviewer': joao,
                'reviewee': daniela,
                'rating': 5,
                'comment': 'Daniela gave clear care instructions, responded quickly, and made the booking easy from start to finish.'
            },
            {
                'reviewer': isabel,
                'reviewee': daniela,
                'rating': 4,
                'comment': 'Daniela was organized and thoughtful as a pet owner, with everything ready for a smooth visit.'
            },
            {
                'reviewer': daniela,
                'reviewee': isabel,
                'rating': 5,
                'comment': 'Isabel is a thoughtful pet owner. And Kiwi and Sushi are the best cats ever, well behaved and cute.'
            }
        ]

        for data in reviews_data:
            Review.objects.update_or_create(
                reviewer=data['reviewer'],
                reviewee=data['reviewee'],
                defaults={
                    'rating': data['rating'],
                    'comment': data['comment']
                }
            )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
