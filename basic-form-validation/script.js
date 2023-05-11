/* 
    ? To enhance experience of user when input the form
    ? this file can be reused for other validators form
*/

// ? Function/Lib that can be reused for other validators
// ? this is the step that do the validation
function Validator(options) {
    // * get exactly parent Form group
    function getParentFormGroup(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    // * get which form in html
    var formElement = document.querySelector(options.form);

    // * contains many rules of a selector
    var selectorRules = {};

    // * create a function that only use for validating
    function validate(inputElement, rule) {
        var formMessage = getParentFormGroup(inputElement, '.form-group').querySelector('.form-message');
        var errorMessage;

        // ? get all rules of a selector that have been saved in the selectorRules
        var rules = selectorRules[rule.selector]

        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case "checkbox":
                case "radio":  
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
            
                default:
                    errorMessage = rules[i](inputElement.value);
                    break;
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            formMessage.innerText = errorMessage;
            getParentFormGroup(inputElement, '.form-group').classList.add('invalid');
        } else {
            formMessage.innerText = '';
            getParentFormGroup(inputElement, '.form-group').classList.remove('invalid');
        }

        return !errorMessage;
    }

    if (formElement) {

        // ? Process submit form when button is clicked
        formElement.onsubmit = (e) => {
            e.preventDefault();

            var isValid = true;

            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                var valid = validate(inputElement, rule);
                if (!valid) {
                    isValid = false;
                }
            })

            if (isValid) {

                // ? submit with js
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    console.log(enableInputs);
                    var formValues = Array.from(enableInputs).reduce(function (json, enableInput) {
                        switch (enableInput.type) {
                            case "radio":
                                if (enableInput.matches(':checked')) {
                                    json[enableInput.name] = enableInput.value;
                                } /* else {
                                    json[enableInput.name] = "";
                                } */
                                break;
                            case "checkbox":
                                /* 
                                    ! must update with other type of value such as 
                                    ! checkbox, file
                                */
                            default:
                                json[enableInput.name] = enableInput.value;
                                break;
                        }
                        return json;
                    }, {})

                    options.onSubmit(formValues);
                } else {
                    // ? submit with default
                    
                }
            } else {
                console.log('error');
            }

        }

        options.rules.forEach(rule => {
            // ? Save many rules for each selector input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);
            
            Array.from(inputElements).forEach(inputElement => { 
                var formMessage = getParentFormGroup(inputElement, '.form-group').querySelector(options.errorSelector);
                if (inputElement) {
                    // ? Process Blur out the input 
                    inputElement.onblur = () => {
                        // ? can get value input from <inputElement>: inputElement.value
                        // ? can get the test function for the inputElement from <rule>: rule.test()
                        validate(inputElement, rule);
                    }
    
                    // ? Process when user start input
                    inputElement.oninput = () => {
                        formMessage.innerText = '';
                        getParentFormGroup(inputElement, '.form-group').classList.remove('invalid');
                    }
                }
            })

        });

        console.log(selectorRules);
    }
}

// ? Define rules for validation

/* 
    ! when error
    ! 1. return message error
    ! 2. return nothing when not error
*/
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Please fill this field';
        }
    }
}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Please fill this field with ${min} characters`;
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Please fill email address in format <>@<>.<>';
        }
    }
}

Validator.isConfirmed = function (selector, getPassword) {
    return {
        selector: selector,
        test: function (value) {
            return value === getPassword() ? undefined : `Check the required value again`;
        }
    }
}


//? Use function/Lib
Validator({
    form: '#form-1',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isRequired('input[name="gender"]'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.minLength('#password', 8),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation', function () {
            return document.querySelector('#form-1 #password').value;
        }),
    ],
    onSubmit: function (data) { 
        console.log(data);
    },
});

/* 
  * can update this to return your exact message by adding 1 params carrying the msg in define function
*/