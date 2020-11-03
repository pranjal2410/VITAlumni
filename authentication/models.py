from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
from portal.models import Branch
from datetime import datetime


class UserManager(BaseUserManager):

    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Enter valid email address")

        email = self.normalize_email(email)
        user = self.model(email=email)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email=email, password=password)

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True, max_length=100)
    first_name = models.CharField(max_length=20, verbose_name="First Name")
    last_name = models.CharField(max_length=100, verbose_name='Last Name')
    date_registered = models.DateTimeField(auto_now_add=True)
    contact = models.PositiveBigIntegerField(default=0)
    last_login = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    otp_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    objects = UserManager()

    def __str__(self):
        return self.email

    def get_username(self):
        return self.email

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


class OTP(models.Model):
    otp = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp')
    created = models.DateTimeField(auto_now_add=True)

    @property
    def is_valid(self):
        change = datetime.now() - self.created.replace(tzinfo=None)
        seconds = change.seconds
        day = change.days

        return day == 0 and seconds <= 600

    def __str__(self):
        if self.is_valid:
            return self.user.email + ' ' + self.otp.__str__()
        return 'EXPIRED'
