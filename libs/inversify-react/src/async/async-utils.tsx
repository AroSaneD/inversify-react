import React from 'react';
import { Observable, combineLatest } from 'rxjs'; // remove when observables become native

type Asynchronous<T> = /*Promise<T> |*/ Observable<T>;

export type WithAsyncableParts<T> = {
    [P in keyof T]: T[P] | Asynchronous<T[P]>;
};

// function isPromise(maybePromise: any) {
//     return typeof maybePromise?.then === 'function';
// }

function isObservable(maybeObs: any) {
    return maybeObs instanceof Observable;
}

function isAsynchronousObject<T>(elementInQuestion: T | Asynchronous<T>): boolean {
    return isObservable(elementInQuestion);
}

// Can't mutate original object, because overrides result of useMemo
export function extractAsynchronousObjects<T>(
    buildableProps: WithAsyncableParts<T>
): WithAsyncableParts<Partial<T>> {
    // If any fields in the prop container are setup functions,
    const built = Object.keys(buildableProps)
        .map(key => key as keyof T) // So `key` would be interpreted as type `keyof T`
        .filter(key => isAsynchronousObject(buildableProps[key]))
        .map(key => [key, buildableProps[key]] as [keyof T, T[keyof T]])
        .reduce((acc: Partial<WithAsyncableParts<T>>, [k, v]) => {
            acc[k] = v;
            return acc;
        }, {});

    return { ...built }; // Returns an object containing only async fields
}

export function convertAsyncPropsToSync<T>(asyncableProps: WithAsyncableParts<T>): T {
    // extract promises
    // const promiseFields = Object.keys(asyncableProps)
    //     .map(key => {
    //         const eInQ = asyncableProps[key as keyof T];
    //         if(isPromise(eInQ)) return [key, eInQ];
    //         return null;
    //     })
    //     .filter(a => a) as [string, Promise<any>][];
    // Promise.all (if possible with dynamic fields)

    // extract observables
    const observableFields = Object.keys(asyncableProps)
        .map(key => {
            const eInQ = asyncableProps[key as keyof T];
            if (isObservable(eInQ)) return [key, eInQ] as [string, Observable<any>];
            return null;
        })
        .filter(a => a);

    const [values, setValues] = React.useState<T>(null);

    // combineLatest (if possible with dynamic fields)
    // React.useEffect probably in combination with React.useState to join results of observables (and maybe promises)
    React.useEffect(() => {
        const joinedObs = combineLatest([...observableFields.map(([k, v]) => v)]);
        joinedObs.subscribe(joinedValues => {
            const props = joinedValues.reduce((acc, v, i) => {
                const [key] = observableFields[i];
                acc[key] = v;
                return acc;
            }, {});

            setValues(props);
        });

        // todo: error handling?
    }, []);

    // If receives null/empty object, initial props won't be overwritten
    // resulting in component receiving an observable where a number was expected.

    // Receiving null is a lesser evil, but would be great to
    // get a default value from observables...
    const initialValue = observableFields.reduce((acc, [key]) => {
        acc[key as keyof T] = null;
        return acc;
    }, {} as T);

    return values || initialValue;
}
