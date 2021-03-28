import { Container } from 'inversify';
import * as React from 'react';
import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';
import {
    providerContext,
    connect,
    buildPropWithSetup,
} from '@arosaned/inversify-react';

// #region dependencies
class TestClass1 {
    public a: number;
    constructor() {
        this.a = 5;
    }
}

class TestClass2 {
    constructor(private dep: TestClass1) {}

    getA() {
        return this.dep.a;
    }
}

class TestClass3 {
    private b = 10;
    constructor() {}

    getB() {
        return this.b;
    }
}

class TestClass4 {
    constructor() {}

    getMutatableD() {
        return interval(200).pipe(
            map((i) => i * 2),
            take(5),
        );
    }
}
// #endregion

// #region container setup

const container = new Container();

container.bind(TestClass1).toDynamicValue((_) => new TestClass1());
container
    .bind(TestClass2)
    .toDynamicValue((ctx) => new TestClass2(ctx.container.get(TestClass1)));
container.bind(TestClass3).toDynamicValue((_) => new TestClass3());
container.bind(TestClass4).toDynamicValue((_) => new TestClass4());

// #endregion
interface TestComponentProps {
    a: number;
    b: number;
    c: number;
    d: number;
}

const TestComponent: React.FC<TestComponentProps> = ({ a, b, c, d }) => {
    return <h1>Test: {a + b + c + d}</h1>;
};

const ComponentWithProviders = connect(
    TestComponent,
    (
        requiredParams: {c: number},
        dep1: TestClass2,
        dep2: TestClass3,
        dep3: TestClass4,
    ) => ({
        a: dep1.getA(),
        b: dep2.getB(),
        c: requiredParams.c,
        d: buildPropWithSetup(() => {
            const [v, setV] = React.useState<number>(0);
            React.useEffect(() => {
                const subscription = dep3.getMutatableD().subscribe(setV);
                return () => {
                    console.log('unsubscribing');
                    subscription.unsubscribe();
                };
            }, []);

            return v;
        }),
    }),
    [TestClass2, TestClass3, TestClass4],
);

// const element = document.getElementById('test');
// ReactDOM.render(

// );
const testApp = () => (
    <providerContext.Provider value={container}>
        <ComponentWithProviders c={5} />
    </providerContext.Provider>
);

export default testApp;
