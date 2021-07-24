module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testRunner: "jasmine2",
};

// module.exports = {
//   displayName: 'inversify-react',
//   preset: '../../jest.preset.js',
//   transform: {
//     '^.+\\.[tj]sx?$': [
//       'babel-jest',
//       { cwd: __dirname, configFile: './babel-jest.config.json' },
//     ],
//   },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
//   coverageDirectory: '../../coverage/libs/inversify-react',
// };
