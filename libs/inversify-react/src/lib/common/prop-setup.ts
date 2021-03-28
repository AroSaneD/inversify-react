const setupSymbol = Symbol('PropSetup');

function isFunction(e: any){
    return typeof e === 'function';
}

// todo: setup arguments?
export function buildPropWithSetup<T>(propSetup: () => T): () => T {
    // todo: reinvestigate is this symbol accessing is actually needed, 
    // or something more maneagable can be implemented
    const markedFunction: any = () => {
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
