import * as React from 'react';
export declare type Buildable<T> = {
    [P in keyof T]: T[P] | (() => T[P]);
};
export declare const connect: <PropType, RequiredPropTypes>(WrappedComponent: React.FC<PropType | RequiredPropTypes>, propGetter: (props: RequiredPropTypes, ...providers: any) => Buildable<PropType>, dependencies: any[]) => React.FC<RequiredPropTypes>;
