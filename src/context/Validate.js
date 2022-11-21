export default function formValidator(errorValues, name, value) {

let errors = {...errorValues};

const VALID_FULLNAME = new RegExp(/([A-Za-z])\w+/i);
const VALID_EMAIL = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const VALID_PASSWORD = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/);

let isValid = true;

switch (name) {

    case 'fullname':

        if (value.length <= 3 || value.length > 50) {

            errors = {
                ...errors,
                fullname: 'Full Name should be between 3 to 50 characters'
            }

            isValid = false;

        } else if (!VALID_FULLNAME.test(value)) {

            errors = {
                ...errors,
                fullname: 'Enter Invalid Full Name'
            }

            isValid = false;

        } else  errors['fullname'] = '';

        break;

    case 'email':

        if (!VALID_EMAIL.test(value)) {

            errors = {
                ...errors,
                email: 'Enter a valid email address'
            }

            isValid = false;

        } else errors['email'] = '';

        break;

    case 'password':

        if (!VALID_PASSWORD.test(value)) {

            errors = {
                ...errors,
                password: 'Password should be 8-23 character long. Atleast: 1 uppercase, 1 lowercase, 1 number, 1 special character.'
            }

            isValid = false;

        } else errors['password'] = '';

        break;

    default:
        break;
}

return { errors, isValid };
}