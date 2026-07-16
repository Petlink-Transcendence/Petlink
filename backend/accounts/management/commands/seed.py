from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pets.models import Pet, UserPet

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with test users and pets"

    def handle(self, *args, **options):
        users_data = [
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
                'looking_for': ['cat sitter', 'home visits' ]
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
                'username': 'gabriel', 'email': 'gabriel@test.com', 'name': 'Gabriel LaRoque', 'user_type': 'owner',
                'role': 'user', 'description': 'Cat & Dog lover from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/gabriel.jpeg',
                'looking_for': ['cat sitter']
            },
            {
                'username': 'rafael', 'email': 'rafael@test.com', 'name': 'Rafael Castro', 'user_type': 'sitter',
                'role': 'user', 'description': 'Passionate animal lover with 5+ years of experience caring for cats and small pets.\nAvailable for sitting, grooming, and daily visits',
                'country': 'Portugal', 'city': 'Porto', 'rating': '5', 'experience': '5+ years', 'price': '10-15 per hour', 'pet_types': ['cats', 'dogs', 'small pets'],
                'avatar': 'avatars/rafael.jpeg'
            }
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
                    'rating': data['rating'],
                    'avatar': data.get('avatar'),
                    'experience': data.get('experience'),
                    'price': data.get('price'),
                    'pet_types': data.get('pet_types', []),
                    'looking_for': data.get('looking_for', []),
                }
            )
            if created:
                user.set_password('Test1234!')
                user.save()
            else:
                updates = []
                for field in ['name', 'description', 'country', 'city', 'rating', 'experience', 'price', 'pet_types', 'looking_for']:
                    value = data.get(field)
                    if value is not None and getattr(user, field) != value:
                        setattr(user, field, value)
                        updates.append(field)
                if data.get('avatar') and user.avatar.name != data['avatar']:
                    user.avatar = data['avatar']
                    updates.append('avatar')
                if updates:
                    user.save(update_fields=updates)
            created_users.append(user)

        pets_data = [
            {'name': 'Zeus', 'type': 'dog', 'breed': 'pitbull', 'owner': created_users[0]},
            {'name': 'Kyara', 'type': 'cat', 'breed': 'chiwawa', 'owner': created_users[0]},
            {'name': 'Sushi', 'type': 'cat', 'breed': 'black&white', 'owner': created_users[1]},
            {'name': 'Quiwi', 'type': 'cat', 'breed': 'european', 'owner': created_users[1]},
            {'name': 'Rei', 'type': 'cat', 'breed': 'siamese', 'owner': created_users[2]},
            {'name': 'Ritinha', 'type': 'cat', 'breed': 'tricolor', 'owner': created_users[2]}
        ]

        for data in pets_data:
            pet, create = Pet.objects.get_or_create(
                name = data['name'],
                type = data['type'],
                breed = data['breed'],
            )
            UserPet.objects.get_or_create(user=data['owner'], pet=pet)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
