from django.contrib import admin
from .models import *


# Register your models here.
admin.site.register(Year)
admin.site.register(Profile)
admin.site.register(Updates)


@admin.register(Branch)
class YearAdmin(admin.ModelAdmin):
    raw_id_fields = ['year']
