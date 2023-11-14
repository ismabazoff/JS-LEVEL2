const form = document.querySelector('#form')
const taskInputs = document.querySelectorAll('.form-input')
const taskName = document.querySelector('#taskName')
const taskDescription = document.querySelector('#taskDescription')
const taskDate = document.querySelector('#taskDate')
const taskTime = document.querySelector('#taskTime')
const tasksList = document.querySelector('#tasksList')
const btnClose = document.querySelector('#btnClose')

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(task => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
tasksList.addEventListener('click', fixTask)
btnClose.addEventListener('click', formOpenClose)

function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault()

    // Достаем текст задачи из поля ввода
    const taskTextName = taskName.value
    const taskTextDescription = taskDescription.value
    const taskTextDate = taskDate.value
    const taskTextTime = taskTime.value

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        name: taskTextName,
        description: taskTextDescription,
        date: taskTextDate,
        time: taskTextTime,
        done: false,
    }

    // Добавляем задачу в массив с задачами
    tasks.push(newTask)

    tasks.sort(sortTasks)

    // Сохраняем список задач в хранилище браузера localStorage
    saveToLocalStorage()

    // Рендерим задачу на странице
    renderTask(newTask)

    location.reload()

    // Очищаем поле ввода
    for (let i = 0; i < taskInputs.length; i++) {
        taskInputs[i].value = ''
    }

    checkEmptyList()
}

function doneTask(event) {
    // Проверяем что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return

    const parentNode = event.target.closest('.task-item')

    // Определяем ID задачи
    const id = Number(parentNode.id)
    const task = tasks.find(task => task.id === id)
    task.done = !task.done

    // Сохраняем список задач в хранилище браузера localStorage
    saveToLocalStorage()

    const taskInfo = parentNode.querySelectorAll('.task-info')
    for (let i = 0; i < taskInfo.length; i++) {
        taskInfo[i].classList.toggle('task-info--done')
    }
}

function deleteTask(event) {
    // Проверяем если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return

    // ищет родителя снаружи
    const parenNode = event.target.closest('.task-item')

    // Определяем ID задачи
    const id = Number(parenNode.id)

    // Удаляем задачу через фильтрацию массива
    tasks = tasks.filter(task => task.id !== id)

    // Сохраняем список задач в хранилище браузера localStorage
    saveToLocalStorage()

    // Удаляем задачу из разметки
    parenNode.remove()

    checkEmptyList()
}

function formOpenClose() {
    document.getElementById('editForm').classList.toggle('open')
}

// проверка на пустой список задач
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
				<li id="emptyList" class="empty-list">
					<p class="empty-list__title">Список дел пуст</p>
				</li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null
    }
}

function fixTask(event) {
    // Проверяем что клик был НЕ по кнопке "изменить задачу"
    if (event.target.dataset.action !== 'fix') return

    const parentNode = event.target.closest('.task-item')

    // Определяем ID задачи
    const id = Number(parentNode.id)
    const task = tasks.find(task => task.id === id)

    // заполняю форму данным по id задачи
    document.getElementById('newTitle').value = task.name
    document.getElementById('newDescription').value = task.description
    document.getElementById('newDate').value = task.date
    document.getElementById('newTime').value = task.time

    // открываю форму для редактирования
    formOpenClose()

    // Обработчик события для кнопки "Сохранить"
    document
        .getElementById('saveButton')
        .addEventListener('click', function () {
            task.name = document.getElementById('newTitle').value
            task.description = document.getElementById('newDescription').value
            task.date = document.getElementById('newDate').value
            task.time = document.getElementById('newTime').value

            // закрываю форму для редактирования
            formOpenClose()

            tasks.sort(sortTasks)

            // Сохраняем список задач в хранилище браузера localStorage
            saveToLocalStorage()
        })
}

// сортировка задач по сроку выполнения
function sortTasks(a, b) {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)

    if (dateA > dateB) {
        return 1
    }
    if (dateA < dateB) {
        return -1
    }
    return 0
}

//сохранение задач в LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// функция для разметки задачи
function renderTask(task) {
    // Формируем CSS класс
    const cssClass = task.done ? 'task-info task-info--done' : 'task-info'

    const taskHTML = `
                <li id="${task.id}" class="task-item">
					<div class="task-wrapper">
						<div class="task-item--wrapper">
							<span class="${cssClass} task-name task-info">${task.name}</span>
							<span class="${cssClass} task-description task-info">${task.description}</span>
						</div>
						<div class="task-item--wrapper">
							<span class="${cssClass} task-date task-info">${task.date}</span>
							<span class="${cssClass} task-time task-info">${task.time}</span>
						</div>
					</div>
					<div class="task-item__buttons">
						<button type="button" data-action="fix" class="btn-action">
							<img src="./img/fix.png" alt="Fix" width="20" height="20">
						</button>
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="20" height="20">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Delete" width="20" height="20">
						</button>
					</div>
				</li>`

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}

// Функция для создания уведомления
function createNotification(title, options) {
    if ('Notification' in window) {
        // Проверяем, разрешено ли отправлять уведомления
        if (Notification.permission === 'granted') {
            new Notification(title, options)
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, options)
                }
            })
        }
    }
}

// Функция для установки таймеров уведомлений для задач
function scheduleTaskNotifications() {
    const now = new Date()

    for (const task of tasks) {
        const taskDate = new Date(`${task.date}T${task.time}`)

        // Проверяем, что срок задачи ещё не наступил
        if (taskDate > now) {
            const timeUntilTask = taskDate - now

            // Устанавливаем таймер для уведомления
            setTimeout(() => {
                createNotification(
                    `Срок выполнения задачи "${task.name}" приближается!`,
                    {
                        body: task.description,
                    }
                )
            }, timeUntilTask)
        }
        console.log()
    }
}

scheduleTaskNotifications()
