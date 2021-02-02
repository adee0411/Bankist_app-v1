'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/************** OBJECT CONSTRUCTORS  **************/

/* ACCOUNT OBJECT CONSTRUCTOR */
function Account (id, firstName, lastName, pin, openingBalance) {
  this.id = id;
  this.firstName = firstName;
  this.lastName = lastName;
  this.pin = pin;
  this.openingBalance = openingBalance;
  this.openingDate = Number(new Date());
  this.movements = [];

  this.createUserName = function() {
    this.userName = `${this.firstName} ${this.lastName}`.split(' ').map(el => {
      return el.slice(0, 2);
    }).join('').toLowerCase();
  };

  this.getIdText = function() {
    return String(this.id).padStart(4, '0');
  };

  this.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  }
}


/* MOVEMENT OBJECT CONSTRUCTOR */
function Movement(sum, accountID) {
  this.movDate = Number(new Date());
  this.sum = sum;
  this.accountID = accountID;
}


/* TIMER OBJECT CONSTRUCTOR */
let Timer = function(startMin = 5, startSec = 0) {
  this.minute = startMin;
  this.second = startSec;
  this.time;

  let startTimerInterval;

  this.formatTime = function(digit) {
    return digit < 10 ? `0${digit}` : digit;
  };

  this.startTimer = function(element) {

    this.time = `${this.formatTime(this.minute)} : ${this.formatTime(this.second)}`;
    element.textContent = this.time;

      startTimerInterval = setInterval(() => {
          if(this.second === 0) {
              this.second = 59;
              this.minute--;
          } else {
            this.second--;
          }

          this.time = `${this.formatTime(this.minute)} : ${this.formatTime(this.second)}`;
          element.textContent = this.time;

          if(this.minute === 0 && this.second === 0) {
            clearInterval(startTimerInterval);
            this.logout();
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
      }, 1000);
  };

  this.logout = function() {
    containerApp.classList.remove('fade-in');
    containerApp.classList.add('fade-out');

    let logoutTimeout = setTimeout(() => {
      containerApp.style.display = 'none';
      containerApp.classList.remove('fade-out');
      clearInterval(logoutTimeout);
    }, 500);
    clearInterval(startTimerInterval);
  };

  this.restartTimer = function(element) {
    this.minute = startMin;
    this.second = startSec;
    this.time;
    clearInterval(startTimerInterval);

    this.startTimer(element);
  }
};


/* APP OBJECT CONSTRUCTOR */
let Application = function(currentAccountIndex, currentCurrency, timer) {
  this.currentAccountIndex = currentAccountIndex;
  this.currentCurrency = currentCurrency;
  this.timer = timer;
}


/* SIGN UP FORM */
let Form = function() {
  this.formInputs = {
    isFirstNameValid: false,
    isLastNameValid: false,
    isPinValid: false
  };

  this.pinValue;
}

/* ----------------------------------------------------------------------------------*/

// TEST DATA

let testAccount1 = new Account(1, 'Adam', 'Berki', 1111, 5555);
testAccount1.movements = [
  { movDate: Number(new Date('2017.02.01.')), sum: 5555 },
  { movDate: Number(new Date('2019.02.17.')), sum: 200 },
  { movDate: Number(new Date('2018.06.19.')), sum: 450 },
  { movDate: Number(new Date('2020.01.30.')), sum: -400 },
  { movDate: Number(new Date('2021.01.01.')), sum: 3000 },
  { movDate: Number(new Date('2019.08.01.')), sum: -650 },
  { movDate: Number(new Date('2021.01.25.')), sum: -130 },
  { movDate: Number(new Date('2021.01.24.')), sum: 70 },
{ movDate: Number(new Date('2021.01.23.')), sum: 1300 }];
testAccount1.createUserName();

let testAccount2 = new Account(2, 'Patrick', 'Berki', 2222, 0);
testAccount2.movements = [  
  { movDate: Number(new Date('2016.08.11.')), sum: 0 },
  { movDate: Number(new Date('2018.06.19.')), sum: 450 },
  { movDate: Number(new Date('2020.01.30.')), sum: -800 },
  { movDate: Number(new Date('2021.01.01.')), sum: 32100 },
  { movDate: Number(new Date('2021.01.25.')), sum: -1300 },
  { movDate: Number(new Date('2021.01.24.')), sum: 72 },
  { movDate: Number(new Date('2021.01.23.')), sum: 1318 }];
testAccount2.createUserName();


// ELEMENTS

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerCurrencyBtns = document.querySelector('.currency__btn-group');
const loginForm = document.querySelector('.login');
const containerLoader = document.querySelector('.loader-cont');
const containerSignup = document.querySelector('.signup');
const containerOperationTransfer = document.querySelector('.operation--transfer');
const containerOperationLoan = document.querySelector('.operation--loan');
const containerOperationCloseAccount = document.querySelector('.operation--close');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnSignup = document.querySelector('.btn--signup');
const btnCloseSignup = document.querySelector('.btn--close-signup');
const linkSignup = document.querySelector('.link--signup');
const btnLogout = document.querySelector('.btn--logout');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const inputSignupFirstName = document.querySelector('#signup-firstname');
const inputSignupLastName = document.querySelector('#signup-lastname');
const inputSignupPin = document.querySelector('#signup-pin');
const inputSignupPinAgain = document.querySelector('#signup-pin-again');
const inputSignupBalance = document.querySelector('#signup-open-balance');

const pwdToggleBtn = document.querySelector('.pwd-toggle');
const pwdInput = document.querySelector('.login__input--pin');

// Initial Data
let accounts = [testAccount1, testAccount2];
const currencies = new Map([
  ['EUR', {
    sign: '€',
    multiplier: 1
  }],
  ['USD', {
    sign: '$',
    multiplier: 1.21
  }],
  ['GBP', {
    sign: '£',
    multiplier: 0.89
  }],
]);

let app;
let signUpForm = new Form();

/////////////////////////////////////////////////

/* TESTING!!!!!!!!! */
inputLoginUsername.value = 'adbe';
inputLoginPin.value = 1111;
/* TESTING!!!!!!!!! */



/******************************* FUNCTIONS *******************************/

const displayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthText = month < 10 ? `0${month}` : `${month + 1}`;
  const dayText = day < 10 ? `0${day}` : `${day}`;

  const dateText = `As of ${dayText} / ${monthText} / ${year}`;

  labelDate.textContent = dateText;
}

