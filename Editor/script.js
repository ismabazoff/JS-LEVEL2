const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')
const imageInput = document.querySelector('#imageInput')
const addTextButton = document.querySelector('#addTextButton')
const saveButton = document.querySelector('#saveButton')
const textColorInput = document.querySelector('#textColorInput')
const textSizeInput = document.querySelector('#textSizeInput')
const textInput = document.querySelector('#textInput')
const texts = [] // Массив для хранения текстовых элементов

let img = new Image() // Создаю объект изображения для загрузки

// Обработчик события выбора изображения
imageInput.addEventListener('change', e => {
    const file = e.target.files[0]

    if (file) {
        // Загружаем выбранное изображение
        img.src = URL.createObjectURL(file)

        img.onload = function () {
            // Устанавливаем размер холста равным размеру изображения
            canvas.width = img.width
            canvas.height = img.height
            context.drawImage(img, 0, 0, img.width, img.height)

            // Показываем имя загруженного файла
            document.querySelector('.input-file-text').innerHTML = file.name

            // Отрисовываем добавленные тексты на изображении
            redrawText()
        }
    }
})

// Обработчик события добавления текста
addTextButton.addEventListener('click', () => {
    if (img.onload) {
        // получаю размер, цвет и текст из инпутов
        const font = `${textSizeInput.value}px Arial`
        const color = textColorInput.value
        const textContent = textInput.value

        // Создаем объект текста
        const text = {
            content: textContent,
            font: font,
            color: color,
            x: 50, // Начальная позиция X
            y: 50, // Начальная позиция Y
        }

        // Добавляем текст в массив
        texts.push(text)

        // Отрисовываем текст на холсте
        redrawText()

        // Обработка перемещения текста
        canvas.addEventListener('mousedown', e => {
            // координаты мыши относительно canvas
            const mouseX = e.clientX - canvas.getBoundingClientRect().left
            const mouseY = e.clientY - canvas.getBoundingClientRect().top

            texts.forEach(text => {
                const textWidth = context.measureText(text.content).width // ширина текста
                const textHeight = parseInt(text.font) // высота текста

                // Проверяем, было ли нажатие на текст
                if (
                    mouseX >= text.x &&
                    mouseX <= text.x + textWidth &&
                    mouseY >= text.y - textHeight &&
                    mouseY <= text.y
                ) {
                    let isDragging = false

                    // Обработчик события перемещения мыши
                    canvas.addEventListener('mousemove', e => {
                        if (isDragging) {
                            const { left, top } = canvas.getBoundingClientRect()
                            const { clientX, clientY } = e
                            const newX = clientX - left
                            const newY = clientY - top
                            text.x = newX - textWidth / 2
                            text.y = newY + textHeight / 2
                            redrawCanvas()
                        }
                    })

                    // Обработчик события отпускания кнопки мыши
                    canvas.addEventListener('mouseup', () => {
                        isDragging = false
                    })

                    isDragging = true
                }
            })
        })
    }
})

// Функция для перерисовки холста
function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Отрисовываем изображение
    context.drawImage(img, 0, 0, img.width, img.height)

    redrawText()
}

// Отрисовываем все текстовые элементы
function redrawText() {
    texts.forEach(text => {
        context.font = text.font
        context.fillStyle = text.color
        context.fillText(text.content, text.x, text.y)
    })
}

// обработчик события сохранения изображения по кнопке
saveButton.addEventListener('click', () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = canvas.toDataURL('image/png')
    downloadLink.download = 'edited_image.png'
    downloadLink.click()
})
