"use strict";

import { EventEmitter } from "events";

export class AsyncEventEmitter extends EventEmitter {
    /**
     * Synchronously calls each of the listeners registered for the event named eventName,
     * in the order they were registered, passing the supplied arguments to each.
     *
     * @param eventName - the name of the emitted event.
     * @param args to pass the listeners
     * @returns Promise that will be resolved as array of return values of all listeners.
     */
    public emitAsync<T>(eventName: string, ...args: any[]): Promise<T[]> {
        return Promise.all<T>(this.listeners(eventName)
        .map((listener: (...args: any[]) => T | Promise<T>): Promise<T> => {
            return new Promise<T>((resolve, reject) => {
                try {
                    resolve(listener(...args));
                } catch (e) {
                    reject(e);
                }
            });
        }));
    }
}
