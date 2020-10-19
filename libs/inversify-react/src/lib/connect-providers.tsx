import * as React from 'react';
import { isFunction } from 'util';
import { providerContext } from './context';
import { isSetupFunction } from './prop-setup';

export const connect = <PropType, RequiredPropTypes>(
    WrappedComponent: React.FC<PropType | RequiredPropTypes>,
    propGetter: (...providers: any) => PropType,
    dependencies: any[],
): React.FC<RequiredPropTypes> => {
    return (props: RequiredPropTypes) => {
        const container = React.useContext(providerContext);
        const dynamicProps = React.useMemo(() => {
            const providers = dependencies.map((d) => container.get(d));
            const result = propGetter(...[props, ...providers]);

            return result;
        }, []);

        // If any fields in the prop container are setup functions,
        // call them here (outside of any React.use... functions)
        for (const key in dynamicProps) {
            if (Object.prototype.hasOwnProperty.call(dynamicProps, key)) {
                const element = dynamicProps[key];

                if (isSetupFunction(element)) {
                    dynamicProps[key] = element();
                }
            }
        }

        return <WrappedComponent {...dynamicProps} />;
    };
};
