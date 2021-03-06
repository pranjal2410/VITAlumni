# Generated by Django 3.1.2 on 2020-12-06 10:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0005_auto_20201120_0203'),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='cover_pic',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='CoverPicture', to='portal.updates'),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_pic',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='DP', to='portal.updates'),
        ),
    ]
