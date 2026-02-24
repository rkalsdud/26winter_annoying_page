from django.urls import path

from . import views

app_name = 'pybo'


urlpatterns = [
    path('', views.index, name='index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('answer/create/<int:question_id>/', views.answer_create, name='answer_create'),
    path('question/create/', views.question_create, name='question_create'),

    # Random-Number function
    path('num_input/<int:question_id>', views.num_input, name='num_input'), # 숫자 입력
    path('num_check/<int:question_id>', views.num_check, name='num_check'), # 입력한 숫자와 정답 비교
]