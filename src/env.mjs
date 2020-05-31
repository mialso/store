import { Document } from './core/message.mjs';

const SET_ARGS_INPUT = 'SET_ARGS_INPUT';

export const setInputArguments = ({ remoteName, skipCheck, logSeverity }) => () => Document(
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

export function createEnvState() {
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

export function envReducer(state, { type, payload }) {
    switch (type) {
        case SET_ARGS_INPUT: return updateOptions(state, payload);
        default: return state;
    }
}
