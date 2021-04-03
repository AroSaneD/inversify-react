/**
 * New idea:
 *      HOC that transfors all non-async props into async version
 *      and handles conversion of async variables into sync inside
 *      of itself
 *
 * E.g.:
 *
 * interface Props{
 *      a: number
 * }
 *
 * const TestComponent = async<Props>((props) => {
 *      return <h1>{props.a}</h1>
 * })
 *
 * <...>
 *
 * <TestComponent a={Observable.interval(200)} />
 */
