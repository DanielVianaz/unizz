import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.conf import settings
from .models import Reserva, Contacto


def _json_body(request):
    try:
        return json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


@csrf_exempt
@require_POST
def criar_reserva(request):
    data = _json_body(request)
    if not data:
        return JsonResponse({'erro': 'JSON inválido.'}, status=400)

    campos_obrigatorios = ['nome', 'email', 'telemovel', 'moeda', 'montante', 'data_levantamento', 'balcao']
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return JsonResponse({'erro': f'Campo obrigatório em falta: {campo}'}, status=400)

    try:
        reserva = Reserva.objects.create(
            nome=data['nome'][:200],
            email=data['email'][:254],
            telemovel=data['telemovel'][:30],
            moeda=data['moeda'][:100],
            montante=data['montante'],
            data_levantamento=data['data_levantamento'],
            balcao=data['balcao'][:200],
        )
    except Exception:
        return JsonResponse({'erro': 'Erro interno. Tente novamente.'}, status=500)

    # Email de notificação
    try:
        send_mail(
            subject=f'[Unicâmbio] Nova Reserva — {reserva.nome}',
            message=(
                f'Nova reserva recebida:\n\n'
                f'Nome: {reserva.nome}\n'
                f'Email: {reserva.email}\n'
                f'Telemóvel: {reserva.telemovel}\n'
                f'Moeda: {reserva.moeda}\n'
                f'Montante: {reserva.montante}€\n'
                f'Balcão: {reserva.balcao}\n'
                f'Data de levantamento: {reserva.data_levantamento}\n\n'
                f'Ver no painel: /admin/core/reserva/{reserva.id}/change/'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_NOTIFICACAO],
            fail_silently=True,
        )
    except Exception:
        pass

    return JsonResponse({'sucesso': True, 'id': reserva.id}, status=201)


@csrf_exempt
@require_POST
def criar_contacto(request):
    data = _json_body(request)
    if not data:
        return JsonResponse({'erro': 'JSON inválido.'}, status=400)

    for campo in ['nome', 'email', 'mensagem']:
        if not data.get(campo):
            return JsonResponse({'erro': f'Campo obrigatório em falta: {campo}'}, status=400)

    try:
        contacto = Contacto.objects.create(
            nome=data['nome'][:200],
            email=data['email'][:254],
            assunto=data.get('assunto', 'Outro')[:100],
            mensagem=data['mensagem'][:5000],
        )
    except Exception:
        return JsonResponse({'erro': 'Erro interno. Tente novamente.'}, status=500)

    try:
        send_mail(
            subject=f'[Unicâmbio] Novo Contacto — {contacto.assunto}',
            message=(
                f'Nova mensagem de contacto:\n\n'
                f'Nome: {contacto.nome}\n'
                f'Email: {contacto.email}\n'
                f'Assunto: {contacto.assunto}\n\n'
                f'Mensagem:\n{contacto.mensagem}\n\n'
                f'Ver no painel: /admin/core/contacto/{contacto.id}/change/'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_NOTIFICACAO],
            fail_silently=True,
        )
    except Exception:
        pass

    return JsonResponse({'sucesso': True, 'id': contacto.id}, status=201)
