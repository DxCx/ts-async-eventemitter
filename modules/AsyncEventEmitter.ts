"use strict";

import { EventEmitter } from "events";
import { IPromiseResults } from "./Interfaces";

export class AsyncEventEmitter extends EventEmitter {
    /**
     * Synchronously calls each of the listeners registered for the event named eventName,
     * in the order they were registered, passing the supplied arguments to each.
     *
     * @param eventName - the name of the emitted event.
     * @param args to pass the listeners
     * @returns Promise that will be resolved as array of return values of all listeners.
     */
    public emitAsync<T>(eventName: string, ...args: any[]): Promise<IPromiseResults<T>[]> {
        let pArray: Promise<IPromiseResults<T>>[] = this.listeners(eventName)
        .map((listener: (...args: any[]) => T | Promise<T>): Promise<IPromiseResults<T>> => {
            return new Promise<T>((resolve, reject) => {
                try {
                    resolve(listener(...args));
                } catch (e) {
                    reject(e);
                }
            }).then((value: T) => {
                return <IPromiseResults<T>> { state: "fulfilled", value };
            }, (reason: Error) => {
                return <IPromiseResults<T>> { state: "rejected", reason };
            });
        });

        return Promise.all<IPromiseResults<T>>(pArray);
    }
}
