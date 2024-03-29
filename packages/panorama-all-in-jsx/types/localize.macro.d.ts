export default function localize(token: string, ...args: string[]): string;

export interface LocalizationData {
    brazilian?: string;
    bulgarian?: string;
    czech?: string;
    danish?: string;
    dutch?: string;
    english?: string;
    finnish?: string;
    french?: string;
    german?: string;
    greek?: string;
    hungarian?: string;
    italian?: string;
    japanese?: string;
    korean?: string;
    koreana?: string;
    latam?: string;
    norwegian?: string;
    polish?: string;
    portuguese?: string;
    romanian?: string;
    russian?: string;
    schinese?: string;
    spanish?: string;
    swedish?: string;
    tchinese?: string;
    thai?: string;
    turkish?: string;
    ukrainian?: string;
    vietnamese?: string;
}
export function getLocalizationTable<T extends LocalizationData>(): Record<
    string,
    T
>;
