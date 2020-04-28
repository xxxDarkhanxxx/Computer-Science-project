/* Переменая для создания ID */
const generateId = () => `id${Math.round(Math.random() * 1e8).toString(10)}`

/* Переменные */
const totalMoneyIncome = document.querySelector(".total__money-income"),
  totalMoneyExpenses = document.querySelector(".total__money-expenses"),
  historyList = document.querySelector(".history__list"),
  totalBalance = document.querySelector(".total__balance"),
  form = document.getElementById("form"),
  operationAmount = document.querySelector(".operation__amount"),
  operationName = document.querySelector(".operation__name");

/* База данных и сохранение их, позже обрабатывает в init() */
let dbOperation = bOperation = JSON.parce(localStorage.getItem('calc')) || [];


/* Рендер массива */
const renderOperation = (operation) => {

  const className = operation.amount < 0 ?
    'history__item-minus' :
    'history__item-plus';

  const listItem = document.createElement("li");

  listItem.classList.add("history__item");
  listItem.classList.add(className);
  listItem.innerHTML = ` ${operation.description}
      <span class="history__money">${operation.amount} ₸</span>
      <button class="history_delete" data-id = "${operation.id}" >x</button> 
  `;

  historyList.append(listItem);
};

/* Считавание дохода, расхода и баланса */
const updateBalance = () => {
  const resultIncome = dbOperation
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);


  const resultExpenses = dbOperation
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + item.amount, 0);

  totalMoneyIncome.textContent = resultIncome + ' ₸';
  totalMoneyExpenses.textContent = resultExpenses + ' ₸';
  totalBalance.textContent = (resultIncome + resultExpenses) + ' ₸';

};

/* Добавление таблички или строки*/

const addOperation = (event) => {
  event.preventDefault();

  const operationNameValue = operationName.value,
    operationAmountValue = operationAmount.value;

  operationName.style.borderColor = '';
  operationAmount.style.borderColor = '';

  if (operationNameValue && operationAmountValue) {

    const operation = {
      id: generateId(),
      description: operationNameValue,
      amount: +operationAmountValue,
    };

    dbOperation.push(operation);
    init();
    console.log(dbOperation);


  } else {
    if (!operationNameValue) operationName.style.borderColor = 'red';
    if (!operationNameValue) operationAmount.style.borderColor = 'red';
  }

  operationName.value = '';
  operationAmount.value = '';
};

/* Функция для удаления строк c помощью делегирования */
const deleteOperation = (event) => {

  if (event.target.classList.contains('history_delete')) {
    const target = event.target;
    dbOperation = dbOperation
      .filter(operation => operation.id !== target.dataset.id);

    init();
  }


};


/* Запускает функцию с рендером в цикле и обновляет счетчик с деньгами*/

const init = () => {
  historyList.textContent = "";
  dbOperation.forEach(renderOperation)
  updateBalance();
  localStorage.setItem('calc', JSON.stringify(dbOperation));
};


form.addEventListener('submit', addOperation);

historyList.addEventListener('click', deleteOperation);

init();