const calcBalance = (movsArr) => {
  return movsArr.reduce((acc, mov) => {
    return acc + mov.sum;
  }, 0);
};

const formatValue = (value) => {

  let valueArr = String(parseFloat(value)).replace('-', '').split('').reverse();
  let formattedValue = '';

  for(let i = 0; i < valueArr.length; i++) {
    if(i % 3 === 0 && i !== 0) {
      formattedValue += ',';
    }
    formattedValue += valueArr[i];
  }

  formattedValue = formattedValue.split('').reverse().join('');
  return value < 0 ? `-${formattedValue}` : formattedValue;
};

const displayMovements = (movsArr, multiplier, currency, displayType = 'forwards') => {
    let htmlTemplate;

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
    
      movsArr.forEach((movement, index) => {

        const movDate = new Date(movement.movDate);
        const movDateYear = movDate.getFullYear();
        const movDateMonth = movDate.getMonth();
        const movDateDay = movDate.getDate();
    
        const movementType = (index === 0) ? "opening" : movement.sum > 0 ? "deposit" : "withdrawal";

        let dateText;
        let dayDifference = currentDay - movDateDay;
        
        if((currentYear === movDateYear && currentMonth === movDateMonth) && dayDifference < 3) {
            dateText = dayDifference === 0 ? `Today` : dayDifference === 1 ? `${dayDifference} day ago` : `${dayDifference} days ago`;
        } else {
          dateText = `${movDateDay > 10 ? movDateDay : '0' + movDateDay} / ${(movDateMonth + 1) > 10 ? movDateMonth + 1 : '0' + (movDateMonth + 1) } / ${movDateYear}`;
        }
        
        htmlTemplate = `
          <div class="movements__row">
            <div class="movements__type movements__type--${movementType}">${index} ${movementType}</div>
            <div class="movements__date">${dateText}</div>
            <div class="movements__value-cont">
              <span class="movements__value">${formatValue(Math.round(movement.sum * multiplier))}</span>
              <span class="movements__currency">${currency}</span>
            </div>
          </div>
        `;

        containerMovements.insertAdjacentHTML(`${displayType === 'forwards' ? 'afterbegin' : 'beforeend'}`, htmlTemplate);
    });
};

const calcAndDisplaySums = (movsArr, multiplier, currency) => {

  let depositSum = 0;
  let withDrawalSum = 0;

  for(let mov of movsArr) {
      mov.sum > 0 ? depositSum += mov.sum : withDrawalSum += mov.sum;
  }

  labelSumIn.textContent = `${formatValue(Math.round(depositSum * multiplier))}${currency}`;

  labelSumOut.textContent = `${formatValue(Math.round(withDrawalSum * multiplier))}${currency}`;
}

