import * as React from 'react';
import { providerContext } from './context';

// todo: some matcher when to rerender?
export const connect = <PropType, RequiredPropTypes>(
    WrappedComponent: React.FC<PropType | RequiredPropTypes>,
    propGetter: (...providers: any) => PropType,
    dependencies: any[]
): React.FC<RequiredPropTypes> => {
    return (props: RequiredPropTypes) => {
        const container = React.useContext(providerContext);
        const dynamicProps = React.useMemo(() => {
            const providers = dependencies.map((d) => container.get(d));
            const result = propGetter(...[props, ...providers]);

            return result;
        }, []);

        return <WrappedComponent {...dynamicProps} />;
    };
};
