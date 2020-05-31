const listeners = { all: [] };

const ErrMessage = (message) => `[ERROR]: messageBus: ${message}`;

function addUniqueItem(array, item) {
    if (array.includes(item)) {
        return;
    }
    array.push(item);
}

function validateListener(listener, metaType) {
    if (!(metaType && typeof metaType === 'string')) {
        throw new Error(ErrMessage(`invalid metatype: ${typeof metaType}`));
    }

    if (typeof listener !== 'function') {
        throw new Error(ErrMessage(`invalid listener: ${typeof listener}`));
    }
}

export function subscribe(listener, metaType = 'all') {
    validateListener(listener, metaType);
    if (!listeners[metaType]) {
        listeners[metaType] = [];
    }
    addUniqueItem(listeners[metaType], listener);
}

export function dispatch(message) {
    const { meta } = message;
    if (meta.type && listeners[meta.type]) {
    // run specific listeners first
        listeners[meta.type].forEach((listener) => listener(message));
    }
    listeners.all.forEach((listener) => listener(message));
}
