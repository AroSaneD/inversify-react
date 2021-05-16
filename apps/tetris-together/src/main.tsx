import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/app';
import Secondary from './app/secondary';
import Ctx from './app/ctx';

ReactDOM.render(
    <React.StrictMode>
        <Ctx.Provider value={{ value: 3 }}>
            <App />
            <Secondary />
        </Ctx.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
