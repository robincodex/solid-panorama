import { console as Console } from './utils/console';

declare global {
    var console: typeof Console;
}

(function () {
    globalThis.console = Console;
})();
