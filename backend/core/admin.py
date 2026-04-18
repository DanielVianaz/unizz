from django.contrib import admin
from .models import Reserva, Contacto


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'moeda', 'montante', 'balcao', 'data_levantamento', 'estado', 'criado_em')
    list_filter = ('estado', 'balcao', 'moeda', 'data_levantamento')
    search_fields = ('nome', 'email', 'telemovel')
    list_editable = ('estado',)
    readonly_fields = ('criado_em',)
    ordering = ('-criado_em',)
    fieldsets = (
        ('Cliente', {
            'fields': ('nome', 'email', 'telemovel')
        }),
        ('Reserva', {
            'fields': ('moeda', 'montante', 'balcao', 'data_levantamento')
        }),
        ('Gestão', {
            'fields': ('estado', 'notas', 'criado_em')
        }),
    )


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'assunto', 'respondido', 'criado_em')
    list_filter = ('assunto', 'respondido')
    search_fields = ('nome', 'email', 'mensagem')
    list_editable = ('respondido',)
    readonly_fields = ('criado_em',)
    ordering = ('-criado_em',)
