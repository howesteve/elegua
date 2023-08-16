import type { ComponentType } from 'svelte';
import { type Subscriber } from 'svelte/store';
export declare const path: {
    subscribe: (this: void, run: Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined) => import("svelte/store").Unsubscriber;
    set: (x: string) => void;
    update: (this: void, updater: import("svelte/store").Updater<string>) => void;
};
export declare const hash: {
    subscribe: (this: void, run: Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined) => import("svelte/store").Unsubscriber;
    set: (x: string) => void;
    update: (this: void, updater: import("svelte/store").Updater<string>) => void;
};
export declare const url: {
    subscribe: (this: void, run: Subscriber<URL>, invalidate?: import("svelte/store").Invalidator<URL> | undefined) => import("svelte/store").Unsubscriber;
    set: (u: URL) => void;
    update: (this: void, updater: import("svelte/store").Updater<URL>) => void;
};
export declare const oldUrl: import("svelte/store").Readable<URL>;
export declare const searchParams: import("svelte/store").Readable<URLSearchParams>;
export declare let match: import("svelte/store").Readable<RegExpExecArray | undefined>;
export declare let params: import("svelte/store").Readable<{
    [key: string]: string;
}>;
export declare function namedPath(route: string): RegExp;
export type DynamicRoute = [string | RegExp, ComponentType, any?];
export declare function dynamic(path: string, routes: DynamicRoute[], defaultRoute?: ComponentType): ComponentType | undefined;
declare let preventChange_: (() => boolean | undefined) | undefined;
export declare function preventChange(f?: typeof preventChange_): void;
export declare function resolve(path: string, route: string | RegExp): boolean;
export declare function goto(href: string | URL, data?: any): void;
export declare function preventUnload(node: HTMLElement, callback: () => boolean | string): {
    destroy(): void;
};
export {};
