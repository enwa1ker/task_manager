const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const tasksPage = document.querySelector('.tasks-page');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    if (wrapper.classList.contains('active-popup')) {
        // Если окно уже открыто, то закрыть
        wrapper.classList.remove('active-popup');
    } else {
        // Если окно закрыто, то открыть
        wrapper.classList.add('active-popup');
    }
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

// Код для регистрации
document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Отправляем POST-запрос на эндпоинт регистрации пользователя
    try {
        const response = await fetch('https://657434b6f941bda3f2af79b0.mockapi.io/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        // Обрабатываем ответ по необходимости
        console.log('Ответ регистрации:', data);

        // Закрываем окно после успешной регистрации
        wrapper.classList.remove('active-popup');
        alert('вы успешно зарегестрировались')
    } catch (error) {
        console.error('Ошибка во время регистрации:', error);
    }
});

// Код для авторизации

function showPopup() {
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) {
        wrapper.classList.add('active-popup');
    }
}

// Обновленный код с использованием функции showPopup
let matchedUser;

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Получаем список пользователей с мокAPI
        const response = await fetch('https://657434b6f941bda3f2af79b0.mockapi.io/users');
        const users = await response.json();

        // Проверяем, есть ли пользователь с введенными почтой и паролем
        matchedUser = users.find(user => user.email === email && user.password === password);

        if (matchedUser) {
            console.log('Успешно авторизован:', matchedUser);

            // Смена текста кнопки на "Logout"
            const btnPopup = document.querySelector('.btnLogin-popup');
            if (btnPopup) {
                btnPopup.textContent = 'Logout';
                btnPopup.removeEventListener('click', showPopup);
                btnPopup.addEventListener('click', logout);
            }

            try {
                // Получаем список тасков для авторизованного пользователя
                const tasksResponse = await fetch(`https://657434b6f941bda3f2af79b0.mockapi.io/users/${matchedUser.id}/tasks`);
                const tasks = await tasksResponse.json();

                // Отображаем таски на странице
                const tasksContainer = document.getElementById('tasksContainer');
                tasksContainer.innerHTML = ''; // Очищаем предыдущий контейнер

                tasks.forEach(task => {
                    // Создаем див для каждой задачи
                    const taskDiv = document.createElement('div');
                    taskDiv.classList.add('task-card'); // Добавляем класс для стилизации

                    // Добавляем заголовок
                    const titleElement = document.createElement('h3');
                    titleElement.textContent = task.title;

                    // Добавляем описание
                    const bodyElement = document.createElement('p');
                    bodyElement.textContent = task.body;

                    const completeButton = createButton('Complete', () => toggleComplete(task.id, !task.completed));
                    const editButton = createButton('Edit', () => editTask(task.id));
                    const deleteButton = createButton('Delete', () => deleteTask(task.id));

                    // Добавляем элементы к диву задачи
                    taskDiv.appendChild(titleElement);
                    taskDiv.appendChild(bodyElement);
                    taskDiv.appendChild(completeButton);
                    taskDiv.appendChild(editButton);
                    taskDiv.appendChild(deleteButton);

                    // Добавляем див задачи к контейнеру
                    tasksContainer.appendChild(taskDiv);
                });

                // Показываем блок с тасками
                const tasksPage = document.getElementById('tasksPage');
                const addTaskBtn = document.getElementById('addTaskBtn');

                if (tasksPage && addTaskBtn) {
                    tasksPage.style.display = 'flex';
                    addTaskBtn.style.display = 'block';

                    addTaskBtn.addEventListener('click', function () {
                        // Добавьте здесь код для обработки нажатия на кнопку "Добавить таск"
                    });
                } else {
                    console.error('Ошибка во время авторизации: Элемент "tasksPage" не найден');
                }

                // Выводим список тасков в консоль
                console.log('Список тасков:', tasks);
            } catch (tasksError) {
                console.error('Ошибка во время получения списка тасков:', tasksError);
            }

            // Закрываем окно после успешной авторизации
            const wrapper = document.getElementById('wrapper');
            if (wrapper) {
                wrapper.classList.remove('active-popup');
            } else {
                console.error('Ошибка во время авторизации: Элемент "wrapper" не найден');
            }
        } else {
            console.error('Ошибка авторизации: Пользователь не найден');
            alert('Ошибка авторизации: Пользователь не найден');
        }
    } catch (error) {
        console.error('Ошибка во время авторизации:', error);
    }
});

// Функция для выхода пользователя
function logout() {
    // Сброс данных пользователя
    matchedUser = null;

    // Очистка тасков на странице
    const tasksContainer = document.getElementById('tasksContainer');
    if (tasksContainer) {
        tasksContainer.innerHTML = '';
    }

    // Скрытие блока с тасками
    const tasksPage = document.getElementById('tasksPage');
    if (tasksPage) {
        tasksPage.style.display = 'none';
    }

    // Сброс текста кнопки на "Login"
    const btnPopup = document.querySelector('.btnLogin-popup');
    if (btnPopup) {
        btnPopup.textContent = 'Login';
        btnPopup.removeEventListener('click', logout);
        btnPopup.addEventListener('click', showPopup);
    }

    console.log('Пользователь успешно вышел из системы.');
}

// Функция для создания кнопки
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

