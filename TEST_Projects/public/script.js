import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    projectId: "to-do-list-fcee4",
    appId: "1:735043072340:web:c6b7eada2ce5569dff58c1",
    storageBucket: "to-do-list-fcee4.firebasestorage.app",
    apiKey: "AIzaSyBhE_DQCvbK5591icOZS_2GlxbuvbRWUfk",
    authDomain: "to-do-list-fcee4.firebaseapp.com",
    messagingSenderId: "735043072340",
    measurementId: "G-ZZE861SVQY",
    projectNumber: "735043072340"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const todosRef = collection(db, "todos");
const VERSION = "1.0.5"; // Updated for cache-busting

document.addEventListener('DOMContentLoaded', () => {
    console.log(`Todo List App Version: ${VERSION}`);
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const dateDisplay = document.getElementById('date-display');
    const statusEl = document.getElementById('cloud-status');
    const refreshBtn = document.getElementById('refresh-btn');

    if (statusEl) statusEl.textContent = `Sync: Connecting (v${VERSION})`;

    // --- Calendar Logic ---
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('ko-KR', options);

    let selectedDateStr = new Date().toDateString();
    let todos = [];

    // --- Firestore Sync ---
    const q = query(todosRef, orderBy("createdAt", "asc"));

    let unsubscribe = onSnapshot(q, (snapshot) => {
        todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Updated todos from sync:", todos.length);

        if (statusEl) {
            statusEl.textContent = 'Cloud Sync: Online';
            statusEl.className = 'status-online';
        }
        renderCalendar();
        renderTodos();
    }, (error) => {
        console.error("Firestore Sync Error:", error);
        if (statusEl) {
            statusEl.textContent = 'Sync Error: Check Console';
            statusEl.className = 'status-offline';
        }
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Force a hard reload to clear cache
            window.location.reload(true);
        });
    }

    const todoActions = {
        async add(text, date) {
            try {
                await addDoc(todosRef, {
                    text,
                    date,
                    completed: false,
                    createdAt: Date.now()
                });
            } catch (e) {
                console.error("Error adding todo:", e);
                alert("오류가 발생했습니다. 새로고침 후 다시 시도해주세요.");
            }
        },
        async toggle(id, completed) {
            try {
                const todoDoc = doc(db, "todos", id);
                await updateDoc(todoDoc, { completed });
            } catch (e) {
                console.error("Error toggling todo:", e);
            }
        },
        async remove(id) {
            try {
                const todoDoc = doc(db, "todos", id);
                await deleteDoc(todoDoc);
            } catch (e) {
                console.error("Error removing todo:", e);
            }
        }
    };

    const renderCalendar = () => {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = `${year}년 ${month + 1}월`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        // Previous month empty slots
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            calendarDays.appendChild(emptyDiv);
        }

        // Days of current month
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.style.position = 'relative'; // For dot positioning

            const dateObj = new Date(year, month, i);
            const dateStr = dateObj.toDateString();

            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.className = 'today';
            }

            if (dateStr === selectedDateStr) {
                dayDiv.classList.add('selected');
            }

            // Check if this date has any todos
            if (todos.some(t => t.date === dateStr)) {
                dayDiv.classList.add('has-todo');
            }

            dayDiv.addEventListener('click', () => {
                selectedDateStr = dateStr;
                document.querySelectorAll('.calendar-days div').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');

                // Update todo date display based on selection
                dateDisplay.textContent = dateObj.toLocaleDateString('ko-KR', options);
                renderTodos();
            });

            calendarDays.appendChild(dayDiv);
        }
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // --- Todo Logic ---
    // saveTodos is no longer needed as Firestore handles persistence and real-time updates
    // const saveTodos = () => {
    //     localStorage.setItem('todos', JSON.stringify(todos));
    //     updateStats();
    //     renderCalendar(); // Sync red dots
    // };

    const updateStats = () => {
        const currentTodos = todos.filter(t => t.date === selectedDateStr);
        const count = currentTodos.filter(t => !t.completed).length;
        itemsLeft.textContent = `${count} items left`;
    };

    const createTodoElement = (todo) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <div class="checkbox ${todo.completed ? 'checked' : ''}"></div>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;

        // Checkbox click
        li.querySelector('.checkbox').addEventListener('click', async () => {
            const newStatus = !todo.completed;
            li.classList.toggle('completed');
            li.querySelector('.checkbox').classList.toggle('checked');
            await todoActions.toggle(todo.id, newStatus);
        });

        // Delete button click
        li.querySelector('.delete-btn').addEventListener('click', async () => {
            li.classList.add('removing');
            setTimeout(async () => {
                await todoActions.remove(todo.id);
            }, 300);
        });

        return li;
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        const currentTodos = todos.filter(t => t.date === selectedDateStr);
        currentTodos.forEach(todo => {
            todoList.appendChild(createTodoElement(todo));
        });
        updateStats();
    };

    const addTodo = async () => {
        const text = input.value.trim();
        if (text) {
            const currentText = text;
            input.value = '';
            await todoActions.add(currentText, selectedDateStr);
        }
    };

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    renderCalendar();
    renderTodos();
});
