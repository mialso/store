export const meta = {
    SKIP: '_SKIP',
    SUCCESS: '_SUCCESS',
    FAIL: '_FAIL',
};

export const MESSAGE = 'MESSAGE';
export const INPUT = 'INPUT';
export const EVENT = 'EVENT';
export const FATAL_ERROR = 'FATAL_ERROR';
export const COMMAND = 'COMMAND';
export const DOCUMENT = 'DOCUMENT';
export const COMMIT = 'COMMIT';

export const MessageSchema = {
    type: MESSAGE,
    payload: null,
    meta: null,
    error: false,
};

export function createMessage() {
    return Object.create(MessageSchema);
}

export function Input(data) {
    const message = createMessage();
    message.payload = data;
    message.meta = { type: INPUT };
    return message;
}

export function FatalError(description, context) {
    const message = createMessage();
    message.type = FATAL_ERROR;
    message.payload = description;
    message.error = true;
    message.meta = { ...context, type: DOCUMENT };
    return message;
}

export function printError(e, runner) {
    return FatalError({ message: e.message, stack: e.stack }, { runner });
}

export function Event(type, source, data) {
    if (!(source && typeof source === 'string')) {
        return FatalError('Event:: no source given', { data });
    }
    const message = createMessage();
    message.type = type;
    message.payload = data;
    message.meta = { type: EVENT, source };
    return message;
}

export function Document(type, data) {
    if (!data) {
        return FatalError('Document:: no data given', { data });
    }
    const message = createMessage();
    message.type = type;
    message.payload = data;
    message.meta = { type: DOCUMENT };
    return message;
}

export function Command(intent) {
    if (!(intent && typeof intent === 'string')) {
        return FatalError('Command:: no valid intent given', { intent });
    }
    const message = createMessage();
    message.type = COMMAND;
    message.meta = { intent };
    return message;
}

export function Commit(model, data) {
    const message = createMessage();
    message.type = COMMIT;
    message.payload = data;
    message.meta = { type: COMMIT, store: model };
    return message;
}

export function Skip(message) {
    return Object.assign(message, { type: message.type + meta.SKIP });
}
