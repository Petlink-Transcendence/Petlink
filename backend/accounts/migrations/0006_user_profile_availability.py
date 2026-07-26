# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_user_looking_for'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='availability_status',
            field=models.CharField(choices=[('Accepting', 'Accepting'), ('Not available', 'Not available')], default='Not available', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='availability_location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='availability_capacity',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='available_times',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
