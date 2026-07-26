from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pet',
            name='age',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
