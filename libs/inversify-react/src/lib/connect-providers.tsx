import * as React from 'react';
import { providerContext } from './context';
import { isSetupFunction } from './prop-setup';

export type Buildable<T> = {
    [P in keyof T]: T[P] | (() => T[P]);
};

// Can't mutate original object, because overrides result of useMemo
function convertBuildableToOrdinary<T>(buildableProps: Buildable<T>): T {
    // If any fields in the prop container are setup functions,
    const built = Object.keys(buildableProps)
        .map((k) => {
            const maybeFunction = buildableProps[k as keyof T];
            if (isSetupFunction(maybeFunction)) {
                return [k, maybeFunction()] as [keyof T, T[keyof T]];
            }

            return null;
        })
        .filter(pair => pair != null)
        .reduce((acc: Partial<T>, [k, b]) => {
            acc[k] = b;
            return acc;
        }, {});

    return { ...buildableProps, ...built } as T;
}

// todo: add type/function override to support syntax with now required props
export const connect = <PropType, RequiredPropTypes>(
    WrappedComponent: React.FC<PropType | RequiredPropTypes>,
    propGetter: (props: RequiredPropTypes, ...providers: any) => Buildable<PropType>,
    dependencies: any[],
): React.FC<RequiredPropTypes> => {
    return (props: RequiredPropTypes) => {
        const container = React.useContext(providerContext);
        const dynamicProps = React.useMemo(() => {
            const providers = dependencies.map((d) => container.get(d));
            const result = propGetter(props, ...providers);

            return result;
        }, []);

        // Convert buildable prop fields outside of any React.use... functions
        const builtProps = convertBuildableToOrdinary(dynamicProps);

        return <WrappedComponent {...builtProps} />;
    };
};
