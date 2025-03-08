let expenses = {};
let expenseChart;
let totalIncome = 0;
let totalExpenses = 0;

function addExpense() {
    let name = document.getElementById("expense-name").value.trim();
    let amount = parseFloat(document.getElementById("expense-amount").value);
    let category = document.getElementById("expense-category").value;

    if (name === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    // Create expense object
    let expense = { name, amount, category };

    // Add to the list
    let expenseList = document.getElementById("expense-list");
    let li = document.createElement("li");
    li.innerHTML = `${name}: ₹${amount} (${category}) 
        <button class="delete-btn" onclick="deleteExpense('${category}', ${amount}, this)">X</button>`;
    expenseList.appendChild(li);

    // Update category total
    if (expenses[category]) {
        expenses[category] += amount;
    } else {
        expenses[category] = amount;
    }

    // Update income and expense totals
    if (category === "Income") {
        totalIncome += amount;
    } else {
        totalExpenses += amount;
    }

    updateBalance();
    updateChart();

    // Clear input fields
    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
}

function deleteExpense(category, amount, button) {
    // Remove the expense from the category total
    if (expenses[category]) {
        expenses[category] -= amount;
        if (expenses[category] <= 0) {
            delete expenses[category]; // Remove category if total is zero
        }
    }

    // Remove from income or expenses total
    if (category === "Income") {
        totalIncome -= amount;
    } else {
        totalExpenses -= amount;
    }

    // Remove the list item
    button.parentElement.remove();

    updateBalance();
    updateChart();
}

function updateBalance() {
    let availableBalance = totalIncome - totalExpenses;
    document.getElementById("total-income").innerText = totalIncome.toFixed(2);
    document.getElementById("total-expenses").innerText = totalExpenses.toFixed(2);
    document.getElementById("available-balance").innerText = availableBalance.toFixed(2);
}

function updateChart() {
    let ctx = document.getElementById("expenseChart").getContext("2d");

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(expenses),
            datasets: [{
                data: Object.values(expenses),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#ff9f40"]
            }]
        }
    });
}