// Функция для изменения состояния 'completed' задачи
async function toggleComplete(taskId, completed) {
    try {
        const response = await fetch(`https://657434b6f941bda3f2af79b0.mockapi.io/users/${matchedUser.id}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed }),
        });

        if (response.ok) {
            console.log(`Состояние задачи с ID ${taskId} успешно изменено.`);
            // Обновляем список задач на странице
            await updateTaskList();
        } else {
            console.error(`Ошибка при изменении состояния задачи с ID ${taskId}.`);
        }
    } catch (error) {
        console.error('Ошибка во время обновления задачи:', error);
    }
}

// Функция для изменения описания и названия задачи
function editTask(taskId) {
    const newTitle = prompt('Введите новое название задачи:');
    const newBody = prompt('Введите новое описание задачи:');

    if (newTitle !== null && newBody !== null) {
        updateTask(taskId, { title: newTitle, body: newBody });
    }
}

// Функция для обновления задачи
async function updateTask(taskId, updatedData) {
    try {
        const response = await fetch(`https://657434b6f941bda3f2af79b0.mockapi.io/users/${matchedUser.id}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            console.log(`Задача с ID ${taskId} успешно обновлена.`);
            // Обновляем список задач на странице
            await updateTaskList();
        } else {
            console.error(`Ошибка при обновлении задачи с ID ${taskId}.`);
        }
    } catch (error) {
        console.error('Ошибка во время обновления задачи:', error);
    }
}

// Функция для удаления задачи
async function deleteTask(taskId) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        try {
            const response = await fetch(`https://657434b6f941bda3f2af79b0.mockapi.io/users/${matchedUser.id}/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Задача с ID ${taskId} успешно удалена.`);
                // Обновляем список задач на странице
                await updateTaskList();
            } else {
                console.error(`Ошибка при удалении задачи с ID ${taskId}.`);
            }
        } catch (error) {
            console.error('Ошибка во время удаления задачи:', error);
        }
    }
}

// Функция для обновления списка задач на странице
async function updateTaskList() {
    try {
        const tasksResponse = await fetch(`https://657434b6f941bda3f2af79b0.mockapi.io/users/${matchedUser.id}/tasks`);
        const tasks = await tasksResponse.json();

        // Отображаем таски на странице
        const tasksContainer = document.getElementById('tasksContainer');
        tasksContainer.innerHTML = ''; // Очищаем предыдущий контейнер

        tasks.forEach(task => {
            // Создаем див для каждой задачи
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task-card'); // Добавляем класс для стилизации

            // Добавляем заголовок
            const titleElement = document.createElement('h3');
            titleElement.textContent = task.title;

            // Добавляем описание
            const bodyElement = document.createElement('p');
            bodyElement.textContent = task.body;

            const completeButton = createButton('Complete', () => toggleComplete(task.id, !task.completed));
            const editButton = createButton('Edit', () => editTask(task.id));
            const deleteButton = createButton('Delete', () => deleteTask(task.id));

            // Добавляем элементы к диву задачи
            taskDiv.appendChild(titleElement);
            taskDiv.appendChild(bodyElement);
            taskDiv.appendChild(completeButton);
            taskDiv.appendChild(editButton);
            taskDiv.appendChild(deleteButton);

            // Добавляем див задачи к контейнеру
            tasksContainer.appendChild(taskDiv);
        });

        console.log('Список тасков успешно обновлен.');
    } catch (error) {
        console.error('Ошибка во время обновления списка тасков:', error);
    }
}

/////////////////////////////
document.getElementById('addTaskBtn').addEventListener('click', function () {
    const addTaskModal = document.getElementById('addTaskModal');
    if (addTaskModal) {
        addTaskModal.style.display = 'block';
    } else {
        console.error('Ошибка: Элемент "addTaskModal" не найден.');
    }
});

// Закрываем модальное окно
function closeAddTaskModal() {
    const addTaskModal = document.getElementById('addTaskModal');
    if (addTaskModal) {
        addTaskModal.style.display = 'none';
    } else {
        console.error('Ошибка: Элемент "addTaskModal" не найден.');
    }
}

// Обработчик события для отправки данных на мокапи
document.getElementById('addTaskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskTitleInput = document.getElementById('taskTitleInput');
    const taskBodyInput = document.getElementById('taskBodyInput');

    if (taskTitleInput && taskBodyInput) {
        const title = taskTitleInput.value;
        const body = taskBodyInput.value;

        if (title && body) {
            // Получаем ID авторизованного пользователя
            const userId = matchedUser.id;

            // Вызываем функцию для создания и отправки таска
            await createAndSendTask(userId, title, body);

            // Закрываем модальное окно после успешного создания таска
            closeAddTaskModal();
        } else {
            console.error('Введите название и описание таска.');
        }
    } else {
        console.error('Ошибка: Элементы для ввода не найдены.');
    }
});

// Функция для создания и отправки таска
async function createAndSendTask(userId, title, body) {
    try {
        const response = await fetch(`https://657434b6f941bda3f2af79b0.mockapi.io/users/${userId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body, completed: false }),
        });

        if (response.ok) {
            console.log('Таск успешно создан и отправлен.');
            // Обновляем список задач на странице
            await updateTaskList();

            // Очищаем инпуты после успешного создания таска
            clearTaskInputs();
        } else {
            console.error('Ошибка при создании и отправке таска.');
        }
    } catch (error) {
        console.error('Ошибка во время создания и отправки таска:', error);
    }
}

// Функция для очистки инпутов
function clearTaskInputs() {
    const taskTitleInput = document.getElementById('taskTitleInput');
    const taskBodyInput = document.getElementById('taskBodyInput');

    if (taskTitleInput && taskBodyInput) {
        taskTitleInput.value = '';
        taskBodyInput.value = '';
    } else {
        console.error('Ошибка: Элементы для ввода не найдены.');
    }
}
