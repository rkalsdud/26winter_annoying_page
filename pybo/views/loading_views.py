from django.shortcuts import render

def loading(request, question_id):
    """
    수동 로딩 페이지 렌더링
    """
    context = {'question_id': question_id}
    return render(request, 'pybo/loading.html', context)