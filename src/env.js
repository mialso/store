const { Document } = require('./core/message');

const SET_ARGS_INPUT = 'SET_ARGS_INPUT';

const setInputArguments = ({ remoteName, skipCheck, logSeverity }) => () => Document(
    SET_ARGS_INPUT,
    { remoteName, options: { skipCheck, logSeverity } },
);

const EnvSchema = {
    command: '',
    options: {
        isDebug: true,
        isVerboseOutput: true,
        skipCheck: false,
        logSeverity: 0,
    },
};

function createEnvState() {
    return Object.create(EnvSchema);
}

function updateOptions(state, { options: newOptions }) {
    return {
        ...state,
        options: {
            ...state.options,
            ...newOptions,
        },
    };
}

function reducer(state, { type, payload }) {
    switch (type) {
        case SET_ARGS_INPUT: return updateOptions(state, payload);
        default: return state;
    }
}

module.exports = {
    createEnvState,
    envReducer: reducer,
    setInputArguments,
};
