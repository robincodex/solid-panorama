import type xmljs from 'xml-js';
export default function xml(...args: any[]): void;
export function getXML(filename: string): xmljs.Element | undefined;
export function getAllCacheXML(): Record<string, xmljs.Element>;
export function formatXML(root: xmljs.Element): string;
