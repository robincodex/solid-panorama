import type xmljs from 'xml-js';

interface XMLFile {
    root?: xmljs.Element;
    snippets: xmljs.Element[];
    _rootSnippets?: xmljs.Element[];
}

export default function xml(...args: any[]): void;
export function getXML(filename: string): XMLFile | undefined;
export function getAllCacheXML(): Record<string, XMLFile>;
export function formatXML(files: XMLFile[]): string;
