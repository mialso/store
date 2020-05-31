// TODO const { Log } = require('../ui/components/command_line.js');
import { DOCUMENT, EVENT } from './message.mjs';

export const DEBUG = 7;
export const INFO = 6;
export const NOTICE = 5;
export const WARN = 4;

export function getSpaces(getState, runnerName) {
    if (!runnerName) {
        return '';
    }
    const { runner } = getState();
    const { index } = runner.byName[runnerName];
    return Array(index * 4).fill(' ').join('');
}

export const unknownMessageLogger = ({ getState }) => ({ type, meta, payload }) => {
    if (!meta.type) {
        console.info(`${getSpaces(getState, meta.runner)}[UNKNOWN MESSAGE]: ${type}: meta: ${JSON.stringify(meta)}\n <payload>: ${JSON.stringify(payload)}`);
    }
};

export const errorLogger = ({ getState }) => (message) => {
    if (message.error) {
        const { type, payload, meta } = message;
        console.error(`${getSpaces(getState, meta.runner)}[ERROR]: ${type}:\n payload: ${JSON.stringify(payload)}\n meta: ${JSON.stringify(meta)}`);
    }
};

export const stateLogger = (state, commit, key) => {
    console.info(`[COMMIT]: <${key}>`);
    console.info(`[STATE]: ${JSON.stringify(state)}`);
};

export const commitLogger = (state, commit, key) => {
    console.info(`[COMMIT]: <${key}>`);
    console.info(`${JSON.stringify(commit)}`);
};

export const docLogger = ({ getState }) => ({ type, payload, meta }) => {
    if (meta.type === DOCUMENT) {
        const { logSeverity } = getState().env.options;
        const typeSign = (logSeverity >= INFO) ? `[DOCUMENT]{${type}}` : `[${type}]`;
        const metaInfo = ((logSeverity >= NOTICE) && meta) ? `: <meta>:${JSON.stringify(meta)}` : '';
        const payloadInfo = ((logSeverity >= DEBUG) && payload) ? `\n<payload>:${JSON.stringify(payload)}` : '';
        console.info(`${getSpaces(getState, meta.runner)}${typeSign}${metaInfo}${payloadInfo}`);
    }
};

export const eventLogger = ({ getState }) => ({ type, payload, meta }) => {
    if (meta.type === EVENT) {
        const { logSeverity } = getState().env.options;
        const metaInfo = ((logSeverity >= NOTICE) && meta) ? ` <meta>:${JSON.stringify(meta)}` : '';
        const payloadInfo = ((logSeverity >= DEBUG) && payload) ? `\n<payload>:${JSON.stringify(payload)}` : '';
        console.info(`${getSpaces(getState, meta.runner)}[${type}]${metaInfo}${payloadInfo}`);
    }
};
