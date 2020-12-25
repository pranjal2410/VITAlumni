from django.db import models


# Create your models here.
class Branch(models.Model):
    name = models.CharField(max_length=50, verbose_name='Branch Name')
    total_passed = models.IntegerField(default=0, verbose_name='Alumni Count')
    registered_passed = models.IntegerField(default=0, verbose_name='Registered Alumni')
    total_staff = models.IntegerField(default=0, verbose_name='Staff Count')
    registered_staff = models.IntegerField(default=0, verbose_name='Registered Staff')

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE, related_name='Alumni', null=True)
    email = models.EmailField(unique=True, max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True)
    graduation = models.DateField(null=True, auto_now_add=False, auto_now=False)
    connections = models.ManyToManyField('self', blank=True)
    is_college_staff = models.BooleanField(default=False)
    greeted = models.ManyToManyField('Updates', blank=True)

    def __str__(self):
        return self.email


class Updates(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=100, null=True)
    text = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='alumni/photos', null=True, blank=True)
    doc = models.FileField(upload_to='alumni/docs', null=True, blank=True)
    greets = models.IntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    is_profile_pic = models.BooleanField(default=False)
    is_cover_pic = models.BooleanField(default=False)
    is_job_update = models.BooleanField(default=False)
    is_notice = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email + ' ' + self.created_on.__str__()


class Connection(models.Model):
    sender = models.ForeignKey('Profile', on_delete=models.CASCADE, null=True)
    receiver = models.CharField(max_length=100, null=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.sender.user.email + ' ' + self.receiver + self.approved.__str__()
