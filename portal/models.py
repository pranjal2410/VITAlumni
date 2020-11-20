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
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE, related_name='Alumni', null=True)
    email = models.EmailField(unique=True, max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.DO_NOTHING, null=True)
    year = models.ManyToManyField(Year, verbose_name='Graduation Year')
    connections = models.ManyToManyField('Alumni', blank=True)
    staff_connections = models.ManyToManyField('Staff', blank=True)
    greeted = models.ManyToManyField('Updates', blank=True)

    def __str__(self):
        return self.email


class Staff(models.Model):
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE, related_name='Staff', null=True)
    email = models.EmailField(unique=True, max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.DO_NOTHING, null=True)
    connections = models.ManyToManyField('Staff', blank=True)
    greeted = models.ManyToManyField('Updates', blank=True)

    def __str__(self):
        return self.email


class Updates(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE, null=True)
    text = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='alumni/photos', null=True, blank=True)
    doc = models.FileField(upload_to='alumni/docs', null=True, blank=True)
    greets = models.IntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    is_profile_pic = models.BooleanField(default=False)
    is_cover_pic = models.BooleanField(default=False)
    is_job_update = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email + ' ' + self.created_on.__str__()
