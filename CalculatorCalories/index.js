const addProduct = document.querySelector('.addProducts')
const addTargetCalories = document.querySelector('.targetCalories')
const listItems = document.querySelector('.listItems')
const allCaloriesText = document.querySelector('.listTitle_calories')
const chart = document.querySelector('.chart')
const totalCalories = document.querySelector('.totalCaloriesDay')
const bar = chart.querySelectorAll('.bar')
const deleteAll = document.querySelector('.deleteAll')
const warningsDaily = document.querySelector('.warningsDailyLimit')
const sort = document.querySelector('.sort')
const filterInput = document.querySelector('.filterInput')

const addProductsBtn = addProduct.querySelector('button')
const addTargetCaloriesBtn = addTargetCalories.querySelector('button')

let arrProducts = JSON.parse(localStorage.getItem('arrProducts')) || []
let allCalories = JSON.parse(localStorage.getItem('allCalories')) || 0
let totalCaloriesDay = JSON.parse(localStorage.getItem('totalCaloriesDay')) || 0

const createListItemElement = (item, index) => {
    const li = document.createElement('li')
    li.textContent = `${item.product}  ${Number(item.calories)}`
    const btnDelete = document.createElement('button')
    btnDelete.textContent = 'Удалить'
    btnDelete.className = 'delete-marker-button'
    li.append(btnDelete)
    listItems.append(li)
    btnDelete?.addEventListener('click', () => {
        deleteListItem(index)
    })
}

const updateLocalStorage = () => {
    localStorage.setItem('arrProducts', JSON.stringify(arrProducts))
    localStorage.setItem('allCalories', JSON.stringify(allCalories))
    localStorage.setItem('totalCaloriesDay', JSON.stringify(totalCaloriesDay))
}

const updateCalories = () => {
    allCalories = arrProducts.reduce(
        (total, item) => total + Number(item.calories),
        0
    )
    updateCaloriesText()
    updateCaloriesBar()
    updateLocalStorage()
    warningsDailyLimit()
}

const createListItems = () => {
    listItems.innerHTML = ''
    arrProducts.forEach((item, index) => {
        createListItemElement(item, index)
    })
    updateCalories()
}

const warningsDailyLimit = () => {
    if (allCalories && totalCaloriesDay && allCalories > totalCaloriesDay) {
        warningsDaily.textContent = 'Вы превысили дневную норму'
        warningsDaily.style.color = 'red'
    }
}

const deleteListItem = index => {
    arrProducts.splice(index, 1)
    createListItems()
}

addProductsBtn.addEventListener('click', () => {
    const inputs = addProduct.querySelectorAll('input')
    const newItem = { product: inputs[0].value, calories: inputs[1].value }
    arrProducts.push(newItem)
    createListItems()
    updateCaloriesBar()
    inputs[0].value = ''
    inputs[1].value = ''
})

addTargetCaloriesBtn.addEventListener('click', () => {
    const input = addTargetCalories.querySelector('input')
    totalCaloriesDay = Number(input.value)
    updateCaloriesText()
    updateLocalStorage()
})

deleteAll.addEventListener('click', () => {
    listItems.innerHTML = ''
    bar[0].style.height = '0%'
    arrProducts = []
    allCaloriesText.textContent = `Всего калорий: 0`
    updateLocalStorage()
})

const sortByDeadline = e => {
    let sortDirection =
        e.target.getAttribute('data-sort-direction') === 'asc' ? 'desc' : 'asc'
    e.target.setAttribute('data-sort-direction', sortDirection)

    arrProducts.sort((a, b) => {
        if (sortDirection === 'asc') {
            return b.calories - a.calories
        } else {
            return a.calories - b.calories
        }
    })
    createListItems()
}

sort.addEventListener('click', sortByDeadline)

const updateCaloriesText = () => {
    totalCalories.textContent = `Цель калорий на день: ${totalCaloriesDay}`
    if (totalCaloriesDay !== undefined && totalCaloriesDay > 0) {
        bar[1].style.height = `100%`
    } else {
        bar[1].style.height = '0%'
    }
}

const updateCaloriesBar = () => {
    allCaloriesText.textContent = `Всего калорий: ${allCalories}`
    const percent = (allCalories / totalCaloriesDay) * 100
    if (allCalories > totalCaloriesDay) {
        bar[0].style.height = '100%'
    } else {
        bar[0].style.height = `${percent}%`
    }
}

const filterItems = e => {
    const filter = e.target.value
    const filterArr = arrProducts.filter(
        item => item.product.indexOf(filter) !== -1
    )
    listItems.innerHTML = ''
    filterArr.forEach((item, index) => {
        createListItemElement(item, index)
    })
}

if (arrProducts) {
    createListItems()
    updateCaloriesText()
    updateCaloriesBar()
}

filterInput.addEventListener('input', filterItems)
