const { printError } = require('./message.js');

// resolves action to result message and dispatches the message to the store
const initAction = ({ key, getState, dispatch }) => (next) => {
    let message;
    try {
        message = next({ getState });
    } catch (e) {
        message = printError(e, key);
    }
    return Promise.resolve(message)
        .then((data) => {
            dispatch({ ...data, meta: { ...data.meta, runner: key } });
            return data;
        })
        .catch((e) => {
            const errorMessage = printError(e, key);
            dispatch(errorMessage);
            return errorMessage;
        });
};

module.exports = {
    initAction,
};
