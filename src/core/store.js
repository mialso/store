const { DOCUMENT } = require('./message.js');

const globState = {};
const listeners = [];
const commits = {};

function subscribe(listener) {
    listeners.push(listener);
}

function getState() {
    return globState;
}

function logCommits(key) {
    console.info('[COMMITS]: <%s>: %s', key, commits[key].length);
    commits[key].forEach((commit, index) => console.info(`[${index}]: ${JSON.stringify(commit)}`));
}

function getCommits(key) {
    return commits[key].slice();
}

function applyCommit(key, commit) {
    globState[key] = { ...globState[key], ...commit };
    commits[key].push(commit);
    listeners.forEach((listener) => listener(globState, commit, key));
}

function cleanUp(key) {
    delete globState[key];
}

function initStore(key, initialState) {
    globState[key] = initialState;
    commits[key] = [];
}

const model = (reducer, { key, initialState }) => {
    if (!(key && initialState)) {
        throw new Error('[STORE]: model(): wrong init arguments given, exit...');
    }
    initStore(key, initialState);
    return (message) => {
        if (message.meta.type !== DOCUMENT) {
            return;
        }
        const stateCommit = reducer(globState[key], message);
        if (stateCommit === globState[key]) {
            return;
        }
        applyCommit(key, stateCommit);
    };
};

module.exports = {
    model,
    subscribe,
    logCommits,
    applyCommit,
    cleanUp,
    getCommits,
    initStore,
    getState,
};
