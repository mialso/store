const { RUNNER_INIT, RUNNER_NEXT } = require('./core/runner.js');
const { FATAL_ERROR } = require('./core/message.js');

const RunnerSchema = {
    name: '',
    index: 0,
    hasFatalError: false,
};

const RunnerStateSchema = {
    names: [],
    byName: {},
};

function createRunnerState() {
    return Object.create(RunnerStateSchema);
}

function createRunner(name) {
    return Object.assign(
        Object.create(RunnerSchema),
        { name, index: 0 },
    );
}

function incrementRunnerIndex(state, { name }) {
    return {
        byName: {
            ...state.byName,
            [name]: { name, index: state.byName[name].index + 1 },
        },
    };
}

function addNewRunner(state, { name }) {
    return {
        names: state.names.concat(name),
        byName: {
            ...state.byName,
            [name]: createRunner(name),
        },
    };
}

function setFatalError(state, { runner: name }) {
    return {
        byName: {
            ...state.byName,
            [name]: { ...state.byName[name], hasFatalError: true },
        },
    };
}

function reducer(state, { type, payload, meta }) {
    switch (type) {
        case RUNNER_INIT: return addNewRunner(state, payload);
        case RUNNER_NEXT: return incrementRunnerIndex(state, payload);
        case FATAL_ERROR: return setFatalError(state, meta);
        default: return state;
    }
}

module.exports = {
    createRunnerState,
    runnerReducer: reducer,
};
