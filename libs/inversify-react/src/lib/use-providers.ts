import * as React from 'react';
import { providerContext } from './context';

// todo: key types should match returned object types?
export function useProviders<T>(providerKeys: any[]): T {
    const context = React.useContext(providerContext);
    return providerKeys.map((p) => context.get(p)) as any;
}
