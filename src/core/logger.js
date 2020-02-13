// TODO const { Log } = require('../ui/components/command_line.js');
const { DOCUMENT, EVENT } = require('./message.js');

const DEBUG = 7;
const INFO = 6;
const NOTICE = 5;
const WARN = 4;

function getSpaces(getState, runnerName) {
    if (!runnerName) {
        return '';
    }
    const { runner } = getState();
    const { index } = runner.byName[runnerName];
    return Array(index * 4).fill(' ').join('');
}

const unknownMessageLogger = ({ getState }) => ({ type, meta, payload }) => {
    if (!meta.type) {
        console.info(`${getSpaces(getState, meta.runner)}[UNKNOWN MESSAGE]: ${type}: meta: ${JSON.stringify(meta)}\n <payload>: ${JSON.stringify(payload)}`);
    }
};

const errorLogger = ({ getState }) => (message) => {
    if (message.error) {
        const { type, payload, meta } = message;
        console.error(`${getSpaces(getState, meta.runner)}[ERROR]: ${type}:\n payload: ${JSON.stringify(payload)}\n meta: ${JSON.stringify(meta)}`);
    }
};

const stateLogger = (state, commit, key) => {
    console.info(`[COMMIT]: <${key}>`);
    console.info(`[STATE]: ${JSON.stringify(state)}`);
};

const commitLogger = (state, commit, key) => {
    console.info(`[COMMIT]: <${key}>`);
    console.info(`${JSON.stringify(commit)}`);
};

const docLogger = ({ getState }) => ({ type, payload, meta }) => {
    if (meta.type === DOCUMENT) {
        const { logSeverity } = getState().env.options;
        const typeSign = (logSeverity >= INFO) ? `[DOCUMENT]{${type}}` : `[${type}]`;
        const metaInfo = ((logSeverity >= NOTICE) && meta) ? `: <meta>:${JSON.stringify(meta)}` : '';
        const payloadInfo = ((logSeverity >= DEBUG) && payload) ? `\n<payload>:${JSON.stringify(payload)}` : '';
        console.info(`${getSpaces(getState, meta.runner)}${typeSign}${metaInfo}${payloadInfo}`);
    }
};

const eventLogger = ({ getState }) => ({ type, payload, meta }) => {
    if (meta.type === EVENT) {
        const { logSeverity } = getState().env.options;
        const metaInfo = ((logSeverity >= NOTICE) && meta) ? ` <meta>:${JSON.stringify(meta)}` : '';
        const payloadInfo = ((logSeverity >= DEBUG) && payload) ? `\n<payload>:${JSON.stringify(payload)}` : '';
        console.info(`${getSpaces(getState, meta.runner)}[${type}]${metaInfo}${payloadInfo}`);
    }
};

module.exports = {
    DEBUG,
    INFO,
    NOTICE,
    WARN,
    unknownMessageLogger,
    stateLogger,
    commitLogger,
    errorLogger,
    docLogger,
    eventLogger,
};
