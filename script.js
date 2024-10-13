document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    const addExpenseButton = document.getElementById('addExpenseButton');
    const clearExpensesButton = document.getElementById('clearExpensesButton');
    
    const expenseList = document.getElementById('expenseList');
    const monthsPassedElement = document.getElementById('monthsPassed');
    const totalAmountElement = document.getElementById('totalAmount');
    const remainingAmountElement = document.getElementById('remainingAmount');
    const startDateInput = document.getElementById('startDate');
    const monthlyAmountInput = document.getElementById('monthlyAmount');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseCommentInput = document.getElementById('expenseComment');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let savedStartDate = localStorage.getItem('startDate');
    let savedMonthlyAmount = localStorage.getItem('monthlyAmount');
    let savedMonthsPassed = localStorage.getItem('monthsPassed');
    let savedTotalAmount = localStorage.getItem('totalAmount');
    let savedRemainingAmount = localStorage.getItem('remainingAmount');

    let monthlyAmount = 0;
    let monthsPassed = 0;
    let totalAmount = 0;

    // Восстановление сохраненных данных при загрузке страницы
    if (savedStartDate) {
        startDateInput.value = savedStartDate;
    }
    
    if (savedMonthlyAmount) {
        monthlyAmountInput.value = savedMonthlyAmount;
    }

    if (savedMonthsPassed) {
        monthsPassedElement.innerText = `Прошло месяцев: ${savedMonthsPassed}`;
        monthsPassed = parseInt(savedMonthsPassed, 10); // Присваиваем значение переменной
    }

    if (savedTotalAmount) {
        totalAmountElement.innerText = `Общая накопленная сумма: ${savedTotalAmount} рублей.`;
        totalAmount = parseFloat(savedTotalAmount); // Присваиваем значение переменной
    }

    if (savedRemainingAmount) {
        remainingAmountElement.innerText = `Остаток после расходов: ${savedRemainingAmount} рублей.`;
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.textContent = `Расход: ${expense.amount} рублей, Комментарий: ${expense.comment}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', function() {
                removeExpense(index);
            });
            li.appendChild(deleteButton);
            expenseList.appendChild(li);
        });
        calculateRemainingAmount(); // Пересчитываем остаток после рендера расходов
    }

    function removeExpense(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    function calculateMonthsPassed() {
        const startDate = new Date(startDateInput.value);
        const currentDate = new Date();
        if (isNaN(startDate.getTime())) {
            alert('Пожалуйста, выберите корректную дату.');
            return;
        }
        monthsPassed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (currentDate.getMonth() - startDate.getMonth());
        if (monthsPassed < 0) {
            alert('Дата не может быть в будущем!');
            return;
        }
        monthsPassedElement.innerText = `Прошло месяцев: ${monthsPassed}`;
        localStorage.setItem('monthsPassed', monthsPassed); // Сохраняем в localStorage
    }

    function calculateTotalAmount() {
        monthlyAmount = parseFloat(monthlyAmountInput.value);
        if (isNaN(monthlyAmount) || monthlyAmount < 0) {
            alert('Пожалуйста, введите корректную сумму.');
            return;
        }
        totalAmount = monthsPassed * monthlyAmount;
        totalAmountElement.innerText = `Общая накопленная сумма: ${totalAmount} рублей.`;
        localStorage.setItem('totalAmount', totalAmount); // Сохраняем в localStorage
        calculateRemainingAmount(); // Пересчет остатка после пересчета накоплений
    }

    function calculateRemainingAmount() {
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingAmount = totalAmount - totalExpenses;
        remainingAmountElement.innerText = `Остаток после расходов: ${remainingAmount} рублей.`;
        localStorage.setItem('remainingAmount', remainingAmount); // Сохраняем в localStorage
    }

    calculateButton.addEventListener('click', function() {
        // Сохранение введенных данных в localStorage
        localStorage.setItem('startDate', startDateInput.value);
        localStorage.setItem('monthlyAmount', monthlyAmountInput.value);

        calculateMonthsPassed();
        calculateTotalAmount(); // Это также пересчитает остаток
    });

    addExpenseButton.addEventListener('click', function() {
        const expenseAmount = parseFloat(expenseAmountInput.value);
        const expenseComment = expenseCommentInput.value;
        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            alert('Пожалуйста, введите корректную сумму расходов.');
            return;
        }
        expenses.push({ amount: expenseAmount, comment: expenseComment });
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    });

    clearExpensesButton.addEventListener('click', function() {
        expenses = [];
        localStorage.removeItem('expenses');
        renderExpenses();
    });

    renderExpenses(); // Отобразить список расходов при загрузке
    calculateRemainingAmount(); // Пересчитываем остаток при загрузке страницы на основе данных
});