const displayBalance = (movsArr, multiplier, currency) => {
  labelBalance.textContent = `${formatValue(Math.round(calcBalance(movsArr) * multiplier))} ${currency}`;
};

const updateSums = (movsArr, sum, multiplier, currency) => {
  let currentBalance = calcBalance(movsArr) * multiplier;
  let steps = 5;
  let depositSum = 0;
  let withDrawalSum = 0;

  for(let mov of movsArr) {
      mov.sum > 0 ? depositSum += mov.sum : withDrawalSum += mov.sum;
  }

  let interval = setInterval(() => {
    labelBalance.textContent = `${formatValue(sum > 0 ? Math.round((currentBalance - steps) * multiplier) : Math.round((currentBalance + steps) * multiplier))} ${currency}`;

    if(sum > 0) {
      labelSumIn.textContent = `${formatValue(Math.round((depositSum - steps) * multiplier))}${currency}`;
    } else {
      labelSumOut.textContent = `${formatValue(Math.round((withDrawalSum + steps) * multiplier))}${currency}`;
    }

    steps -= 1;
    if(steps < 0) {
      clearInterval(interval);
    }
  }, 50);
};

const changeMoney = (movsArr, multiplier, currency) => {
  updateUI(movsArr, multiplier, currency);
}

const updateUI = (movsArr, multiplier, currency) => {
  containerMovements.innerHTML = '';

  displayBalance(movsArr, multiplier, currency);
  displayMovements(movsArr, multiplier, currency);
  calcAndDisplaySums(movsArr, multiplier, currency);
};

const displayFeedback = (message, feedbackType) => {

  const feedBackElement = document.createElement('SPAN');
  feedBackElement.textContent = message;
  feedBackElement.classList.add('feedback');
  feedBackElement.classList.add(`feedback--${feedbackType}`);

  document.body.appendChild(feedBackElement);

  let feedbackTimout = setTimeout(() => {
    feedBackElement.remove();
    clearTimeout(feedbackTimout);
  }, 3000);
};


/* UI Functions */
const lightUpNewMovement = (element) => {
  element.classList.add('light-up');

  let lightUpNewMovement = setTimeout(() => {
    element.classList.remove('light-up');
    clearInterval(lightUpNewMovement);
  }, 2000);
};

const shakeElement = (element) => {
  element.classList.add('shake');

  let shakeElement = setTimeout(() => {
    element.classList.remove('shake');
    clearInterval(shakeElement);
  }, 2000);
};

const clearInputFields = (fieldsArr) => {

  fieldsArr.forEach(el => {
    el.value = '';
    el.blur();
  });
};

/* Hide and Reveal PIN input text */

const togglePasswordVisibility = function() {
  this.classList.toggle('pwd-toggle--visible');
  this.className.indexOf('visible') > -1 ? pwdInput.type = "text" : pwdInput.type = "password";
};


/************************************** LOGIN FUNCTION *************************************/
function login(userName, pin, currentAccIndex) {

  if(currentAccIndex > -1) {
    let timer = new Timer();

    app = new Application(currentAccIndex, 'EUR', timer);

    labelWelcome.textContent = `Hi, ${accounts[app.currentAccountIndex].firstName}!`;
    loginForm.style.display = 'none';
    containerLoader.style.display = 'block';
    containerApp.style.display = 'grid';
    btnLogout.style.display = 'block';

    setTimeout(() => {    
      containerLoader.style.display = 'none';
      updateUI(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
      displayDate();
      clearInputFields([inputLoginUsername, inputLoginPin]);

      setTimeout(() => {
        containerApp.classList.add('fade-in');
        timer.startTimer(labelTimer);
      }, 300);
    }, 3000);

  } else {
    displayFeedback("Wrong username and/or PIN code", "error");
  }
}

function logout(app) {
  app.timer.logout();

  setTimeout(() => {
    location.reload();
  }, 1000);
  
}


/********************* EVENTS **********************/

/* Login */
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  const userName = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  let currentAccountIndex = accounts.findIndex(acc => {
    return (acc.userName === userName && String(acc.pin) === pin);
  });


  login(userName, pin, currentAccountIndex);
});

/* Logout */
btnLogout.addEventListener('click', () => {
  logout(app);
});

/* Hide and show password */
pwdToggleBtn.addEventListener('click', togglePasswordVisibility);

