import {useRef} from 'react';

/** 
 * Hook to generate a sequence. 
 * @param {*} initialNext Valor inicial siguiente.
 * */
const useSequence = (initialNext) => {
    let nextRef = useRef(initialNext);
    return () => nextRef.current++;
}

export default useSequence;