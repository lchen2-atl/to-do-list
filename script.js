// Todo App - Minimalistic Implementation
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.stats = document.getElementById('stats');
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
        this.todoInput.focus();
    }
    
    bindEvents() {
        // Add todo events
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        
        // Input validation
        this.todoInput.addEventListener('input', () => {
            const isEmpty = this.todoInput.value.trim() === '';
            this.addBtn.disabled = isEmpty;
        });
        
        // Initial button state
        this.addBtn.disabled = true;
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo); // Add to beginning
        this.todoInput.value = '';
        this.addBtn.disabled = true;
        this.saveTodos();
        this.render();
        this.todoInput.focus();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    render() {
        this.renderTodos();
        this.renderStats();
    }
    
    renderTodos() {
        if (this.todos.length === 0) {
            this.todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
            return;
        }
        
        this.todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo('${todo.id}')"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button 
                    class="delete-btn" 
                    onclick="app.deleteTodo('${todo.id}')"
                    title="Delete todo"
                >
                    Delete
                </button>
            </li>
        `).join('');
    }
    
    renderStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;
        
        if (total === 0) {
            this.stats.textContent = 'No tasks';
        } else if (remaining === 0) {
            this.stats.textContent = `All ${total} tasks completed! 🎉`;
        } else {
            this.stats.textContent = `${remaining} of ${total} tasks remaining`;
        }
    }
    
    loadTodos() {
        try {
            const stored = localStorage.getItem('todos');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Failed to load todos from localStorage:', error);
            return [];
        }
    }
    
    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.warn('Failed to save todos to localStorage:', error);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input when typing (if not already focused on an input)
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.key.length === 1) {
        document.getElementById('todoInput').focus();
    }
});

