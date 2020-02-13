const {
    readFile,
    writeFile: writeFileFS,
    mkdir: mkdirFS,
} = require('fs');
const { exec } = require('child_process');
const { Event, meta: { SUCCESS, FAIL } } = require('./message.js');

const READ_FILE = 'READ_FILE';
const JSON_PARSE = 'JSON_PARSE';
const EXEC_SHELL = 'EXEC_SHELL';
const MK_DIR = 'MK_DIR';
const WRITE_FILE = 'WRITE_FILE';

const readFilePromise = (filePath) => () => new Promise(
    (resolve) => {
        readFile(filePath, (err, data) => {
            if (err) {
                return resolve(Event(READ_FILE + FAIL, filePath, { message: err.message }));
            }
            return resolve(Event(READ_FILE + SUCCESS, filePath, data));
        });
    },
);

const writeFile = ({ filePath, data }) => () => new Promise(
    (resolve) => {
        writeFileFS(filePath, data, (error) => {
            if (error) {
                return resolve(Event(WRITE_FILE + FAIL, filePath, { message: error.message }));
            }
            return resolve(Event(WRITE_FILE + SUCCESS, filePath, data));
        });
    },
);

const execShell = ({ cwd, cmdString }) => () => new Promise(
    (resolve) => {
        exec(cmdString, { cwd }, (error, stdout, stderr) => {
            if (error) {
                return resolve(Event(
                    EXEC_SHELL + FAIL,
                    cmdString,
                    { error, stderr: stderr.toString() },
                ));
            }
            return resolve(Event(EXEC_SHELL + SUCCESS, cmdString));
        });
    },
);

const mkDir = (dir) => () => new Promise((resolve) => mkdirFS(
    dir,
    { recursive: true },
    (error) => {
        if (error) {
            return resolve(Event(MK_DIR, dir, { error }));
        }
        return resolve(Event(MK_DIR, dir));
    },
));

const parseJsonFromPayload = ({ payload, type }) => () => new Promise(
    (resolve) => {
        try {
            const jsonData = JSON.parse(payload);
            resolve(Event(JSON_PARSE + SUCCESS, type, jsonData));
        } catch (e) {
            resolve(Event(JSON_PARSE + FAIL, type, e.message));
        }
    },
);


module.exports = {
    readFilePromise,
    writeFile,
    parseJsonFromPayload,
    execShell,
    mkDir,
};
