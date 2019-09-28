let budgetController = (function () {

  function Income(value) {
    this.value = value;
  }


  function Expense(id, des, value) {
    this.id = id;
    this.description = des;
    this.value = value
  }

  function TotalExpenses() {
    let sum = 0;
    data.expenses.forEach(expense => {
      sum += expense.value;
    });

    data.totalExpense = sum;
  }

  let data = {
    budget: 0,
    balance: 0,
    expenses: [],
    totalExpense: 0,
    currentItem: null
  }

  return {

    addBudget: function (budget) {
      let newBudget;
      // Create new Budget by calling construction function
      newBudget = new Income(budget);

      // add data to budget
      data.budget += newBudget.value;

      // return budget
      return data.budget;

    },
    addExpense: function (description, value) {

      let ID, newExpense;

      if (data.expenses.length > 0) {
        ID = data.expenses[data.expenses.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create new Expense by calling construction function
      newExpense = new Expense(ID, description, value);

      // add data to Expense
      data.expenses.push(newExpense);

      // return Expense
      return newExpense;

    },
    deleteExpenses: function (id) {

      let ids, index;
      ids = data.expenses.map(function (current) {
        return current.id;
      });


      index = ids.indexOf(id);

      if (index !== -1) {
        data.expenses.splice(index, 1);
      }


    },
    updateCurrentExpense: function (des, value) {
      let found = null;
      data.expenses.forEach(cur => {
        if (cur.id === data.currentItem.id) {
          cur.description = des;
          cur.value = value;
          found = cur;
        }
      });

      return found;

    },
    editStateItem: function (id) {
      let foundItem;
      foundItem = data.expenses.find(cur => {
        return cur.id === id;
      });

      return foundItem;
    },
    setCurrentItem: function (item) {
      return data.currentItem = item;
    },
    getCurrentitem: function () {
      return data.currentItem;
    },
    calculate: function () {
      // Total expenses

      TotalExpenses();

      // data.balance = data.budget - data.totalExpense;

      data.balance = data.budget - data.totalExpense;

    },
    getData: function () {
      return {
        budget: data.budget,
        totalExpense: data.totalExpense,
        balance: data.balance,
      };
    },
    // testing: function () {
    //   return data;
    // }

  }

})();


// UI Controller

let UIController = (function () {

  let DOMStrings = {
    budgetInput: '#budget-input',
    budgetSubmit: '#budget-submit',
    budgetAmount: '#budget-amount',
    expenseAmount: '#expense-amount',
    balanceAmount: '#balance-amount',
    expenseInput: '#expense-input',
    expensAmount: '#amount-input',
    expenseSubmit: '#expense-submit',
    expenseList: '#expense-list',
    editSubmit: '#edit-submit',
    expense: '.expens'

  }

  return {

    getBudgetInputValue: function () {
      return parseFloat(document.querySelector(DOMStrings.budgetInput).value);
    },
    getExpenseInputValue: function () {
      return {
        expensDescription: document.querySelector(DOMStrings.expenseInput).value,
        expensValue: parseFloat(document.querySelector(DOMStrings.expensAmount).value),
      };
    },

    addBudgetUi: function (budget) {
      document.querySelector(DOMStrings.budgetAmount).textContent = budget;
    },
    addExpenseUi: function (expense) {
      document.querySelector(DOMStrings.expenseAmount).textContent = expense;
    },
    addExpenseListUi: function (expense) {
      document.querySelector(DOMStrings.expenseList).innerHTML += `<div class="expens" id="expense-${expense.id}">
      <div class="expense-item d-flex justify-content-between align-items-baseline">

       <h6 class="expense-title mb-0 text-uppercase list-item">${expense.description}</h6>
       <h5 class="expense-amount mb-0 list-item">${expense.value}</h5>

       <div class="expense-icons list-item">

        <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
         <i class="fas fa-edit"></i>
        </a>
        <a href="#" class="delete-icon" data-id="${expense.id}">
         <i class="fas fa-trash"></i>
        </a>
       </div>
      </div>

     </div> `;
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(DOMStrings.expense);

      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');



        if (itemID === `expense-${item.id}`) {
          document.querySelector(
            `#expense-${item.id}`).innerHTML = `<div class="expens" id="expense-${item.id}" >
          <div class="expense-item d-flex justify-content-between align-items-baseline">

           <h6 class="expense-title mb-0 text-uppercase list-item">${item.description}</h6>
           <h5 class="expense-amount mb-0 list-item">${item.value}</h5>

           <div class="expense-icons list-item">

            <a href="#" class="edit-icon mx-2" data-id="${item.id}">
             <i class="fas fa-edit"></i>
            </a>
            <a href="#" class="delete-icon" data-id="${item.id}">
             <i class="fas fa-trash"></i>
            </a>
           </div>
          </div>

         </div> `;
        }
      });


    },
    clearInput: function () {
      document.querySelector(DOMStrings.budgetInput).value = '';
    },
    expenseclearInput: function () {
      document.querySelector(DOMStrings.expenseInput).value = '';
      document.querySelector(DOMStrings.expensAmount).value = '';
    },
    showBalanceUI: function (balance) {
      document.querySelector(DOMStrings.balanceAmount).textContent = balance;

    },
    deleteItemUI: function (item) {
      item.remove();
    },
    getDOMStrings: function () {
      return DOMStrings;
    },
    clearEditState: function () {
      document.querySelector(DOMStrings.editSubmit).style.display = 'none';
    },
    showCurrentItem: function (item) {
      document.querySelector(DOMStrings.editSubmit).style.display = 'block';
      document.querySelector(DOMStrings.expenseSubmit).style.display = 'none';

      document.querySelector(DOMStrings.expenseInput).value = item.description;
      document.querySelector(DOMStrings.expensAmount).value = item.value;
    }
  }
})();


