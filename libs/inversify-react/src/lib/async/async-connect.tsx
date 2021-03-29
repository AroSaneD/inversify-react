import React from 'react';
import { Observable, combineLatest } from 'rxjs'; // remove when observables become native
// import { Buildable, convertBuildableToOrdinary } from '../common/buildable';
import { providerContext } from '../common/context';
// import { connect } from '../connect';

/**
 * Currently promises don't have a default/standart way to wrap
 * error handling inside of them. So in cases where a promise would fail, 
 * the workflow currently designed by this library would break down. 
 *
 * Needs more investigation on what best practises would there be to handle
 * promise errors in react, and if there'd be a way to integrate into current 
 * workflow, or if there'd be a better workflow that could incorporate both
 * promises and observables.
 */

type Asynchronous<T> = /*Promise<T> |*/ Observable<T>;

type WithAsyncableParts<T> = {
    [P in keyof T]: T[P] | Asynchronous<T>;
};

// function isPromise(maybePromise: any) {
//     return typeof maybePromise?.then === 'function';
// }

function isObservable(maybeObs: any) {
    return maybeObs instanceof Observable;
}

function isAsynchronousObject<T>(
    elementInQuestion: T | Asynchronous<T>,
): boolean {
    return isObservable(elementInQuestion);
}


// Can't mutate original object, because overrides result of useMemo
function extractAsynchronousObjects<T>(buildableProps: WithAsyncableParts<T>): WithAsyncableParts<Partial<T>> {
    // If any fields in the prop container are setup functions,
    const built = Object.keys(buildableProps)
        .map((key) => {
            const maybeAsynchronous = buildableProps[key as keyof T];
            if (isAsynchronousObject(maybeAsynchronous)) {
                return [key, maybeAsynchronous] as [keyof T, T[keyof T]];
            }

            return null;
        })
        .filter(pair => pair != null)
        .reduce((acc: Partial<WithAsyncableParts<T>>, [k, b]) => {
            acc[k] = b;
            return acc;
        }, {});

    return { ...built }; // Returns an object containing only async fields
}

function convertAsyncPropsToSync<T>(asyncableProps: WithAsyncableParts<T>): T {
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
    }, []);

    return values;
}

// can requiredPropTypes be async objects as well?
export function connectAsync<RequiredPropTypes, PropType>(
    WrappedComponent: React.FC<PropType>, // PropType is normal fields

    // result of propGetter must have same fields as PropType, but fields can be promises or observables
    // no support for Buildable (at least for now) because observables should be enough for the purposes of this library
    propGetter: (props: RequiredPropTypes, ...providers: any) => WithAsyncableParts<PropType>,
    dependencies: any[],
): React.FC<RequiredPropTypes> {
    return (props: RequiredPropTypes) => {
        const container = React.useContext(providerContext);
        const dynamicProps = React.useMemo(() => {
            const providers = dependencies.map((d) => container.get(d));
            const result = propGetter(props, ...providers);

            return result;
        }, []);

        // Convert buildable prop fields outside of any React.use... functions
        // const builtProps = convertBuildableToOrdinary(dynamicProps);
        const asyncProps = extractAsynchronousObjects(dynamicProps);
        const syncProps = convertAsyncPropsToSync(asyncProps);

        const builtProps = { ...dynamicProps, ...syncProps } as PropType;


        return <WrappedComponent {...builtProps} />;
    };
};
