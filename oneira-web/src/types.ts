export enum Screen {
    LANDING = 'LANDING',
    SELECTION = 'SELECTION',
    INPUT = 'INPUT',
    RESULT = 'RESULT',
    HISTORY = 'HISTORY'
}

export interface Fortune {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'Clarity' | 'Mystery' | 'Vigilance' | 'Hope' | 'Balance' | 'Flux';
    icon: string;
    luckScore?: number;
    lotto?: number[];
    summary?: string;
    advice?: string;
    imageUrl?: string;
}

export type CardType = 'DREAM' | 'ORACLE' | 'SOUL';
