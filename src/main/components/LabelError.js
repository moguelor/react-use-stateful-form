import React from 'react';

export const LabelError = ({error}) => {
    return <small style={{fontSize: 11, color:'red'}}>{error}</small>
}

export default LabelError;