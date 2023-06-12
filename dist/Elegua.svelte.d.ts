import { SvelteComponentTyped } from "svelte";
import { type Subscriber } from 'svelte/store';
export interface RouteOptions {
    keepMatching?: boolean;
}
export declare const path: {
    subscribe: (this: void, run: Subscriber<string>, invalidate?: ((value?: string | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    set: (x: string) => void;
    update: (this: void, updater: import("svelte/store").Updater<string>) => void;
};
export declare const hash: {
    subscribe: (this: void, run: Subscriber<string>, invalidate?: ((value?: string | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    set: (x: string) => void;
    update: (this: void, updater: import("svelte/store").Updater<string>) => void;
};
export declare const url: {
    subscribe: (this: void, run: Subscriber<URL>, invalidate?: ((value?: URL | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    set: (u: URL) => void;
    update: (this: void, updater: import("svelte/store").Updater<URL>) => void;
};
export declare const oldUrl: import("svelte/store").Readable<URL>;
export declare const searchParams: import("svelte/store").Readable<URLSearchParams>;
export declare let match: import("svelte/store").Readable<RegExpExecArray | undefined>;
export declare let params: import("svelte/store").Readable<{
    [key: string]: string;
}>;
export declare function resolve(path: string): void;
export declare function goto(href: string | URL, data?: any): void;
declare const __propDef: {
    props: {
        route: string | RegExp;
        options?: RouteOptions | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type EleguaProps = typeof __propDef.props;
export type EleguaEvents = typeof __propDef.events;
export type EleguaSlots = typeof __propDef.slots;
export default class Elegua extends SvelteComponentTyped<EleguaProps, EleguaEvents, EleguaSlots> {
}
export {};
