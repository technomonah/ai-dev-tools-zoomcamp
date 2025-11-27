from django.test import TestCase
from django.urls import reverse
from datetime import date
from .models import Todo


class TodoModelTest(TestCase):
    def test_create_todo(self):
        todo = Todo.objects.create(
            title='Test TODO',
            description='Test description',
            due_date=date(2025, 12, 31)
        )
        self.assertEqual(todo.title, 'Test TODO')
        self.assertEqual(todo.description, 'Test description')
        self.assertEqual(todo.due_date, date(2025, 12, 31))
        self.assertFalse(todo.completed)

    def test_todo_str(self):
        todo = Todo.objects.create(title='Test TODO')
        self.assertEqual(str(todo), 'Test TODO')


class TodoViewsTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title='Test TODO',
            description='Test description'
        )

    def test_todo_list_view(self):
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test TODO')

    def test_todo_create_view_get(self):
        response = self.client.get(reverse('todo_create'))
        self.assertEqual(response.status_code, 200)

    def test_todo_create_view_post(self):
        response = self.client.post(reverse('todo_create'), {
            'title': 'New TODO',
            'description': 'New description',
            'completed': False
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Todo.objects.filter(title='New TODO').exists())

    def test_todo_update_view(self):
        response = self.client.post(
            reverse('todo_update', args=[self.todo.pk]),
            {'title': 'Updated TODO', 'description': '', 'completed': False}
        )
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated TODO')

    def test_todo_delete_view(self):
        response = self.client.post(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Todo.objects.filter(pk=self.todo.pk).exists())

    def test_todo_toggle_view(self):
        self.assertFalse(self.todo.completed)
        response = self.client.get(reverse('todo_toggle', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.completed)
