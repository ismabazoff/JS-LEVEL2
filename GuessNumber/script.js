document.addEventListener('DOMContentLoaded', () => {
    const numberInput = document.querySelector('#numberInput')
    const guessButton = document.querySelector('#guessButton')
    const restartButton = document.querySelector('#restartButton')
    const resultMessage = document.querySelector('#resultMessage')
    const hintMessage = document.querySelector('#hintMessage')
    const attemptsCounter = document.querySelector('#attemptsCounter')

    let randomNumber
    let attempts = 0

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function restartGame() {
        randomNumber = generateRandomNumber(1, 100)
        attempts = 0
        resultMessage.textContent = ''
        hintMessage.textContent = ''
        attemptsCounter.textContent = 'Попыток: 0'
        numberInput.value = ''
        numberInput.disabled = false
        guessButton.disabled = false
    }

    function showMessage(message, element) {
        element.textContent = message
    }

    function checkNumber() {
        const guess = parseInt(numberInput.value)
        attempts++

        if (guess < 1 || guess > 100) {
            showMessage('Введенное число вне диапазона (1-100)!', resultMessage)
        } else if (guess < randomNumber) {
            showMessage('Загаданное число больше ' + guess, resultMessage)
        } else if (guess > randomNumber) {
            showMessage('Загаданное число меньше ' + guess, resultMessage)
        } else {
            showMessage('Вы угадали число!', resultMessage)
            numberInput.disabled = true
            guessButton.disabled = true
        }

        if (attempts % 3 === 0) {
            const evenOrOdd = randomNumber % 2 === 0 ? 'четное' : 'нечетное'
            showMessage('Загаданное число ' + evenOrOdd, hintMessage)
        }

        attemptsCounter.textContent = 'Попыток: ' + attempts
    }

    guessButton.addEventListener('click', checkNumber)
    restartButton.addEventListener('click', restartGame)

    restartGame()
})
