const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const Validator = function(options) {

  var selectorRules = {};

  function getGroupElement(element, selector) {
    while(element.parentElement) {
      if(element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var validate = function(inputElement, rule) {
    var errorElement = getGroupElement(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    var errorMessage;

    //Get every rule of selector
    var rules = selectorRules[rule.selector];

    //Loop through every rule, if has mistake, break out loop
    for(var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if(errorMessage)  
        break;
    }

    if(errorMessage) {
      errorElement.innerHTML = errorMessage; 
      getGroupElement(inputElement, options.formGroupSelector).classList.add('invalid');
    }
    else {
      errorElement.innerHTML = "";
      getGroupElement(inputElement, options.formGroupSelector).classList.remove('invalid');
    }
    return !errorMessage;
  }
  
  var formElement = $(`${options.form}`);

  if(formElement) {
    formElement.onsubmit = function(e) {
      //prevent Submit 
      e.preventDefault();

      var isFormValid = true;

      //When submit, loop every rule to check form submit
      options.rules.forEach(function(rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if(!isValid) {
          isFormValid = false;
        }
      });

      if(isFormValid) {
        if(typeof options.onSubmit === 'function') {
          var enableInputs = formElement.querySelectorAll('[name]');

          var formValues = Array.from(enableInputs).reduce(function(values, input) {
            values[input.name] = input.value;
            return values;
          }, {});

          options.onSubmit(formValues);
        }
        else {
          //Default submit 
          formElement.submit();
        }
      }
    }

    //Loop through every rule
    options.rules.forEach(function(rule) {
      //Save every rule for a single input
      if(Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      }
      else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElement = formElement.querySelector(rule.selector);

      //HTML DOM EVENT
      if(inputElement) {
        inputElement.onblur = function() {
          validate(inputElement, rule);
        }
        inputElement.oninput = function() {
          var errorElement = getGroupElement(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
          errorElement.innerHTML = '';
          getGroupElement(inputElement, options.formGroupSelector).classList.remove('invalid');
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