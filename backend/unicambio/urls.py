from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

urlpatterns = [
    path('', lambda r: HttpResponseRedirect('/index.html')),
    path('uc-backoffice-2024/', admin.site.urls),
    path('api/', include('core.urls')),
]

admin.site.site_header = 'Unicâmbio — Painel de Administração'
admin.site.site_title = 'Unicâmbio Admin'
admin.site.index_title = 'Gestão do Site'
