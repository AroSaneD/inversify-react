import * as React from 'react';

import GameDisplay from './display';

// Exporting as a function (not lambda) because react fast refresh behaves
//      awkwardly otherwise. Just the roop component beeing a function is
//      enough to fix noticeable issues.
export function App() {
    // todo: create game logic instance

    return (
        // todo: pass in game logic instance to be rendered
        <GameDisplay />
    );
}

export default App;
