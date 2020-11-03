from django.db import models


# Create your models here.
class Year(models.Model):
    year = models.IntegerField(default=2020, verbose_name='Graduation Year')

    def __str__(self):
        return self.year.__str__()


class Branch(models.Model):
    name = models.CharField(max_length=50, verbose_name='Branch Name')
    total_passed = models.IntegerField(default=0, verbose_name='Alumni Count')
    registered_passed = models.IntegerField(default=0, verbose_name='Registered Alumni')
    total_staff = models.IntegerField(default=0, verbose_name='Staff Count')
    registered_staff = models.IntegerField(default=0, verbose_name='Registered Staff')
    year = models.ManyToManyField(Year, verbose_name='Graduation Year')

    def __str__(self):
        return self.name


class Alumni(models.Model):
    user = models.OneToOneField('authentication.User', on_delete=models.DO_NOTHING, related_name='Alumni', null=True)
    email = models.EmailField(unique=True, max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.DO_NOTHING, null=True)
    year = models.ManyToManyField(Year, verbose_name='Graduation Year')
    photo = models.ImageField(null=True, blank=True, upload_to='alumni/images')
    doc = models.FileField(null=True, blank=True, upload_to='alumni/docs')

    def __str__(self):
        return self.email


class Staff(models.Model):
    user = models.OneToOneField('authentication.User', on_delete=models.DO_NOTHING, related_name='Staff', null=True)
    email = models.EmailField(unique=True, max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.DO_NOTHING, null=True)
    photo = models.ImageField(null=True, blank=True, upload_to='staff/images')
    doc = models.FileField(null=True, blank=True, upload_to='staff/docs')

    def __str__(self):
        return self.email
