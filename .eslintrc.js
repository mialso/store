module.exports = {
    extends: ['airbnb-base'],
    rules: {
        "indent": ["error",4, { "SwitchCase": 1 }],
        "array-bracket-spacing": ["error", "always"],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    },
};
