# Tetris together

An implemented of tetris, where the focus is for players to play in pairs, both controlling separate board pieces and playing in the same arena/board.

Multiplayer co-op is a focus, but pvp battle(-royales) are also a possibility.

## Note on monorepo approach

This game is meant to stress test the posibilities and flexibility of `@arosaned/inversify-react`. For now the 2 different projects are in one repo, because Rush currently has an issue where certain workflows don't work correctly when using git submodules, so developing 2 separate projects can be troublesome.

Once the game is complete and has proven the library's capabilities,the 2 projects will be separated into different repositories.

## Todo list

-   [] The gameplay of tetris
-   [] Couch co-op
-   [] Online co-op
-   [] Battle royal with flexible player count
