from django.shortcuts import render, get_object_or_404, redirect
from .models import Question
from django.utils import timezone
from .forms import QuestionForm, AnswerForm
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required

import random
from django.contrib import messages

# Create your views here.

def index(request):
    page=request.GET.get('page', '1')
    question_list = Question.objects.order_by('-create_date')
    paginator = Paginator(question_list, 10)
    page_obj = paginator.get_page(page)
    context = {'question_list': page_obj}
    return render(request, 'pybo/question_list.html', context)

def detail(request, question_id):
    question = get_object_or_404(Question, id=question_id)
    context = {'question': question}
    return render(request, 'pybo/question_detail.html', context)

@login_required(login_url='common:login')
def answer_create(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if request.method == 'POST':
        form = AnswerForm(request.POST)
        if form.is_valid():
            answer = form.save(commit=False)
            answer.author = request.user  # 추가된 부분
            answer.create_date = timezone.now()
            answer.question = question
            answer.save()
            return redirect('pybo:detail', question_id=question.id)
    else:
        form = AnswerForm()
    context = {'question': question, 'form': form}
    return render(request, 'pybo/question_detail.html', context)

@login_required(login_url='common:login')
def question_create(request):
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.author = request.user  # 추가된 부분
            question.create_date = timezone.now()
            question.save()
            return redirect('pybo:index')
    else:
        form = QuestionForm()
    context = {'form': form}
    return render(request, 'pybo/question_form.html', context)

# Random-Number function
def num_input(request, question_id):
    """숫자 입력 화면"""
    # 1. 1~10 사이 랜덤 숫자 생성 후 세션에 저장
    answer = random.randint(1, 10)
    request.session['num_answer'] = answer

    # 2. 입력 페이지로 이동
    # return render(request, 'pybo/num_input.html', {'question_id':question_id})

    # 디버그
    return render(request, 'pybo/num_input.html', {
        'question_id': question_id,
        'debug_answer': answer  # 이 줄을 추가!
    })

def num_check(request, question_id):
    """사용자가 입력한 숫자가 맞는지 검사"""
    # 1. 사용자가 폼을 통해 보낸 숫자와 세션에 저장된 정답 가져오기
    user_input = request.POST.get('user_input')
    correct_answer = request.session.get('num_answer')

    # 2. 두 숫자 비교 후 정답이면 상세 페이지, 오답이면 메인 리스트로 이동
    if str(user_input) == str(correct_answer):
        return redirect('pybo:detail', question_id=question_id)
    else:
        # [추가 기능]
        # 틀렸을 때 메시지를 보여주고, 3초 후에 질문 목록으로 쫓겨나기
        messages.error(request, f"정답은 {correct_answer}!")
        return redirect('pybo:num_input', question_id=question_id)