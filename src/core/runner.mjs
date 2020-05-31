import { Event, printError, Document } from './message.mjs';

export const RUNNER_INIT = 'RUNNER_INIT';
export const RUNNER_NEXT = 'RUNNER_NEXT';
export const RUNNER_DONE = 'RUNNER_DONE';
export const RUNNER_ERROR_EXIT = 'RUNNER_ERROR_EXIT';
export const RUNNER_FATAL_ERROR_EXIT = 'RUNNER_FATAL_ERROR_EXIT';
const CHAIN_DONE = 'RUNNER_CHAIN_DONE';
const PIPE_DONE = 'RUNNER_PIPE_DONE';
const ALL_DONE = 'RUNNER_ALL_DONE';

const getRunnerSource = (name, index) => `<${name}>:${index}`;
/*
 * the purpose of sequence runner is
 * to invoke actions one by one until state.fatalError set
 */
export function createSeqRunner({ getState, dispatch, initAction }) {
    return function nameRunner(name = 'no name') {
        dispatch(Document(RUNNER_INIT, { name }));
        const runAction = initAction({ key: name, getState, dispatch });
        return {
            store: { getState, dispatch },
            runAction,
            run: function runActions(sequence, index = 0) {
                const { runner } = getState();
                if (runner.byName && runner.byName[name] && runner.byName[name].hasFatalError) {
                    dispatch(Event(
                        RUNNER_FATAL_ERROR_EXIT,
                        getRunnerSource(name, index),
                        `Runner [${name}] state has fatal error set: true, exit...`,
                    ));
                    return;
                }
                if (!sequence[Symbol.iterator]) {
                    dispatch(Event(
                        RUNNER_FATAL_ERROR_EXIT,
                        getRunnerSource(name, index),
                        'Given sequence has no iterator',
                    ));
                    return;
                }
                const nextAction = sequence.next();
                if (nextAction.done) {
                    dispatch(Event(RUNNER_DONE, getRunnerSource(name, index)));
                    return;
                }
                if (typeof nextAction.value !== 'function') {
                    dispatch(Event(
                        RUNNER_FATAL_ERROR_EXIT,
                        getRunnerSource(name, index),
                        `Action creator is not a function: ${typeof nextAction.value}`,
                    ));
                    return;
                }
                dispatch(Document(RUNNER_NEXT, { name }));
                runAction(nextAction.value)
                    .then(() => {
                        runActions(sequence, index + 1);
                    })
                    .catch((e) => {
                        dispatch(printError(e, name));
                    });
            },
            concurrentAll: (actions) => (next) => () => Promise.all(actions)
                .then((i) => runAction(next(i)))
                .then(() => Event(ALL_DONE, 'add here some meta')),

            chain: (...actions) => () => actions.reduce(
                (res, action) => res.then(() => runAction(action())),
                Promise.resolve(),
            ).then(() => Event(CHAIN_DONE, 'add here some meta')),

            pipe: (initialVal) => (...actions) => () => actions.reduce(
                (res, action) => res.then((data) => runAction(action(data))),
                Promise.resolve(initialVal),
            ).then(() => Event(PIPE_DONE, 'add here some meta')),
        };
    };
}
