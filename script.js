// Todo App - Enhanced with Nested Functionality
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.stats = document.getElementById('stats');
        this.nextId = this.getNextId();
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
        this.todoInput.focus();
    }
    
    getNextId() {
        const allIds = this.getAllIds(this.todos);
        return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
    }

    getAllIds(todos) {
        let ids = [];
        todos.forEach(todo => {
            ids.push(parseInt(todo.id) || 0);
            if (todo.subtasks && todo.subtasks.length > 0) {
                ids = ids.concat(this.getAllIds(todo.subtasks));
            }
        });
        return ids;
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
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            subtasks: []
        };
        
        this.todos.unshift(todo); // Add to beginning
        this.todoInput.value = '';
        this.addBtn.disabled = true;
        this.saveTodos();
        this.render();
        this.todoInput.focus();
    }
    
    addSubtask(parentId, text) {
        const parent = this.findTodoById(parentId, this.todos);
        if (parent && text.trim()) {
            const subtask = {
                id: this.nextId++,
                text: text.trim(),
                completed: false,
                createdAt: new Date().toISOString(),
                subtasks: []
            };
            parent.subtasks.push(subtask);
            this.saveTodos();
            this.render();
        }
    }
    
    findTodoById(id, todos = this.todos) {
        for (let todo of todos) {
            if (todo.id == id) {
                return todo;
            }
            if (todo.subtasks && todo.subtasks.length > 0) {
                const found = this.findTodoById(id, todo.subtasks);
                if (found) return found;
            }
        }
        return null;
    }
    
    toggleTodo(id) {
        const todo = this.findTodoById(id);
        if (todo) {
            todo.completed = !todo.completed;
            // If marking as completed, mark all subtasks as completed too
            if (todo.completed) {
                this.markAllSubtasksCompleted(todo);
            }
            this.saveTodos();
            this.render();
        }
    }
    
    markAllSubtasksCompleted(todo) {
        if (todo.subtasks) {
            todo.subtasks.forEach(subtask => {
                subtask.completed = true;
                this.markAllSubtasksCompleted(subtask);
            });
        }
    }
    
    deleteTodo(id) {
        this.todos = this.removeTodoById(id, this.todos);
        this.saveTodos();
        this.render();
    }
    
    removeTodoById(id, todos) {
        return todos.filter(todo => {
            if (todo.id == id) {
                return false;
            }
            if (todo.subtasks && todo.subtasks.length > 0) {
                todo.subtasks = this.removeTodoById(id, todo.subtasks);
            }
            return true;
        });
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
        
        this.todoList.innerHTML = this.renderTodoItems(this.todos);
    }
    
    renderTodoItems(todos, isSubtask = false) {
        return todos.map(todo => {
            const itemClass = isSubtask ? 'subtask-item' : 'todo-item';
            const completedClass = todo.completed ? 'completed' : '';
            
            let html = `
                <li class="${itemClass} ${completedClass}" data-id="${todo.id}">
            `;

            if (isSubtask) {
                html += `
                    <div class="subtask-main">
                        <input 
                            type="checkbox" 
                            class="todo-checkbox" 
                            ${todo.completed ? 'checked' : ''}
                            onchange="app.toggleTodo(${todo.id})"
                        >
                        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                        <div class="todo-actions">
                            <button 
                                class="add-subtask-btn" 
                                onclick="app.showSubtaskInput(${todo.id})"
                                title="Add subtask"
                            >
                                + Sub
                            </button>
                            <button 
                                class="delete-btn" 
                                onclick="app.deleteTodo(${todo.id})"
                                title="Delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="todo-main">
                        <input 
                            type="checkbox" 
                            class="todo-checkbox" 
                            ${todo.completed ? 'checked' : ''}
                            onchange="app.toggleTodo(${todo.id})"
                        >
                        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                        <div class="todo-actions">
                            <button 
                                class="add-subtask-btn" 
                                onclick="app.showSubtaskInput(${todo.id})"
                                title="Add subtask"
                            >
                                + Subtask
                            </button>
                            <button 
                                class="delete-btn" 
                                onclick="app.deleteTodo(${todo.id})"
                                title="Delete todo"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            }

            // Add subtask input area (initially hidden)
            html += `
                <div class="subtask-input" id="subtask-input-${todo.id}" style="display: none;">
                    <input type="text" placeholder="Add a subtask..." id="subtask-text-${todo.id}">
                    <button onclick="app.addSubtaskFromInput(${todo.id})">Add</button>
                    <button onclick="app.hideSubtaskInput(${todo.id})" class="cancel-btn">Cancel</button>
                </div>
            `;

            // Render subtasks if they exist
            if (todo.subtasks && todo.subtasks.length > 0) {
                html += `
                    <ul class="subtasks">
                        ${this.renderTodoItems(todo.subtasks, true)}
                    </ul>
                `;
            }

            html += '</li>';
            return html;
        }).join('');
    }
    
    showSubtaskInput(parentId) {
        const input = document.getElementById(`subtask-input-${parentId}`);
        const textInput = document.getElementById(`subtask-text-${parentId}`);
        
        input.style.display = 'flex';
        textInput.focus();
        
        // Add enter key listener
        textInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.addSubtaskFromInput(parentId);
            }
        };
    }

    hideSubtaskInput(parentId) {
        const input = document.getElementById(`subtask-input-${parentId}`);
        const textInput = document.getElementById(`subtask-text-${parentId}`);
        
        input.style.display = 'none';
        textInput.value = '';
    }

    addSubtaskFromInput(parentId) {
        const textInput = document.getElementById(`subtask-text-${parentId}`);
        const text = textInput.value.trim();
        
        if (text) {
            this.addSubtask(parentId, text);
            this.hideSubtaskInput(parentId);
        }
    }
    
    renderStats() {
        const total = this.countAllTodos(this.todos);
        const completed = this.countCompletedTodos(this.todos);
        const remaining = total - completed;
        
        if (total === 0) {
            this.stats.textContent = 'No tasks';
        } else if (remaining === 0) {
            this.stats.textContent = `All ${total} tasks completed! 🎉`;
        } else {
            this.stats.textContent = `${remaining} of ${total} tasks remaining`;
        }
    }
    
    countAllTodos(todos) {
        let count = 0;
        todos.forEach(todo => {
            count++;
            if (todo.subtasks && todo.subtasks.length > 0) {
                count += this.countAllTodos(todo.subtasks);
            }
        });
        return count;
    }

    countCompletedTodos(todos) {
        let count = 0;
        todos.forEach(todo => {
            if (todo.completed) count++;
            if (todo.subtasks && todo.subtasks.length > 0) {
                count += this.countCompletedTodos(todo.subtasks);
            }
        });
        return count;
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
