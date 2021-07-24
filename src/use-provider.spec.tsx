// todo: add a setup file and move these 2 imports inside of it
import '@testing-library/jest-dom';
import React from 'react';

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Container } from 'inversify';
import { useProvider } from './use-providers';
import { providerContext } from './common/context';

class ProviderClass {
    getTestString() {
        return 'test string';
    }
}

describe('useProvider', () => {
    test('Should get registered provider', () => {
        const container = new Container();
        container.bind(ProviderClass).toConstantValue(new ProviderClass());

        const ProviderComponent = () => {
            const provider = useProvider(ProviderClass);
            return <div>{provider.getTestString()}</div>;
        };

        render(
            <providerContext.Provider value={container}>
                <ProviderComponent />
            </providerContext.Provider>
        );

        expect(screen.getByText('test string')).not.toBeNull();
    });

    test('Should get provider builder result', () => {
        const container = new Container();
        container.bind(ProviderClass).toConstantValue(new ProviderClass());

        const ProviderComponent = () => {
            const res = useProvider(ProviderClass, x => x.getTestString());
            return <div>{res}</div>;
        };

        render(
            <providerContext.Provider value={container}>
                <ProviderComponent />
            </providerContext.Provider>
        );

        expect(screen.getByText('test string')).not.toBeNull();
    });
});
