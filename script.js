class NestedTodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('nestedTodos')) || [];
        this.nextId = this.getNextId();
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    getNextId() {
        const allIds = this.getAllIds(this.todos);
        return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
    }

    getAllIds(todos) {
        let ids = [];
        todos.forEach(todo => {
            ids.push(todo.id);
            if (todo.subtasks && todo.subtasks.length > 0) {
                ids = ids.concat(this.getAllIds(todo.subtasks));
            }
        });
        return ids;
    }

    bindEvents() {
        const todoInput = document.getElementById('todoInput');
        const addTodoBtn = document.getElementById('addTodoBtn');

        addTodoBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const text = todoInput.value.trim();
        
        if (!text) return;

        const newTodo = {
            id: this.nextId++,
            text: text,
            completed: false,
            subtasks: []
        };

        this.todos.push(newTodo);
        todoInput.value = '';
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    addSubtask(parentId, text) {
        const parent = this.findTodoById(parentId, this.todos);
        if (parent && text.trim()) {
            const subtask = {
                id: this.nextId++,
                text: text.trim(),
                completed: false,
                subtasks: []
            };
            parent.subtasks.push(subtask);
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    findTodoById(id, todos = this.todos) {
        for (let todo of todos) {
            if (todo.id === id) {
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
            this.saveToStorage();
            this.render();
            this.updateStats();
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
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    removeTodoById(id, todos) {
        return todos.filter(todo => {
            if (todo.id === id) {
                return false;
            }
            if (todo.subtasks && todo.subtasks.length > 0) {
                todo.subtasks = this.removeTodoById(id, todo.subtasks);
            }
            return true;
        });
    }

    render() {
        const todoList = document.getElementById('todoList');
        
        if (this.todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <h3>📝 No todos yet!</h3>
                    <p>Add your first todo item above to get started.</p>
                </div>
            `;
            return;
        }

        todoList.innerHTML = this.renderTodos(this.todos);
    }

    renderTodos(todos, isSubtask = false) {
        return todos.map(todo => {
            const itemClass = isSubtask ? 'subtask-item' : 'todo-item';
            const completedClass = todo.completed ? 'completed' : '';
            const checkboxClass = isSubtask ? 'subtask-checkbox' : 'todo-checkbox';
            const contentClass = isSubtask ? 'subtask-content' : 'todo-content';
            
            let html = `
                <li class="${itemClass} ${completedClass}" data-id="${todo.id}">
            `;

            if (isSubtask) {
                html += `
                    <input type="checkbox" class="${checkboxClass}" ${todo.completed ? 'checked' : ''} 
                           onchange="todoApp.toggleTodo(${todo.id})">
                    <span class="${contentClass}">${this.escapeHtml(todo.text)}</span>
                    <button class="subtask-delete" onclick="todoApp.deleteTodo(${todo.id})">Delete</button>
                `;
            } else {
                html += `
                    <div class="todo-main">
                        <input type="checkbox" class="${checkboxClass}" ${todo.completed ? 'checked' : ''} 
                               onchange="todoApp.toggleTodo(${todo.id})">
                        <span class="${contentClass}">${this.escapeHtml(todo.text)}</span>
                        <div class="todo-actions">
                            <button class="btn btn-add-subtask" onclick="todoApp.showSubtaskInput(${todo.id})">
                                Add Subtask
                            </button>
                            <button class="btn btn-delete" onclick="todoApp.deleteTodo(${todo.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                `;

                // Add subtask input area (initially hidden)
                html += `
                    <div class="subtask-input" id="subtask-input-${todo.id}" style="display: none;">
                        <input type="text" placeholder="Add a subtask..." id="subtask-text-${todo.id}">
                        <button onclick="todoApp.addSubtaskFromInput(${todo.id})">Add</button>
                        <button onclick="todoApp.hideSubtaskInput(${todo.id})" style="background: #6c757d;">Cancel</button>
                    </div>
                `;

                // Render subtasks if they exist
                if (todo.subtasks && todo.subtasks.length > 0) {
                    html += `
                        <div class="subtasks">
                            ${this.renderTodos(todo.subtasks, true)}
                        </div>
                    `;
                }
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

    updateStats() {
        const totalTodos = this.countAllTodos(this.todos);
        const completedTodos = this.countCompletedTodos(this.todos);
        
        document.getElementById('totalTodos').textContent = totalTodos;
        document.getElementById('completedTodos').textContent = completedTodos;
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        localStorage.setItem('nestedTodos', JSON.stringify(this.todos));
    }
}

// Initialize the app when the page loads
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new NestedTodoApp();
});

// Add some sample data for demonstration (only if no existing data)
document.addEventListener('DOMContentLoaded', () => {
    if (todoApp.todos.length === 0) {
        // Add sample nested todos
        const sampleTodos = [
            {
                id: 1,
                text: "Plan vacation trip",
                completed: false,
                subtasks: [
                    {
                        id: 2,
                        text: "Research destinations",
                        completed: true,
                        subtasks: []
                    },
                    {
                        id: 3,
                        text: "Book flights",
                        completed: false,
                        subtasks: []
                    },
                    {
                        id: 4,
                        text: "Find accommodation",
                        completed: false,
                        subtasks: [
                            {
                                id: 5,
                                text: "Check hotel reviews",
                                completed: false,
                                subtasks: []
                            },
                            {
                                id: 6,
                                text: "Compare prices",
                                completed: false,
                                subtasks: []
                            }
                        ]
                    }
                ]
            },
            {
                id: 7,
                text: "Complete project presentation",
                completed: false,
                subtasks: [
                    {
                        id: 8,
                        text: "Create slides",
                        completed: true,
                        subtasks: []
                    },
                    {
                        id: 9,
                        text: "Practice presentation",
                        completed: false,
                        subtasks: []
                    }
                ]
            }
        ];
        
        todoApp.todos = sampleTodos;
        todoApp.nextId = 10;
        todoApp.saveToStorage();
        todoApp.render();
        todoApp.updateStats();
    }
});

