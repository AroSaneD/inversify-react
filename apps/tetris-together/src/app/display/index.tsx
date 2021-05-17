import styled from 'styled-components';

import { ColorPallete } from './color-pallete';

import Arena from './arena';
import Score from './score';
import FutureView from './future-view';

const GameLayout = styled.div`
    .arena {
        grid-area: arena;
    }
    .score {
        grid-area: score;
    }
    .future-view {
        grid-area: future-view;
    }
    .arena,
    .score,
    .future-view {
        border: 4px solid ${ColorPallete.darkBlue};
        border-radius: 8px;
    }

    /* Height/width should be calculated by screen size and proportions */
    /* todo: Mockup views with oponents to gauge how it will look*/
    /* todo: current game layout should be reusable for spectator mode */
    height: 800px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 600px 200px;
    grid-template-rows: repeat(8, 1fr);
    grid-template-areas:
        'arena future-view'
        'arena future-view'
        'arena future-view'
        'arena future-view'
        'arena score'
        'arena .'
        'arena .'
        'arena .';
    color: ${ColorPallete.purpleHaze};
`;

export default () => {
    return (
        <GameLayout>
            <div className="arena">
                <Arena />
            </div>
            <div className="score">
                <Score />
            </div>
            <div className="future-view">
                <FutureView />
            </div>
        </GameLayout>
    );
};