// App Controller

let controller = (function (budgetCtrl, UICtrl) {

  let DOM = UICtrl.getDOMStrings();

  function setupEventListners() {

    //Clear edit state

    UICtrl.clearEditState();


    // add EventListners to add Budget
    document.querySelector(DOM.budgetSubmit).addEventListener('click', ctrladdBudget);

    // add EventListners to add Expnses
    document.querySelector(DOM.expenseSubmit).addEventListener('click', ctrladdExpense);

    // add EventListners to delete button
    document.querySelector(DOM.expenseList).addEventListener('click', ctrldelete);

    // add EventListners to Edit button
    document.querySelector(DOM.expenseList).addEventListener('click', ctrlEditItem);

    // add EventListners to Edit button
    document.querySelector(DOM.editSubmit).addEventListener('click', updateEditItem);


  }

  // CtrlAddBudget
  function ctrladdBudget() {
    // get data
    let input = UICtrl.getBudgetInputValue();

    // clear input
    UICtrl.clearInput();
    // Check if input has a value or not

    if (!isNaN(input) && input > 0) {

      // add data to data structure
      let newBudget = budgetCtrl.addBudget(input);

      // show to ui
      UICtrl.addBudgetUi(newBudget);

      // update the balance
      updateBalance();
    }
  }



  // CtrlAddExpnases
  function ctrladdExpense() {
    // get data
    let input = UICtrl.getExpenseInputValue();

    // clear input
    UICtrl.expenseclearInput();
    // Check if input has a value or not

    if (!isNaN(input.expensValue) && input.expensValue > 0 && input.expensDescription !== '') {

      // add data to data structure
      let newExpense = budgetCtrl.addExpense(input.expensDescription, input.expensValue);

      // // show total expense to  ui
      // UICtrl.addExpenseUi(totalExpense);

      UICtrl.addExpenseListUi(newExpense);

      // update the balance
      updateBalance();



    }
  }

  // delete item

  function ctrldelete(e) {
    let ID, item;

    ID = parseInt(e.target.parentElement.getAttribute('data-id'));
    item = e.target.parentElement.parentElement.parentElement.parentElement;
    if (e.target.classList.contains('fa-trash')) {

      // delete data from data structure
      budgetCtrl.deleteExpenses(ID);

      // delete data from ui
      UICtrl.deleteItemUI(item);
      // update balance
      updateBalance();

    }


  }


  // Edit item

  function ctrlEditItem(e) {

    if (e.target.classList.contains('fa-edit')) {

      let ID;
      ID = parseInt(e.target.parentElement.getAttribute('data-id'));

      // get current item

      let item = budgetCtrl.editStateItem(ID);

      // set Current item
      let currentItem = budgetCtrl.setCurrentItem(item);

      //show cuurent item to input field
      UICtrl.showCurrentItem(currentItem);

    }

  }



  // updateEdit item
  function updateEditItem() {
    // get data
    let input = UICtrl.getExpenseInputValue();

    // clear input
    UICtrl.expenseclearInput();
    // Check if input has a value or not

    if (!isNaN(input.expensValue) && input.expensValue > 0 && input.expensDescription !== '') {

      // add data to data structure
      let UpdatedItem = budgetCtrl.updateCurrentExpense(input.expensDescription, input.expensValue);

      //UPDATED UI

      UICtrl.updateListItem(UpdatedItem);

      // update the balance
      updateBalance();



    }
  }

  function updateBalance() {

    // 1. Calculate data
    budgetCtrl.calculate();

    // calculate balance
    let data = budgetCtrl.getData();
    //add to ui
    UICtrl.showBalanceUI(data.balance);

    // show total expense to  ui
    UICtrl.addExpenseUi(data.totalExpense);

  }



  return {
    init: function () {
      setupEventListners();
    }
  }
})(budgetController, UIController);

// app initialize
controller.init();