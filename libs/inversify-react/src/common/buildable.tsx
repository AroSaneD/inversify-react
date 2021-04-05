import { isSetupFunction } from './prop-setup';

export type Buildable<T> = {
    [P in keyof T]: T[P] | (() => T[P]);
};

// Can't mutate original object, because overrides result of useMemo
export function convertBuildableToOrdinary<T>(buildableProps: Buildable<T>): T {
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
