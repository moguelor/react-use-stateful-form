import {useState} from 'react';
import useSequence from './useSequence';

/**
 * Hook to generate arrays.
 * @param {*} initial Valor inicial
 */
const useKeys = (initial) => {
    let getKey = useSequence(initial + 1)
    let [keys, setKeys] = useState(Array(initial).fill(0).map((x, i) => i + 1))
    let add = () => setKeys(keys.concat(getKey()))
    let remove = (key) => {
        let newKeys = keys.slice(0)
        let index = newKeys.indexOf(key)
        if (index !== -1) {
            newKeys.splice(index, 1)
        }
        setKeys(newKeys)
    }
    return [keys, add, remove];
}

export default useKeys;