import {useRef} from 'react';

/** 
 * Hook para generar una secuencia 
 * @param {*} initialNext Valor inicial siguiente.
 * */
const useSequence = (initialNext) => {
    let nextRef = useRef(initialNext);
    return () => nextRef.current++;
}

export default useSequence;