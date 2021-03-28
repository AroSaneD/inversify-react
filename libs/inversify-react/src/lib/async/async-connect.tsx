import React from 'react';
import { Observable, combineLatest } from 'rxjs'; // remove when observables become native
// import { Buildable, convertBuildableToOrdinary } from '../common/buildable';
import { providerContext } from '../common/context';
// import { connect } from '../connect';

type Asynchronous<T> = Promise<T> | Observable<T>;

type WithAsyncableParts<T> = {
    [P in keyof T]: T[P] | Asynchronous<T>;
};

function isPromise(maybePromise: any) {
    return typeof maybePromise?.then === 'function';
}

function isObservable(maybeObs: any) {
    return maybeObs instanceof Observable;
}

function isAsynchronousObject<T>(
    elementInQuestion: T | Asynchronous<T>,
): elementInQuestion is Asynchronous<T> {
    return (
        isPromise(elementInQuestion) || isObservable(elementInQuestion)
    );
}


// Can't mutate original object, because overrides result of useMemo
function extractAsynchronousObjects<T>(buildableProps: WithAsyncableParts<T>): WithAsyncableParts<Partial<T>> {
    // If any fields in the prop container are setup functions,
    const built = Object.keys(buildableProps)
        .map((key) => {
            const maybeAsynchronous = buildableProps[key as keyof T];
            if (isAsynchronousObject(maybeAsynchronous)) {
                return [key, maybeAsynchronous] as unknown as [keyof T, Asynchronous<T[keyof T]>];
            }

            return null;
        })
        .filter(pair => pair != null)
        .reduce((acc: Partial<WithAsyncableParts<T>>, [k, b]) => {
            (acc[k] as any) = b; // either compiler or my brain can't understand so many wrapped types. Should simplify
            return acc;
        }, {});

    return { ...buildableProps, ...built } as T;
}

function convertAsyncPropsToSync<T>(asyncableProps: WithAsyncableParts<T>): T{
    // extract promises
    // extract observables

    // Promise.all (if possible with dynamic fields)
    // combineLatest (if possible with dynamic fields)

    // React.useEffect probably in combination with React.useState to join results of promises and observables
    // return joined object as T
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

        const builtProps = {...dynamicProps, ...syncProps} as PropType;


        return <WrappedComponent {...builtProps} />;
    };
};
