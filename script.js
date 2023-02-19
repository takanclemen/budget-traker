const form = document.querySelector('.add');
let transactions = localStorage.getItem('transactions') !== null? JSON.parse(localStorage.getItem('transactions')): [];
const incomeList = document.querySelector('ul.income-list');
const expenseList = document.querySelector('ul.expense-list');
const statsExpense = document.querySelector('#expense');
const statsIncome = document.querySelector('#income');
const statsBalance = document.querySelector('#balance');
const alertPara = document.querySelector('.alertPara');

function expLink(id,source,amount,time){
    return `<li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time2">${time}</span>
    </p>
    <span>$${Math.abs(amount)}</span>
    <i class="bi bi-trash delete"></i>
</li>`
}
function addTransactionsDOM(id,source,amount,time){
if(amount > 0){
incomeList.innerHTML += expLink(id,source,amount,time);
}else{
    expenseList.innerHTML += expLink(id,source,amount,time);
}
}
function updateStatistics(){
const inFiltered = transactions.filter(transaction => 
     transaction.amount > 0).reduce((total,transaction) => 
     total += transaction.amount ,0);

const expFiltered = transactions.filter(transaction => transaction.amount < 0).reduce((total,transaction) =>
 total += Math.abs(transaction.amount)
,0)
statsIncome.textContent = inFiltered;
statsExpense.textContent = expFiltered;
statsBalance.textContent =inFiltered - expFiltered;
}
function addTransactions(source,amount){
const time = new Date();
const transaction = {
id: Math.floor(Math.random()*100000),
source: source,
amount: amount,
time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
}
transactions.push(transaction);
localStorage.setItem('transactions',JSON.stringify(transactions));
addTransactionsDOM(transaction.id,source,amount,time);

}

form.addEventListener('submit', function(event){
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === ""){
alertPara.textContent = "Please add a source and amount";
    }else{
    addTransactions(form.source.value,Number(form.amount.value));
    updateStatistics();
    form.reset();
    }
 
    
})
function getTransactions(){
    transactions.forEach(transaction => {
        if(transaction.amount > 0){
           incomeList.innerHTML += expLink(transaction.id,transaction.source,transaction.amount,transaction.time);
        }else{
            expenseList.innerHTML += expLink(transaction.id,transaction.source,transaction.amount,transaction.time);
        }
    });
}

function remLinks(id){
transactions = transactions.filter(transaction =>{
    return transaction.id !== id;
})
localStorage.setItem('transactions',JSON.stringify(transactions));
}

incomeList.addEventListener('click',function(event){
event.preventDefault();
if(event.target.classList.contains('delete')){
event.target.parentElement.remove();
remLinks(Number(event.target.parentElement.dataset.id));
updateStatistics();
}else{
    console.log('nothing here');
}
})

expenseList.addEventListener('click',function(event){
    event.preventDefault();
    if(event.target.classList.contains('delete')){
    event.target.parentElement.remove();
    remLinks(Number(event.target.parentElement.dataset.id));
    updateStatistics();
    }else{
        console.log('nothing here');
    }
    })

    function init(){
        updateStatistics();
        getTransactions();
    }
    init();