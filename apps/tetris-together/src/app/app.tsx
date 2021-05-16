import * as React from 'react';
import { NestedWithState } from './nested';

export const App: React.FC = () => {
    const [val, setVal] = React.useState(0);

    return (
        <div>
            <NestedWithState /> current value: {val}
            <br />
            <button onClick={() => setVal(val + 1)}>Inc value</button>
        </div>
    );
};

export default App;
