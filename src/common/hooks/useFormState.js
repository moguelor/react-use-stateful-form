import { useReducer, useEffect } from 'react';
import useKeys from './useKeys';
import set from 'lodash/set';
import get from 'lodash/get';
import is from 'is_js';

/**
 * ACTION_TYPES
 */

const CHANGE_VALUE = 'CHANGE_VALUE';
const CHANGE_METADATA = 'CHANGE_METADATA';
const RESET_FORM = 'RESET_FORM';
const INITIALIZE = 'INITIALIZE';
const ASSIGN_ERROR = 'ASSIGN_ERROR';
const REMOVE_ITEM = 'REMOVE_ITEM';

//////////////////////

/**
 * ACTIONS
 */

/** Initialize the form */
const initializeForm = (initialValues) => {
    return {
        type: INITIALIZE,
        payload: initialValues
    }
}

/** Reset the form */
const resetForm = (initialValues) => {
    return {
        type: RESET_FORM,
        payload: initialValues
    }
}

/** Change the value of element. */
const changeValueForm = (path, value) => {
    return {
        type: CHANGE_VALUE,
        payload: {
            path,
            value
        }
    }
}

/** Assign errors to element.*/
const assignErrorForm = (path, value) => {
    return {
        type: ASSIGN_ERROR,
        payload: {
            path,
            value
        }
    }
}

/** Change the metadata values.*/
const changeMetadata = (path, name, value) => {
    return {
        type: CHANGE_METADATA,
        payload: {
            path,
            name,
            value
        }
    }
}

/** Delete element of array.*/
const removeItem = (path, index) => {
    return {
        type: REMOVE_ITEM,
        payload: {
            path,
            index
        }
    };
}

///////////////////////////////////

/**
 * REDUCER
 */

const INITIAL_STATE = {
    formValues: {},
    errors: {},
    metas: {}
};

const reducer = (state, { type, payload }) => {

    let assignedValue = null;
    let newItems = [];

    switch (type) {
        case INITIALIZE:
            assignedValue = set(state, `formValues`, payload);
            return { ...state, ...assignedValue };

        case CHANGE_VALUE:
            assignedValue = set(state, `formValues.${payload.path}`, payload.value);
            return { ...state, ...assignedValue };

        case CHANGE_METADATA:
            assignedValue = set(state, `metas.${payload.path}.${payload.name}`, payload.value);
            return { ...state, ...assignedValue };

        case RESET_FORM:
            return { ...state, ...{ formValues: payload, errors: {}, metas: {} } };

        case ASSIGN_ERROR:
            assignedValue = set(state, `errors.${payload.path}`, payload.value);
            return { ...state, ...assignedValue };

        case REMOVE_ITEM:
            newItems = get(state, `formValues.${payload.path}`, []).filter((element, index) => index !== payload.index);
            assignedValue = set(state, `formValues.${payload.path}`, newItems);
            return { ...state, ...assignedValue };

        default:
            return state;
    }
}

/**
 * HOOKS
 */

/**
 * Hook to use in fields
 * @param {*} customValidation Validación del usuario.
 * @param {*} state State del formulario.
 * @param {*} dispatch Evento que disparará las acciones.
 * 
 * return
 * 
 * getField // Get properties field.  
 * getValueByPath // Get the specific value.
 */
const useField = (customValidation, state, dispatch) => {

    const getValueByPath = (path) => {
        return get(state, `formValues.${path}`, '');
    }

    const getError = (path) => {
        const errors = customValidation(state.formValues);
        return get(errors, `${path}`, null);
    }

    const getMetadata = (path, meta) => {
        return get(state.metas, `${path}.${meta}`, false);
    }

    const getField = (path) => {

        const validate = () => {
            dispatch(changeMetadata(path, 'isTouched', true));
            if (!is.empty(customValidation)) {
                const error = getError(path);
                if (!is.empty(error)) {
                    dispatch(assignErrorForm(path, error));
                    return false;
                }
            }

            return true;
        }

        return {
            bind: {
                value: getValueByPath(path),
                onChange: (e, onlyValue = false) => {
                    validate();

                    if(onlyValue){
                        dispatch(changeValueForm(path, e));
                        return;
                    }
                    dispatch(changeValueForm(path, e.target.value));
                },
                onBlur: () => {
                    validate();
                    dispatch(changeMetadata(path, 'isFocus', false));
                },
                onFocus: () => {
                    dispatch(changeMetadata(path, 'isFocus', true));
                }
            },
            error: getError(path),
            isFocus: getMetadata(path, 'isFocus'),
            isTouched: getMetadata(path, 'isTouched'),
            validate,
            changeValue: (value) => {
                dispatch(changeValueForm(path, value));
            }
        }
    };

    return [getField, getValueByPath];
}

/**
 * Hook to use as field array.
 * 
 * @param {*} customValidation Validation.
 * @param {*} state Form state.
 * @param {*} dispatch Dispatch event.
 * 
 * return
 * 
 * getFieldArray // Get fieldArray properties. 
 */
const useFieldArray = (customValidation, state, dispatch) => {

    const [getField] = useField(customValidation, state, dispatch);
    const [keys, add, remove] = useKeys(0);

    const getFieldArray = (path) => {

        const inputArray = getField(path);

        inputArray.keys = keys;
        inputArray.add = add;
        inputArray.remove = (path, index, key) => {
            dispatch(removeItem(path, index));
            remove(key);
        }

        return { ...inputArray };
    };

    return [getFieldArray];
}

/**
 * Main hook to use for the state form.
 * 
 * @param initialValues  Initial values.
 * @param customValidation Validation values.
 * @param handleSuccess On success callback.
 * 
 * return
 * ```
 * {
 *  state, // State form.
 *  reset, // Function Reset form.
 *  getField, // get field properties.
 *  getFieldArray, // get field array properties. 
 *  onSubmit, // Callback onSuccess
 *  validate // Validations.
 * }
 * ```
 */
const useFormState = (initialValues, customValidation, handleSuccess) => {

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [getField] = useField(customValidation, state, dispatch);
    const [getFieldArray] = useFieldArray(customValidation, state, dispatch);

    /**
     *  TODO: Implement a best way to manage global validation.
     */
    const validate = () => {}


    const initialize = (values = null) => {
        if (values) {
            return dispatch(initializeForm(values));
        }

        return dispatch(initializeForm(initialValues));
    }

    const reset = () => {
        dispatch(resetForm(initialValues));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        validate();
        handleSuccess(state.formValues);
    }

    useEffect(() => {
        initialize();
    }, []);

    return {
        state,
        reset,
        getField,
        getFieldArray,
        onSubmit,
        validate
    };
}

export default useFormState;