/* Change Currency */
containerCurrencyBtns.addEventListener('click', function(e) {
  let target = e.target;

  if(target.type === "button" && target.className.indexOf('--selected') === -1) {
    Array.from(document.querySelectorAll('.currency__btn')).forEach(el => {
      el.classList.remove('currency__btn--selected');
    });
    target.classList.add('currency__btn--selected');

    app.currentCurrency = target.dataset.currency;

    changeMoney(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
  }
});

/* Transfer money to other account */
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  app.timer.restartTimer(labelTimer);

  const transferTo = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);

  let accountToTransferIndex = accounts.findIndex(acc => {
    return acc.userName === transferTo;
  });

  if(inputTransferTo.value === '' || inputTransferAmount.value === '') {
    shakeElement(containerOperationTransfer);
    displayFeedback("Please, enter a valid username and an amount", "error");
  } else if(accountToTransferIndex === -1) {
    shakeElement(containerOperationTransfer);
    displayFeedback("Wrong account. Try again!", "error");
  } else if(accounts[accountToTransferIndex].userName === accounts[app.currentAccountIndex].userName) {
    shakeElement(containerOperationTransfer);
    displayFeedback("It's your account. Enter another one!", "error");
  } else if(transferAmount > calcBalance(accounts[app.currentAccountIndex].movements)) {
    shakeElement(containerOperationTransfer);
    displayFeedback("Your balance is low for this operation.", "error");
  } else {
    /* Set the Currency back to default */
    app.currentCurrency = 'EUR';
    Array.from(document.querySelectorAll('.currency__btn')).forEach(el => {
      el.classList.remove('currency__btn--selected');
    });
    document.querySelector('[data-currency="EUR"]').classList.add('currency__btn--selected');
    changeMoney(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);

    /* Create new movement Object */
    let newMovement = new Movement(-transferAmount, accounts[app.currentAccountIndex].id);

    accounts[accountToTransferIndex].movements.push(newMovement); // Add new movement to other account
    accounts[app.currentAccountIndex].movements.push(newMovement); // Add new movement to current account

  
    clearInputFields([inputTransferTo, inputTransferAmount]);

    /* Update appropriate sum and balance */
    containerMovements.innerHTML = '';
    updateSums(accounts[app.currentAccountIndex].movements, -transferAmount, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
    displayMovements(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
  
    let lastMovementElement = document.querySelectorAll('.movements__row')[0];
  
    lightUpNewMovement(lastMovementElement);

    displayFeedback(`${transferAmount}€ is successfully transferred!`, "success");
  }
});

/* Request loan to current account */
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  app.timer.restartTimer(labelTimer);

  if(inputLoanAmount.value === '') {
    shakeElement(containerOperationLoan);
    displayFeedback("Enter amount!", "error");
  } else {

    /* Set the Currency back to default */
    app.currentCurrency = "EUR";
    Array.from(document.querySelectorAll('.currency__btn')).forEach(el => {
      el.classList.remove('currency__btn--selected');
    });
    document.querySelector('[data-currency="EUR"]').classList.add('currency__btn--selected');
    changeMoney(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);

    const loan = Number(inputLoanAmount.value);
    let newMovement = new Movement(loan, accounts[app.currentAccountIndex].id);

    accounts[app.currentAccountIndex].movements.push(newMovement); // Add new movement to current account
  
    clearInputFields([inputLoanAmount]);

    containerMovements.innerHTML = '';
    updateSums(accounts[app.currentAccountIndex].movements, loan, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
    displayMovements(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
  
    let lastMovementElement = document.querySelectorAll('.movements__row')[0];
  
    lightUpNewMovement(lastMovementElement);
    displayFeedback(`${loan}€ is entered to your account!`, "success");
  }
});

/* Sort movements */
btnSort.addEventListener('click', function() {

  if(this.dataset.sorted === 'false') {
    containerMovements.innerHTML = '';
    displayMovements(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign, 'reverse');
    this.dataset.sorted = 'true';
  } else {
    containerMovements.innerHTML = '';
    displayMovements(accounts[app.currentAccountIndex].movements, currencies.get(app.currentCurrency).multiplier, currencies.get(app.currentCurrency).sign);
    this.dataset.sorted = 'false';
  }
});

/* Close account */
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  let userName = inputCloseUsername.value;
  let pin = Number(inputClosePin.value);

  let accountToClose = app.currentAccountIndex;

  if(accounts[accountToClose].userName === userName && accounts[app.currentAccountIndex].pin === pin) {
    accounts.splice(app.currentAccountIndex, 1);
    logout(app);
    displayFeedback("Accout is successfully deleted!", "success");
  } else {
    displayFeedback("Wrong username or pin!", "error");
    shakeElement(containerOperationCloseAccount);
  }
});




/********************************* SIGN UP EVENTS *********************************/

