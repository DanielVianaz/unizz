from django.db import models


class Reserva(models.Model):
    ESTADO_CHOICES = [
        ('pendente', 'Pendente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('levantada', 'Levantada'),
    ]

    nome = models.CharField('Nome completo', max_length=200)
    email = models.EmailField('Email')
    telemovel = models.CharField('Telemóvel', max_length=30)
    moeda = models.CharField('Moeda', max_length=100)
    montante = models.DecimalField('Montante (EUR)', max_digits=10, decimal_places=2)
    data_levantamento = models.DateField('Data de levantamento')
    balcao = models.CharField('Balcão preferido', max_length=200)
    estado = models.CharField('Estado', max_length=20, choices=ESTADO_CHOICES, default='pendente')
    notas = models.TextField('Notas internas', blank=True)
    criado_em = models.DateTimeField('Recebido em', auto_now_add=True)

    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-criado_em']

    def __str__(self):
        return f'{self.nome} — {self.moeda} {self.montante}€ · {self.data_levantamento}'


class Contacto(models.Model):
    ASSUNTO_CHOICES = [
        ('Reserva de Moeda', 'Reserva de Moeda'),
        ('Western Union', 'Western Union'),
        ('Compra de Ouro', 'Compra de Ouro'),
        ('Crédito Pessoal', 'Crédito Pessoal'),
        ('Empresas', 'Empresas'),
        ('Outro', 'Outro'),
    ]

    nome = models.CharField('Nome', max_length=200)
    email = models.EmailField('Email')
    assunto = models.CharField('Assunto', max_length=100, choices=ASSUNTO_CHOICES, default='Outro')
    mensagem = models.TextField('Mensagem')
    respondido = models.BooleanField('Respondido', default=False)
    criado_em = models.DateTimeField('Recebido em', auto_now_add=True)

    class Meta:
        verbose_name = 'Contacto'
        verbose_name_plural = 'Contactos'
        ordering = ['-criado_em']

    def __str__(self):
        return f'{self.nome} — {self.assunto} ({self.criado_em.strftime("%d/%m/%Y")})'
