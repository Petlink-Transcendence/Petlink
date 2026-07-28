from django.contrib import admin
from .models import Pet, UserPet


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'breed', 'age')
    list_filter = ('type',)
    search_fields = ('name', 'breed')


@admin.register(UserPet)
class UserPetAdmin(admin.ModelAdmin):
    list_display = ('user', 'pet')
    search_fields = ('user__username', 'pet__name')
