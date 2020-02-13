const { SKIP } = require('../actions/meta.js');

const MESSAGE = 'MESSAGE';
const INPUT = 'INPUT';
const EVENT = 'EVENT';
const FATAL_ERROR = 'FATAL_ERROR';
const COMMAND = 'COMMAND';
const DOCUMENT = 'DOCUMENT';
const COMMIT = 'COMMIT';

const MessageSchema = {
    type: MESSAGE,
    payload: null,
    meta: null,
    error: false,
};

function createMessage() {
    return Object.create(MessageSchema);
}

function Input(data) {
    const message = createMessage();
    message.payload = data;
    message.meta = { type: INPUT };
    return message;
}

function FatalError(description, context) {
    const message = createMessage();
    message.type = FATAL_ERROR;
    message.payload = description;
    message.error = true;
    message.meta = { ...context, type: DOCUMENT };
    return message;
}

function printError(e, runner) {
    return FatalError({ message: e.message, stack: e.stack }, { runner });
}

function Event(type, source, data) {
    if (!(source && typeof source === 'string')) {
        return FatalError('Event:: no source given', { data });
    }
    const message = createMessage();
    message.type = type;
    message.payload = data;
    message.meta = { type: EVENT, source };
    return message;
}

function Document(type, data) {
    if (!data) {
        return FatalError('Document:: no data given', { data });
    }
    const message = createMessage();
    message.type = type;
    message.payload = data;
    message.meta = { type: DOCUMENT };
    return message;
}

function Command(intent) {
    if (!(intent && typeof intent === 'string')) {
        return FatalError('Command:: no valid intent given', { intent });
    }
    const message = createMessage();
    message.type = COMMAND;
    message.meta = { intent };
    return message;
}

function Commit(model, data) {
    const message = createMessage();
    message.type = COMMIT;
    message.payload = data;
    message.meta = { type: COMMIT, store: model };
    return message;
}

function Skip(message) {
    return Object.assign(message, { type: message.type + SKIP });
}

module.exports = {
    FatalError,
    Input,
    Event,
    Command,
    Document,
    Commit,
    Skip,
    INPUT,
    EVENT,
    COMMAND,
    DOCUMENT,
    COMMIT,
    FATAL_ERROR,
    printError,
};
