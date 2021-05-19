import * as React from 'react';
import {
    convertAsyncPropsToSync,
    extractAsynchronousObjects,
    WithAsyncableParts,
} from './async-utils';

/**
 * New idea:
 *      HOC that transfors all non-async props into async version
 *      and handles conversion of async variables into sync inside
 *      of itself
 *
 * Example usage:
 *
 *      interface Props{
 *          a: number
 *      }
 *
 *      const TestComponent = async<Props>((props) => {
 *          return <h1>{props.a}</h1>
 *      })
 *
 *      <...>
 *
 *      <TestComponent a={Observable.interval(200)} />
 */

/**
 * Currently promises don't have a default/standart way to wrap
 * error handling inside of them. So in cases where a promise would fail,
 * the workflow currently designed by this library would break down.
 *
 * Needs more investigation on what best practises would there be to handle
 * promise errors in react, and if there'd be a way to integrate into current
 * workflow, or if there'd be a better workflow that could incorporate both
 * promises and observables.
 */

export function asynchronize<TProps>(
    BaseComponent: React.FC<TProps>
): React.FC<WithAsyncableParts<TProps>> {
    return (props: WithAsyncableParts<TProps>) => {
        const asyncPartOfProps = extractAsynchronousObjects(props);
        const convertedProps = convertAsyncPropsToSync(asyncPartOfProps);

        // Contains original non-async props, and ex-async props, that now get updated through hooks
        const builtProps = { ...props, ...convertedProps } as TProps;
        return <BaseComponent {...builtProps} />;
    };
}
