# useStatefulForm [Live Demo](https://moguelor.github.io/react-use-stateful-form/)

Custom hook created to manage the state in forms with field and fieldArrays for React 16+. 

## Run

```
yarn install
yarn start
```

## Example:

```
import React from 'react';
import { useFormState } from '../../common/hooks';
import validate from '../validate';
import Input from './Input';
import InputArray from './InputArray';

const Form = () => {

    const initialValues = {
        clubName: '',
        members: []
    };

    const handleSuccess = (values) => {
        console.log('handleSuccess', values);
    }


    const { state, getField, getFieldArray, onSubmit } = useFormState(initialValues, validate, handleSuccess);

    const clubName = getField('clubName');
    const members = getFieldArray('members');

    return (
        <form onSubmit={onSubmit}>
            <Input placeholder={'Club name'} {...clubName} />
            <InputArray getField={getField} {...members}  />
            <div>
                <button > SAVE </button>
            </div>
            <div>
                <small>Results</small>
                <div style={{backgroundColor: 'grey', fontSize:14}}><pre>{JSON.stringify(state.formValues, null, 2) }</pre></div>
            </div>
        </form>
    );


}


// validate.js

import is from 'is_js';

const validate = (values = {}) => {
    const errors = {
    };

    if (is.empty(values.clubName)) {
        errors.clubName = 'The club is required';
    }

    const membersArrayErrors = [];
    values.members && values.members.map((member, memberIndex) => {
        let memberErrors = {};

        if (!member.name) {
            memberErrors.name = 'The name is required';
            membersArrayErrors[memberIndex] = memberErrors;
        }

        if (!member.phone) {
            memberErrors.phone = 'The phone is required';
            membersArrayErrors[memberIndex] = memberErrors;
        }

    });

    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors;
    }

    return errors;
};

export default validate;

```

# Contributions

You can use this component if you want can contribute send email to jmoguelruiz@gmail.com.

_**From community to community...**_
