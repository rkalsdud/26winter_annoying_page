from django.shortcuts import render, redirect

import random
from django.contrib import messages

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

    # [Manual-Loading]
    # 2. 두 숫자 비교 후 정답이면 로딩 페이지, 오답이면 메인 리스트로 이동
    if str(user_input) == str(correct_answer):
        return redirect('pybo:loading', question_id=question_id)
    else:
        # [추가 기능]
        # 틀렸을 때 메시지를 보여주고, 3초 후에 질문 목록으로 쫓겨나기
        messages.error(request, f"정답은 {correct_answer}!")
        return redirect('pybo:num_input', question_id=question_id)