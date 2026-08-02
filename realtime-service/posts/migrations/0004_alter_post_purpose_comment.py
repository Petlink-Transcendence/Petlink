import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_alter_post_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='purpose',
            field=models.CharField(choices=[('sitting', 'Looking for Sitter'), ('playdate', 'Looking for Playdate'), ('advice', 'Pet Advice'), ('social', 'Just Sharing'), ('adoption', 'Adoption'), ('lost', 'Lost Pet'), ('found', 'Found Pet'), ('service_promo', 'Service Promo'), ('showcase', 'Showcase')], max_length=50),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('text', models.TextField(max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='posts.post')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
