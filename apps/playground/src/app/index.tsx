// import { Container } from 'inversify';
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { providerContext, connect } from '../src';

// // #region dependencies
// class TestClass1 {
//     public a: number;
//     constructor() {
//         this.a = 5;
//     }
// }

// class TestClass2 {
//     constructor(private dep: TestClass1) {}

//     getA() {
//         return this.dep.a;
//     }
// }

// class TestClass3 {
//     private b = 10;
//     constructor() {}

//     getB() {
//         return this.b;
//     }
// }
// // #endregion

// // #region container setup

// const container = new Container();

// container.bind(TestClass1).toDynamicValue((_) => new TestClass1());
// container
//     .bind(TestClass2)
//     .toDynamicValue((ctx) => new TestClass2(ctx.container.get(TestClass1)));
// container.bind(TestClass3).toDynamicValue((_) => new TestClass3());

// // #endregion

// const TestComponent: React.FC<{ a: number; b: number; c: number }> = ({
//     a,
//     b,
//     c,
// }) => {
//     return <h1>Test: {a + b + c}</h1>;
// };

// const ComponentWithProviders = connect<{ a: number; b: number }, { c: number }>(
//     TestComponent,
//     (addedProps: { c: number }, dep1: TestClass2, dep2: TestClass3) => ({
//         a: dep1.getA(),
//         b: dep2.getB(),
//         c: addedProps.c,
//     }),
//     [TestClass2, TestClass3]
// );

// const element = document.getElementById('test');
// ReactDOM.render(
//     <providerContext.Provider value={container}>
//         <ComponentWithProviders c={3} />
//     </providerContext.Provider>,
//     element
// );
