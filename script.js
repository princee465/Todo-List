 const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const todoList = document.getElementById('todoList');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const statsText = document.getElementById('statsText');

        // Load todos from localStorage
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        let currentFilter = 'all';

        // Initialize app
        renderTodos();
        updateStats();

        // Event listeners
        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTodos();
            });
        });

        // Add new todo
        function addTodo() {
            const text = todoInput.value.trim();
            
            if (text === '') {
                todoInput.focus();
                return;
            }

            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };

            todos.push(todo);
            saveTodos();
            renderTodos();
            updateStats();
            
            todoInput.value = '';
            todoInput.focus();
        }

        // Toggle todo completion
        function toggleTodo(id) {
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            saveTodos();
            renderTodos();
            updateStats();
        }

        // Delete todo
        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
        }

        // Render todos based on current filter
        function renderTodos() {
            let filteredTodos = todos;

            if (currentFilter === 'active') {
                filteredTodos = todos.filter(todo => !todo.completed);
            } else if (currentFilter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            }

            if (filteredTodos.length === 0) {
                todoList.innerHTML = '<div class="empty-state">No tasks to display</div>';
                return;
            }

            todoList.innerHTML = filteredTodos.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="toggleTodo(${todo.id})"
                    >
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
                </li>
            `).join('');
        }

        // Update statistics
        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(todo => todo.completed).length;
            const active = total - completed;

            if (total === 0) {
                statsText.textContent = 'No tasks yet';
            } else {
                statsText.textContent = `Total: ${total} | Active: ${active} | Completed: ${completed}`;
            }
        }

        // Save todos to localStorage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
