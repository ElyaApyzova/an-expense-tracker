window.addEventListener('load', function() {

    const expenseDescription = document.getElementById('expense-description');
    const expenseCategory = document.getElementById('expense-category');
    const expenseAmount = document.getElementById('expense-amount');
    const transactionHistory = document.getElementById('transaction-history');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expenses');
    const balance = document.getElementById('balance');

    document.querySelector('.button-group button').addEventListener('submit', function(event) {
    event.preventDefault();

    const description = expenseDescription.value.trim();
    const category = expenseCategory.value;
    const amount = parseFloat(expenseAmount.value.trim());

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense description and amount.');
        return;
    }

    addTransaction(description, amount, category);
    showNotification('Transaction added successfully!');
    updateSummary();
    clearInputs();
});

function addTransaction(description, amount, category) {
    const transaction = {
        description: description,
        amount: amount,
        category: category
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));


    const transactionRow = document.createElement('tr');

    transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    `;

    transactionList.appendChild(transactionRow);

    transactionRow.querySelector('.delete-btn').addEventListener('click', function() {
        transactionRow.remove();
        removeTransaction(transaction);
        updateSummary();
    });
}


function removeTransaction(transactionToRemove) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactions = transactions.filter(function(transaction) {
        return !(transaction.description === transactionToRemove.description &&
                 transaction.amount === transactionToRemove.amount &&
                 transaction.category === transactionToRemove.category);
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactions.forEach(function(transaction) {
        addTransaction(transaction.description, transaction.amount, transaction.category);
    });

    updateSummary();
}

//window.addEventListener('load', loadTransactions);



    //expenseInput.focus();



function updateSummary() {
    let totalExpenses = 0;
    let totalIncomes = 0;

    const transactions = transactionList.querySelectorAll('tr');

    transactions.forEach(function(transaction) {
        const amount = parseFloat(transaction.children[2].textContent);
        const category = transaction.children[1].textContent;

        if (category === 'Income') {
            totalIncomes += amount;
        } else {
            totalExpenses += amount;
        }
    });

    totalExpense.textContent = totalExpenses.toFixed(2);
    totalIncome.textContent = totalIncomes.toFixed(2);
    

    const currentBalance = totalIncomes - totalExpenses;
    balance.textContent = currentBalance.toFixed(2);

    if (currentBalance >= 0) {
        balance.classList.remove('negative');
        balance.classList.add('positive');
    } else {
        balance.classList.remove('positive');
        balance.classList.add('negative');
    }
}

function clearInputs() {
    expenseInput.value = '';
    amountInput.value = '';
    categoryInput.value = 'Expense';
}


function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(function() {
        notification.classList.add('hidden');
    }, 2000); // Notification will disappear after 2 seconds
}

});