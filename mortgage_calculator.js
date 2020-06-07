const readline = require('readline-sync');
const MESSAGES = require('./mortgage_calculator_message.json');

// Retrieve message from MESSAGES json file
function messages(message, lang = 'en') {
  return MESSAGES[lang][message];
}

// Output message to console
function prompt(message) {
  console.log(`> ${message}`);
}

// Return true if value is not a number
function isInvalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

// Validate entry for loan amount
// Return true if input is not a number or is less than or equal to zero
function isInvalidAmount(number) {
  return isInvalidNumber(number) || number <= 0;
}

// Validate entry for loan amount
// Return true if input is not a number and is not greater than zero
function isInvalidApr(number) {
  return isInvalidNumber(number) || number < 0;
}

// Validate entry for loan duration
// True if input is not a number, is less less than or equal to zero
// and is not a whole number
function isInvalidDuration(number) {
  return isInvalidNumber(number) || number <= 0 || number % 1 > 0;
}

// Validate entry for continuing or exiting the program
function isInvalidContinue(input) {
  return !['y', 'n'].includes(input.toLowerCase());
}

// Ask user a question and validate response - return check for valid response
function getInput(question, errorMessage, validation) {
  prompt(messages(question));
  let response = readline.question();

  if (errorMessage && validation) {
    while (validation(response)) {
      prompt(messages(errorMessage));
      response = readline.question();
    }
  }

  return response;
}

// Calculate monthly payment amount
function calculateMonthlyPayment(amount, apr, duration) {
  if (Number(apr) === 0) {
    return amount / duration;
  } else {
    let monthlyPR = (apr / 100) / 12;
    return amount * (monthlyPR / (1 - Math.pow((1 + monthlyPR),(-duration))));
  }
}

// Format and display loan values
function displayLoanValues(loanAmount, apr, loanMonths) {
  prompt('------------------------------------------------------');
  prompt((messages('loan_amount') + messages('currency') + loanAmount));
  prompt((messages('apr') + apr + '%'));
  prompt((messages('loan_duration') + loanMonths));
}

// Format and display monthly payment amount
function displayMonthlyPayment(monthlyPayment) {
  prompt('------------------------------------------------------');
  prompt((messages('monthly_payment') + monthlyPayment));
  prompt('------------------------------------------------------');
}

// Mortgage calculator
function mortgageCalculator() {

  prompt(messages('welcome'));

  while (true) {
    // ask for the loan amount
    let amount = getInput('get_amount','invalid_amount', isInvalidAmount);

    // ask for the APR %
    let apr = getInput('get_apr','invalid_apr', isInvalidApr);

    // ask for the loan duration in months
    let months = getInput('get_duration','invalid_duration', isInvalidDuration);

    // display inputs - used to calculate loan amounts
    prompt(messages('thankyou'));
    displayLoanValues(amount, apr, months);

    // calculate and display monthly payment amount
    let monthlyPayment = calculateMonthlyPayment(amount, apr, months);
    displayMonthlyPayment(monthlyPayment.toFixed(2));

    // make another calculation?
    let cont = getInput('continue','invalid_continue', isInvalidContinue);

    // end process if choice is no
    if (cont.toLowerCase() === 'n')  break;

    // clear last calculation before moving on
    console.clear();
  }
}

mortgageCalculator();

