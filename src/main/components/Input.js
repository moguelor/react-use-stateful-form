import React from 'react';
import LabelError from './LabelError';

const Input = ({bind, isTouched, error, placeholder}) => {
    return <div>
        <div>
            <input {...bind} placeholder={placeholder}/>
        </div>
        <LabelError error={ error && isTouched && error} /> 
    </div>
}

export default Input;