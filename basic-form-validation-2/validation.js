
function Validator(formSelector) {

    var formRules = {};

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    /* 
        ? this validatorRules contains all the rules can be applied to elements
    */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : "please input something";
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'please fill email address in format name@domain.<>';
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `this is required minimum ${min} characters`;
            }
        },
    };

    // ? pick up form elements based on dom `formSelector`
    var formElement = document.querySelector(formSelector);

    // ? if success:
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');

        Array.from(inputs).forEach(function (input) {
            // ? array contains each element's rules
            var rulesRequired = input.getAttribute('rules').split('|');
            var ruleInfo;

            for (let ruleRequired of rulesRequired) {
                // * for case rule like 'min:6'
                var isRuleHasValue = ruleRequired.includes(':');

                if (isRuleHasValue) {
                    ruleInfo = ruleRequired.split(':');

                    ruleRequired = ruleInfo[0];
                }

                var ruleFunc = validatorRules[ruleRequired];
                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(parseInt(ruleInfo[1]));
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            /* formRules[input.name] = input.getAttribute('rules'); */
            // ? listen event listeners to validate 

            input.onblur = handleValidate;
            input.oninput = handleClearError;

        });
    }

    function handleValidate(event) {
        var rules = formRules[event.target.name];

        // ! some() function --> return true if any value in array pass a callback;
        // ! some() function --> return false if all values in array cannot pass a callback;
        // ! opposite to some() is every();

        var errorMessage;

        var isError = rules.every(function (rule) {
            errorMessage = rule(event.target.value);
            return !errorMessage;
        });

        // ! if there is any error
        if (errorMessage) {
            var formGroup = getParent(event.target, '.form-group');
            
            formGroup.classList.add('invalid');
            formGroup.querySelector('.form-message').innerText = errorMessage;
        }

        console.log(isError, errorMessage);
        return isError;
    }

    function handleClearError(event) {
        var formGroup = getParent(event.target, '.form-group');

        if (formGroup.classList.contains('invalid')) {
            formGroup.classList.remove('invalid')

            formGroup.querySelector('.form-message').innerText = '';
        }
    }

    // * When submit form
    formElement.onsubmit = function(event) {
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;

        inputs.forEach(function(input) {
            if(!handleValidate({target: input})) {
                isValid = false;
            }
        })

        console.log(isValid);
    }
    /* console.log(formRules); */
}


// * start to use
Validator('#register-form');