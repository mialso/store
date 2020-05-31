import { DOCUMENT } from './message.mjs';

const globState = {};
const listeners = [];
const commits = {};

export function subscribe(listener) {
    listeners.push(listener);
}

export function getState() {
    return globState;
}

export function logCommits(key) {
    console.info('[COMMITS]: <%s>: %s', key, commits[key].length);
    commits[key].forEach((commit, index) => console.info(`[${index}]: ${JSON.stringify(commit)}`));
}

export function getCommits(key) {
    return commits[key].slice();
}

export function applyCommit(key, commit) {
    globState[key] = { ...globState[key], ...commit };
    commits[key].push(commit);
    listeners.forEach((listener) => listener(globState, commit, key));
}

export function cleanUp(key) {
    delete globState[key];
}

export function initStore(key, initialState) {
    globState[key] = initialState;
    commits[key] = [];
}

export const model = (reducer, { key, initialState }) => {
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
