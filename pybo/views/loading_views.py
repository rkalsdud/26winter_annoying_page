from django.shortcuts import render

def loading(request):
    """
    수동 로딩 페이지 렌더링
    """
    return render(request, 'pybo/loading.html')