/* Show SignUp Form */
linkSignup.addEventListener('click', function(e) {
  e.preventDefault();

  containerSignup.classList.remove('float-up');
  containerSignup.classList.add('float-down');
});

/* Close SignUp Form */
btnCloseSignup.addEventListener('click', function() {
  this.closest('.signup').classList.remove('float-down');
  this.closest('.signup').classList.add('float-up');
});

/* Create new account */
btnSignup.addEventListener('click', e => {
  e.preventDefault();

  let firstName = inputSignupFirstName.value;
  let lastName = inputSignupLastName.value;
  let pin = Number(inputSignupPin.value);
  let pinAgain = Number(inputSignupPinAgain.value);
  let id = accounts.length === 0 ? 0 : accounts.length + 1;
  let openingBalance = Number(inputSignupBalance.value); // Automatically convert empty string to 0

  if(Object.values(signUpForm.formInputs).length !== 0 && isFormValid(signUpForm.formInputs)) {
    let newAccount = new Account(id, firstName, lastName, pin, openingBalance);
    newAccount.createUserName();

    let movement = new Movement(openingBalance, id);
    newAccount.movements.push(movement);
  
    accounts.push(newAccount);

    clearInputFields([inputSignupFirstName, inputSignupLastName, inputSignupBalance, inputSignupPin, inputSignupPinAgain]);
    Array.from(document.querySelectorAll('.signup .valid')).forEach(el => {
      el.classList.remove('valid');
    });
    containerSignup.classList.remove('float-down');
    containerSignup.classList.add('float-up');

    signUpForm = new Form();

    login(newAccount.userName, pin, accounts.length - 1);

  } else {
    displayFeedback("Please fill in the form correctly!", "error");
  }
});

inputSignupFirstName.addEventListener('input', function() {
  let regExp = /^[A-Z]+$/i
  
  let isFirstNameValid = checkName(this, regExp);

  isFirstNameValid ? signUpForm.formInputs.isFirstNameValid = true : signUpForm.formInputs.isFirstNameValid = false;
});

inputSignupLastName.addEventListener('input', function() {
  let regExp = /^[A-Z]+$/i

  let isLastNameValid = checkName(this, regExp);

  isLastNameValid ? signUpForm.formInputs.isLastNameValid = true : signUpForm.formInputs.isLastNameValid = false;
});

inputSignupPin.addEventListener('input', () => {

  signUpForm.pinValue = inputSignupPin.value;

  if(signUpForm.pinValue.length === 4) {
    inputSignupPinAgain.disabled = false;
  } else {
    inputSignupPinAgain.disabled = true;
    inputSignupPinAgain.value = '';
    inputSignupPinAgain.classList.remove('valid');
    inputSignupPinAgain.classList.remove('invalid');
  }
});

inputSignupPinAgain.addEventListener('input', () => {

  let pinAgainValue = inputSignupPinAgain.value;

  if(signUpForm.pinValue === pinAgainValue) {
    inputSignupPinAgain.classList.remove('invalid');
    inputSignupPinAgain.classList.add('valid');

    signUpForm.formInputs.isPinValid = true;
  } else {
    inputSignupPinAgain.classList.remove('valid');
    inputSignupPinAgain.classList.add('invalid');
    signUpForm.formInputs.isPinValid = false;
  }
});

function capitalizeText(text) {
  return text[0].toUpperCase() + text.slice(1);
}

function checkPINEquality(pinValue, pinAgainValue) {
  return (pinValue === pinAgainValue) && pinAgainValue !== 0 && pinValue !== 0;
}

function checkName(inputElement, regExp) {
  let inputElementValue = inputElement.value;
  
  if(inputElementValue){
    inputElementValue = capitalizeText(inputElementValue);
  }

  if(!regExp.test(inputElementValue) && inputElement.value.length !== 0) {
    displayFeedback("Invlid characters! Please use only alphabets.", "error");
    inputElement.classList.remove('valid');
    inputElement.classList.add('invalid');

    return false;
  } else {
    if(inputElement.value) {
      inputElement.value = capitalizeText(inputElementValue);
      inputElement.classList.remove('invalid');
      inputElement.classList.add('valid');
    } else {
      inputElement.classList.remove('valid');
      inputElement.classList.remove('invalid');
    }

    return true;
  }
}

function isFormValid(formObj) {
  return Object.values(formObj).every(el => el === true);
}

/****************** TASKS ******************/

/* 
  () Correct the page loader and main app's fade in animation to display them one after another
  () Make monthly, weekly, daily, annual sums
  () Make diagrams from data 

*/