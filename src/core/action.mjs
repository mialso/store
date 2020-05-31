import { printError } from './message.mjs';

// resolves action to result message and dispatches the message to the store
export const initAction = ({ key, getState, dispatch }) => (next) => {
    let message;
    try {
        message = next({ getState });
    } catch (e) {
        message = printError(e, key);
    }
    return Promise.resolve(message)
        .then((data) => {
            if (!data) {
                throw new Error(`No message, [HINT]: check the return message for actions in: ${key}`)
            }
            if (!data.meta || !data.type) {
                throw new Error(`Unable to parse message, [HINT]: check the return message for actions in: ${key}`)
            }
            dispatch({ ...data, meta: { ...data.meta, runner: key } });
            return data;
        })
        .catch((e) => {
            const errorMessage = printError(e, key);
            dispatch(errorMessage);
            return errorMessage;
        });
};
