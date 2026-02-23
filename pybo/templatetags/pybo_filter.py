from django import template
import markdown
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def mark(value):
    extenstions=extensions = ["nl2br", "fenced_code"]
    return mark_safe(markdown.markdown(value, extensions=extensions))

@register.filter
def sub(value, arg):
    return value - arg