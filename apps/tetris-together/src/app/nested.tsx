import * as React from 'react';

import { Nested } from './nested2';
import ctx from './ctx';

export const NestedWithState: React.FC = () => {
    const { value } = React.useContext(ctx);
    return <Nested val={value} />;
};
