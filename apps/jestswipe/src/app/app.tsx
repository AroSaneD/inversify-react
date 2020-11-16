import "reflect-metadata";
import React from 'react';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';

import {
    providerContext,
    connect,
    buildPropWithSetup,
} from '@arosaned/inversify-react';

import { registerDependencies } from './register';
import Client from './client';
import Server from './server';

const StyledApp = styled.div``;

export const App = () => {
    /*
     * Replace the elements below with your own.
     *
     * Note: The corresponding styles are in the ./app.styled-components file.
     */
    const container = React.useMemo(() => registerDependencies(), []);

    const clientContainer = container.createChild();
    const serviceContainer = container.createChild();

    clientContainer.bind("isServer").toConstantValue(false);
    serviceContainer.bind("isServer").toConstantValue(true);

    return (
        <StyledApp>


            {/* START: routes */}
            {/* These routes and navigation have been generated for you */}
            {/* Feel free to move and update them to fit your needs */}
            <br />
            <hr />
            <br />
            <Route
                path="/"
                exact
                render={() => (
                    <div>
                        This is the generated root route.{' '}
                        <ul>
                            <li>
                                <Link to="/client">Click here for client.</Link>
                            </li>
                            <li>
                                <Link to="/server">Click here for server.</Link>
                            </li>
                        </ul>


                    </div>
                )}
            />
            <Route
                path="/client"
                exact
                render={() =>
                    <providerContext.Provider value={clientContainer}>
                        <Client />
                    </providerContext.Provider>}
            />
            <Route
                path="/server"
                exact
                render={() =>
                    <providerContext.Provider value={serviceContainer}>
                        <Server />
                    </providerContext.Provider>}
            />
            {/* END: routes */}
        </StyledApp>
    );
};

export default App;
