from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import connection
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
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.8', 'avatar': None
            },
            {
                'username': 'carlos', 'email': 'carlos@test.com', 'name': 'Carlos Ferreira', 'user_type': 'provider',
                'role': 'user', 'description': 'Cat sitter and groomer from Porto',
                'country': 'Portugal', 'city': 'Porto', 'rating': '4.6', 'avatar': None
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

        provider_availability = {
            'rafael': {
                'availability_status': 'Accepting',
                'availability_location': 'Porto',
                'availability_capacity': '2 bookings/day',
                'available_times': [
                    {'label': 'Mon - Fri', 'time': '09:00 - 12:00'},
                    {'label': 'Saturday', 'time': '14:00 - 19:00'},
                    {'label': 'Sunday', 'time': 'On request'},
                ],
            },
            'maria': {
                'availability_status': 'Accepting',
                'availability_location': 'Porto',
                'availability_capacity': '3 walks/day',
                'available_times': [
                    {'label': 'Weekdays morning', 'time': '08:00 - 10:00'},
                    {'label': 'Weekdays evening', 'time': '17:00 - 19:00'},
                ],
            },
            'carlos': {
                'availability_status': 'Accepting',
                'availability_location': 'Porto',
                'availability_capacity': '2 cats/day',
                'available_times': [
                    {'label': 'Saturday', 'time': '10:00 - 14:00'},
                    {'label': 'Sunday', 'time': '10:00 - 18:00'},
                ],
            },
        }
        for username, fields in provider_availability.items():
            User.objects.filter(username=username).update(**fields)

        pets_data = [
            {'name': 'Zeus', 'type': 'dog', 'breed': 'Labrador', 'owner': User.objects.get(username='joao')},
            {'name': 'Kyara', 'type': 'cat', 'breed': 'Yorkshire', 'owner': User.objects.get(username='joao')},
            {'name': 'Sushi', 'type': 'cat', 'breed': 'black&white', 'owner': User.objects.get(username='isabel')},
            {'name': 'Quiwi', 'type': 'cat', 'breed': 'european', 'owner': User.objects.get(username='isabel')},
            {'name': 'Rei', 'type': 'cat', 'breed': 'siamese', 'owner': User.objects.get(username='ricardo')},
            {'name': 'Ritinha', 'type': 'cat', 'breed': 'tricolor', 'owner': User.objects.get(username='ricardo')},
            {'name': 'Bob', 'type': 'dog', 'breed': 'podengo', 'owner': User.objects.get(username='daniela')},
            {'name': 'Benny', 'type': 'dog', 'breed': 'podengo', 'owner': User.objects.get(username='daniela')},
            {'name': 'Bella', 'type': 'cat', 'breed': 'black cat', 'age': '4 years', 'owner': User.objects.get(username='gabriel')},
            {'name': 'Zelda', 'type': 'cat', 'breed': 'siamese', 'age': '3 years', 'owner': User.objects.get(username='gabriel')}
        ]

        for data in pets_data:
            defaults = {}
            if 'age' in data:
                defaults['age'] = data['age']
            pet, _ = Pet.objects.get_or_create(name=data['name'], type=data['type'], breed=data['breed'], defaults=defaults)
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

        rafael = User.objects.get(username='rafael')

        Service.objects.get_or_create(user=rafael, type='cat_sitting', defaults={
            'description': 'Daily visits, feeding, and litter care',
            'price': '20.00', 'currency': 'EUR', 'price_unit': 'per_session',
        })
        Service.objects.get_or_create(user=rafael, type='home_visits', defaults={
            'description': 'Short check-ins for cats and small pets',
            'price': '15.00', 'currency': 'EUR', 'price_unit': 'per_session',
        })
        Service.objects.get_or_create(user=rafael, type='grooming', defaults={
            'description': 'Coat brushing and basic care',
            'price': '18.00', 'currency': 'EUR', 'price_unit': 'per_session',
        })
        Service.objects.get_or_create(user=rafael, type='overnight_stay', defaults={
            'description': 'In-home care for longer bookings',
            'price': '45.00', 'currency': 'EUR', 'price_unit': 'per_day',
        })

        Availability.objects.get_or_create(
            user=rafael,
            start_date='2026-07-01',
            end_date='2026-12-31',
            defaults={
                'time_slots': 'Mon - Fri: 09:00 - 12:00\nSaturday: 14:00 - 19:00\nSunday: On request',
                'price': '15.00',
                'currency': 'EUR',
                'notes': 'Location: Porto; Capacity: 2 bookings/day',
            },
        )

        Availability.objects.get_or_create(user=maria, start_date='2026-07-14', end_date='2026-07-31', defaults={'time_slots': 'Weekdays 09:00-12:00', 'price': '15.00', 'currency': 'EUR'})
        Availability.objects.get_or_create(user=carlos, start_date='2026-07-14', end_date='2026-07-31', defaults={'time_slots': 'Weekends 10:00-18:00', 'price': '12.00', 'currency': 'EUR'})

        gabriel = User.objects.get(username='gabriel')
        ricardo = User.objects.get(username='ricardo')
        rei = Pet.objects.get(name='Rei')
        bella = Pet.objects.get(name='Bella')

        service_rafael_cat, _ = Service.objects.get_or_create(user=rafael, type='cat_sitting')
        service_rafael_home, _ = Service.objects.get_or_create(user=rafael, type='home_visits')
        service_rafael_groom, _ = Service.objects.get_or_create(user=rafael, type='grooming')

        bookings_data = [
            # completed — can leave reviews
            dict(requester=joao, provider=maria, service=service_maria, pet=zeus, date='2026-06-10', status='completed', start_time='09:00', end_time='10:00', location='Porto', message='Morning walk, Zeus loves fetch!'),
            dict(requester=isabel, provider=carlos, service=service_carlos, pet=sushi, date='2026-06-12', status='completed', start_time='10:00', end_time='18:00', location='Porto', message='Sushi needs wet food at noon.'),
            dict(requester=joao, provider=rafael, service=service_rafael_cat, pet=zeus, date='2026-06-20', status='completed', start_time='09:00', end_time='11:00', location='Porto', message='Zeus is friendly, loves treats.'),
            dict(requester=isabel, provider=rafael, service=service_rafael_home, pet=sushi, date='2026-06-25', status='completed', start_time='14:00', end_time='15:00', location='Porto', message='Check litter box and water.'),
            dict(requester=ricardo, provider=rafael, service=service_rafael_groom, pet=rei, date='2026-07-01', status='completed', start_time='11:00', end_time='12:00', location='Porto', message='Rei is a bit shy at first.'),
            dict(requester=gabriel, provider=rafael, service=service_rafael_cat, pet=bella, date='2026-07-05', status='completed', start_time='10:00', end_time='12:00', location='Porto', message='Bella likes to hide, be patient!'),
            # confirmed — upcoming
            dict(requester=joao, provider=rafael, service=service_rafael_home, pet=zeus, date='2026-09-10', status='confirmed', start_time='09:00', end_time='10:00', location='Porto', message='Quick check-in while I travel.'),
            dict(requester=isabel, provider=rafael, service=service_rafael_cat, pet=sushi, date='2026-09-15', status='confirmed', start_time='14:00', end_time='16:00', location='Porto', message='Two visits, afternoon feeding.'),
            # pending
            dict(requester=joao, provider=maria, service=service_maria, pet=zeus, date='2026-09-20', status='pending', start_time='08:00', end_time='09:00', location='Porto', message='Early morning walk please.'),
            dict(requester=gabriel, provider=rafael, service=service_rafael_groom, pet=bella, date='2026-09-22', status='pending', start_time='11:00', end_time='12:00', location='Porto', message='First grooming session for Bella.'),
            # cancelled
            dict(requester=isabel, provider=carlos, service=service_carlos, pet=sushi, date='2026-07-16', status='cancelled', start_time='10:00', end_time='18:00', location='Porto', message='Had to cancel, sorry!'),
        ]

        for b in bookings_data:
            status = b.pop('status')
            obj, created = Booking.objects.get_or_create(
                requester=b['requester'], provider=b['provider'],
                service=b['service'], pet=b['pet'], date=b['date'],
                defaults={**{k: v for k, v in b.items() if k not in ('requester', 'provider', 'service', 'pet', 'date')}, 'currency': 'EUR'},
            )
            if created or obj.status != status:
                obj.status = status
                obj.save()

        reviews_data = [
            {'reviewer': joao,    'reviewee': daniela, 'rating': 5, 'comment': 'Daniela gave clear care instructions, responded quickly, and made the booking easy from start to finish.'},
            {'reviewer': isabel,  'reviewee': daniela, 'rating': 4, 'comment': 'Daniela was organized and thoughtful as a pet owner, with everything ready for a smooth visit.'},
            {'reviewer': daniela, 'reviewee': isabel,  'rating': 5, 'comment': 'Isabel is a thoughtful pet owner. And Kiwi and Sushi are the best cats ever, well behaved and cute.'},
            {'reviewer': joao,    'reviewee': rafael,  'rating': 5, 'comment': 'Rafael took incredible care of Zeus. Super professional, always updated me and Zeus loved him!'},
            {'reviewer': isabel,  'reviewee': rafael,  'rating': 5, 'comment': 'Best cat sitter in Porto. Sushi and Quiwi were happy and relaxed when I came back.'},
            {'reviewer': ricardo, 'reviewee': rafael,  'rating': 4, 'comment': 'Very attentive and reliable. Rei warmed up to him quickly which says a lot!'},
            {'reviewer': gabriel, 'reviewee': rafael,  'rating': 5, 'comment': 'Bella loved the attention. Rafael was patient and professional throughout.'},
            {'reviewer': gabriel, 'reviewee': joao,    'rating': 5, 'comment': 'Joao is super communicative and responsible. Would trust him with my pets anytime.'},
            {'reviewer': maria,   'reviewee': joao,    'rating': 5, 'comment': 'Zeus is an absolute joy to walk. Joao left great instructions and was easy to coordinate with.'},
            {'reviewer': carlos,  'reviewee': isabel,  'rating': 4, 'comment': 'Isabel was well prepared and Sushi is a lovely cat. Would take care of her again.'},
            {'reviewer': rafael,  'reviewee': joao,    'rating': 5, 'comment': 'Very easy to work with. Zeus is well trained and Joao is always punctual and communicative.'},
            {'reviewer': rafael,  'reviewee': isabel,  'rating': 5, 'comment': 'Isabel is a great owner — detailed notes, responsive, and Sushi is adorable.'},
            {'reviewer': rafael,  'reviewee': ricardo, 'rating': 4, 'comment': 'Ricardo was clear about Rei\'s needs. Would work together again.'},
            {'reviewer': rafael,  'reviewee': gabriel, 'rating': 5, 'comment': 'Gabriel is super organised. Bella is shy but warmed up fast — great experience.'},
        ]

        for data in reviews_data:
            qs = Review.objects.filter(reviewer=data['reviewer'], reviewee=data['reviewee'])
            if qs.count() > 1:
                qs.delete()
            Review.objects.update_or_create(
                reviewer=data['reviewer'],
                reviewee=data['reviewee'],
                defaults={'rating': data['rating'], 'comment': data['comment']}
            )

        # ── Posts, comments, likes (realtime-service shares this DB) ──────────
        def get_or_create_post(cur, user_id, purpose, text, pet_type=None, image=None):
            cur.execute(
                "SELECT id FROM posts_post WHERE user_id=%s AND purpose=%s AND text=%s AND deleted_at IS NULL",
                [user_id, purpose, text],
            )
            row = cur.fetchone()
            if row:
                return row[0]
            cur.execute(
                "INSERT INTO posts_post (user_id, purpose, text, pet_type, image, created_at) VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id",
                [user_id, purpose, text, pet_type, image],
            )
            return cur.fetchone()[0]

        def ensure_comment(cur, post_id, user_id, text):
            cur.execute(
                "SELECT id FROM posts_comment WHERE post_id=%s AND user_id=%s AND text=%s AND deleted_at IS NULL",
                [post_id, user_id, text],
            )
            if not cur.fetchone():
                cur.execute(
                    "INSERT INTO posts_comment (post_id, user_id, text, created_at) VALUES (%s, %s, %s, NOW())",
                    [post_id, user_id, text],
                )

        def ensure_like(cur, post_id, user_id):
            cur.execute(
                "SELECT id FROM posts_like WHERE post_id=%s AND user_id=%s",
                [post_id, user_id],
            )
            if not cur.fetchone():
                cur.execute(
                    "INSERT INTO posts_like (post_id, user_id, created_at) VALUES (%s, %s, NOW())",
                    [post_id, user_id],
                )

        with connection.cursor() as cur:
            p1 = get_or_create_post(cur, joao.id,    'social',        'Zeus and Kyara enjoying a sunny afternoon in the park! 🌞', 'dog')
            p2 = get_or_create_post(cur, joao.id,    'sitting',       'Looking for a sitter for Zeus next weekend. He loves walks and cuddles!', 'dog')
            p3 = get_or_create_post(cur, isabel.id,  'social',        'Sushi discovered the bathroom sink. Send help. 🐱', 'cat')
            p4 = get_or_create_post(cur, isabel.id,  'advice',        'Any tips for introducing a second cat at home? Quiwi is a bit territorial...', 'cat')
            p5 = get_or_create_post(cur, ricardo.id, 'playdate',      'Rei and Ritinha are looking for playdate partners in Porto! 🐾', 'cat')
            p6 = get_or_create_post(cur, daniela.id, 'social',        'Bob and Benny after their morning run. Best boys ever. 🐕🐕', 'dog')
            p7 = get_or_create_post(cur, rafael.id,  'service_promo', 'Available this weekend for cat sitting and home visits in Porto! DM me for rates 🐱', 'cat')
            p8 = get_or_create_post(cur, gabriel.id, 'social',        'Bella taking her morning sun bath', 'cat', 'posts/Bella.jpg')

            ensure_comment(cur, p1, isabel.id,  'They look so happy together! 😍')
            ensure_comment(cur, p1, daniela.id, 'Zeus is adorable, reminds me of Bob!')
            ensure_comment(cur, p2, rafael.id,  'I can help! Send me a message 🐾')
            ensure_comment(cur, p3, ricardo.id, 'Cats are so curious 😂 Rei does the same!')
            ensure_comment(cur, p4, daniela.id, 'Slow introduction with a room divider worked great for us!')
            ensure_comment(cur, p5, joao.id,    'Zeus would love a cat friend, let me know!')
            ensure_comment(cur, p7, isabel.id,  'Messaged you about next Saturday!')

            for post_id, liker_id in [
                (p1, isabel.id), (p1, daniela.id), (p1, gabriel.id),
                (p2, rafael.id),
                (p3, joao.id), (p3, ricardo.id),
                (p4, isabel.id),
                (p5, joao.id),
                (p6, joao.id), (p6, isabel.id),
                (p7, isabel.id), (p7, daniela.id),
                (p8, isabel.id), (p8, daniela.id),
            ]:
                ensure_like(cur, post_id, liker_id)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
