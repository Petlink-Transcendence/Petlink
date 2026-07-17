# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_user_experience_user_pet_types_user_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='looking_for',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
