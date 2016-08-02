export interface IPromiseResults<T> {
    state: "fulfilled" | "rejected";
    value?: T;
    reason?: Error;
}
