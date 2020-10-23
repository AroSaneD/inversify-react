import { isFunction } from 'util';

const setupSymbol = Symbol('PropSetup');

// todo: setup arguments?
export function buildPropWithSetup<T>(propSetup: () => T) {
    const markedFunction = () => {
        return propSetup();
    };

    markedFunction[setupSymbol] = true;

    return markedFunction;
}

export function isSetupFunction(
    elementInQuestion: any | Function,
): elementInQuestion is Function {
    return (
        isFunction(elementInQuestion) && elementInQuestion[setupSymbol] === true
    );
}
