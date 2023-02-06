declare module "webp-converter" {
    export function dwebp(
        input: string,
        output: string,
        options: any,
        callback: (status: any, err: any) => void
    ): Promise<void>;
}

declare module 'object-path' { 
    export function get(item: any, path: string): any;
}