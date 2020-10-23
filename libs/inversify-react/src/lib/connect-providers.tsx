import * as React from 'react';
import { providerContext } from './context';
import { isSetupFunction } from './prop-setup';

export type Buildable<T> = {
    [P in keyof T]: T[P] | (() => T[P]);
};

function convertBuildableToOrdinary<T>(buildableProps: Buildable<T>): T {
    // If any fields in the prop container are setup functions,
    // call them here (outside of any React.use... functions)
    for (const key in buildableProps) {
        if (Object.prototype.hasOwnProperty.call(buildableProps, key)) {
            const element = buildableProps[key];

            if (isSetupFunction(element)) {
                buildableProps[key] = element();
            }
        }
    }

    return buildableProps as T;
}

export const connect = <PropType, RequiredPropTypes>(
    WrappedComponent: React.FC<PropType | RequiredPropTypes>,
    propGetter: (...providers: any) => Buildable<PropType>,
    dependencies: any[],
): React.FC<RequiredPropTypes> => {
    return (props: RequiredPropTypes) => {
        const container = React.useContext(providerContext);
        const dynamicProps = React.useMemo(() => {
            const providers = dependencies.map((d) => container.get(d));
            const result = propGetter(...[props, ...providers]);

            return result;
        }, []);

        const builtProps = convertBuildableToOrdinary(dynamicProps);

        return <WrappedComponent {...builtProps} />;
    };
};
