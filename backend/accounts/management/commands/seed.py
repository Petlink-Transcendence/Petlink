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
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/joao.jpeg'
            },
            {
                'username': 'isabel', 'email': 'isabel@test.com', 'name': 'Isabel Tootill', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/isabel.jpg'
            },
            {
                'username': 'ricardo', 'email': 'ricardo@test.com', 'name': 'Ricardo Garcia', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/ricardo.jpeg'
            },
            {
                'username': 'daniela', 'email': 'daniela@test.com', 'name': 'Daniela Padilha', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat lover from Rio Tinto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/daniela.jpeg'
            },
            {
                'username': 'gabriel', 'email': 'gabriel@test.com', 'name': 'Gabriel LaRoque', 'user_type': 'owner',
                'user_type': 'owner', 'role': 'user', 'description': 'Cat & Dog lover from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.5', 'avatar': 'avatars/gabriel.jpeg'
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
                    'avatar': data.get('avatar')
                }
            )
            if created:
                user.set_password('Test1234!')
                user.save()
            else:
                updates = []
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
