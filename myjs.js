const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const Validator = function(options) {

  var validate = function(inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
    var errorMessage = rule.test(inputElement.value);
    if(errorMessage) {
      errorElement.innerHTML = errorMessage; 
      inputElement.parentElement.classList.add('invalid');
    }
    else {
      errorElement.innerHTML = "";
      inputElement.parentElement.classList.remove('invalid');
    }
  }

  var formElement = $(`#${options.form}`);

  if(formElement) {
    options.rules.forEach(function(rule) {
      var inputElement = formElement.querySelector(rule.selector);
      if(inputElement) {
        inputElement.onblur = function() {
          validate(inputElement, rule);
        }
        inputElement.oninput = function() {
          var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
          errorElement.innerHTML = '';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    });
  }
  
}

Validator.isRequired = function(selector) {
  return {
    selector: selector,
    test: function(value) {
      return value.trim() ? undefined : "Please fill out this field";
    }
  }
}

Validator.isEmail = function(selector) {
  return {
    selector: selector,
    test: function(value) {
      var regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ ;
      return regex.test(value) ? undefined : "Please check your email";
    }
  }
}

Validator.isValidPassword = function(selector, minLength) {
  return {
    selector: selector, 
    test: function(value) {
      return value.length >= minLength ? undefined : `Your password must be at least ${minLength} characters`;
    }
  }
}

Validator.isConfirmed = function(selector, getConfirmed, message) {
  return {
    selector: selector,
    test: function(value) {
      return value === getConfirmed() ? undefined : message || 'Your confirmation is wrong';
    }
  }
}