import React from 'react';
import { Buildable, convertBuildableToOrdinary } from './common/buildable';
import { providerContext } from './common/context';

// todo: add type/function override to support syntax with now required props
export function connect<RequiredPropTypes, PropType>(
    WrappedComponent: React.FC<PropType>,
    propGetter: (props: RequiredPropTypes, ...providers: any) => Buildable<PropType>,
    dependencies: any[]
): React.FC<RequiredPropTypes> {
    return (props: RequiredPropTypes) => {
        const container = React.useContext(providerContext);
        const dynamicProps = React.useMemo(() => {
            const providers = dependencies.map(d => container.get(d));
            const result = propGetter(props, ...providers);

            return result;
        }, []);

        // Convert buildable prop fields outside of any React.use... functions
        const builtProps = convertBuildableToOrdinary(dynamicProps);

        return <WrappedComponent {...builtProps} />;
    };
}
