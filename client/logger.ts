// Logger implementation for client module
import { LoggerLevel, Logger } from './typings.ts';

export const defaultLogger: Logger = {
    error: (...msg: any[]) => {
        console.log('[error]:', ...msg);
    },
    warn: (...msg: any[]) => {
        console.warn('[warn]:', ...msg);
    },
    info: (...msg: any[]) => {
        console.info('[info]:', ...msg);
    },
    debug: (...msg: any[]) => {
        console.debug('[debug]:', ...msg);
    },
    trace: (...msg: any[]) => {
        console.trace('[trace]:', ...msg);
    },
};

export class LoggerProxy {
    private level: LoggerLevel;
    private logger: Logger;

    constructor(level: LoggerLevel, logger: Logger) {
        this.level = level;
        this.logger = logger;
    }

    error(...msg: any[]) {
        if (this.level >= LoggerLevel.error) {
            this.logger.error(msg);
        }
    }

    warn(...msg: any[]) {
        if (this.level >= LoggerLevel.warn) {
            this.logger.warn(msg);
        }
    }

    info(...msg: any[]) {
        if (this.level >= LoggerLevel.info) {
            this.logger.info(msg);
        }
    }

    debug(...msg: any[]) {
        if (this.level >= LoggerLevel.debug) {
            this.logger.debug(msg);
        }
    }

    trace(...msg: any[]) {
        if (this.level >= LoggerLevel.trace) {
            this.logger.trace(msg);
        }
    }
}