import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Capitalize(val:string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function GroupBy (xs:{}[], key:string) {
    return xs.reduce(function(rv, x) {
        // @ts-ignore
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
}