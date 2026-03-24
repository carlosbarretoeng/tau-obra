export interface SunburstItem {
    label: string;
    value: number;
    color: string;
    children?: SunburstItem[];
}