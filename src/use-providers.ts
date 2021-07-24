import * as React from 'react';
import { providerContext } from './common/context';

declare type Constructor<T> = Function & { prototype: T }; // new (...args: any[]) => T;

/**
 * 
 * @param key The class or "key" for the registered object or data in the Container object (from current context)
 * @param builder? An optional callback function that would be used to get some data from the provider returned for the given key. This builder is called inside of a hook, so hooks cannot be passed in.
 * 
 * @returns Returns either the provider or the result of the builder function. Currently the result is memo'd and will not be updated. Recommended for global data or objects that have their own renewal system (e.g. Promises or Observables)
 */
export function useProvider<TC>(key: Constructor<TC>): TC;
export function useProvider<TC, TR>(key: Constructor<TC>, builder: (p: TC) => TR): TR;
export function useProvider<TC, TR>(key: Constructor<TC>, builder?: (p: TC) => TR): TC | TR {
    const context = React.useContext(providerContext);

    const result = React.useMemo(() => {
        const provider = context.get(key);
        return builder == null ? provider : builder(provider);
    }, []);

    return result;
}

// todo: key types should match returned object types?
export function useProviders<T>(providerKeys: any[]): T {
    const context = React.useContext(providerContext);
    const providers = React.useMemo(() => providerKeys.map(p => context.get(p)) as any, []);
    return providers;
}
