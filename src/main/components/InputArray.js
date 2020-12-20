import React from 'react';
import Input from './Input';

const InputArray = ({ keys, getField, remove, add }) => {

    return (
        <div>
            {
                keys.map((key, index) => {
                    return (
                        <div key={key}>
                            <small styles={{fontSize: 13}}>Member #{index + 1}</small> <br/>
                            <button type="button" onClick={() => remove(`members`, index, key)}> REMOVE </button> 
                            <Input placeholder={'Name'} {...getField(`members[${index}].name`)} />
                            <Input placeholder={'Phone'} {...getField(`members[${index}].phone`)} />
                        </div>
                    )
                })
            }
            <button type="button" onClick={add}> ADD MEMBER </button>
        </div>
    );
}

export default InputArray;
