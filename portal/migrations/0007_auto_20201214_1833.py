# Generated by Django 3.1.2 on 2020-12-14 13:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0006_auto_20201214_1829'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='is_staff',
            new_name='is_college_staff',
        ),
    ]
