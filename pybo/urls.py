from django.urls import path

from .views import base_views, question_views, answer_views, random_views, loading_views

app_name = 'pybo'

urlpatterns = [
    # base_views.py
    path('',
         base_views.index, name='index'),
    path('<int:question_id>/',
         base_views.detail, name='detail'),

    # question_views.py
    path('question/create/',
         question_views.question_create, name='question_create'),
    path('question/modify/<int:question_id>/',
         question_views.question_modify, name='question_modify'),
    path('question/delete/<int:question_id>/',
         question_views.question_delete, name='question_delete'),
    path('question/vote/<int:question_id>/',
         question_views.question_vote, name='question_vote'),

    # answer_views.py
    path('answer/create/<int:question_id>/',
         answer_views.answer_create, name='answer_create'),
    path('answer/modify/<int:answer_id>/',
         answer_views.answer_modify, name='answer_modify'),
    path('answer/delete/<int:answer_id>/',
         answer_views.answer_delete, name='answer_delete'),
    path('answer/vote/<int:answer_id>/',
         answer_views.answer_vote, name='answer_vote'),
    
     # Random-Number function
    path('num_input/<int:question_id>/', random_views.num_input, name='num_input'), # 숫자 입력
    path('num_check/<int:question_id>/', random_views.num_check, name='num_check'), # 입력한 숫자와 정답 비교

    # Manual-loading
    path('loading/<int:question_id>/', loading_views.loading, name='loading'),
]
