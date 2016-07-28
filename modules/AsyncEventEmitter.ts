"use strict";

import { EventEmitter } from "events";
import { CBQueue } from "CBQueue";

export class AsyncEventEmitter extends EventEmitter {
    private _cbq: CBQueue<any>;

    constructor(autoStart: boolean = true) {
        super();
        this._cbq = new CBQueue();

        if ( true === autoStart ) {
            this.start();
        }
    }

    /**
     * Starts the event emitter incase autoStart was set to false.
     */
    public start(): Promise<void> {
        return this._cbq.start();
    }

    /**
     * Synchronously calls each of the listeners registered for the event named eventName,
     * in the order they were registered, passing the supplied arguments to each.
     *
     * @param eventName - the name of the emitted event.
     * @param args to pass the listeners
     * @returns Promise that will be resolved as array of return values of all listeners.
     */
    public emitAsync<T>(eventName: string, ...args: any[]): Promise<T[]> {
        return this._cbq.push(() => {
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
        });
    }
}
