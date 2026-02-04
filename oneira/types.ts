export enum ViewState {
  SPLASH = 'SPLASH',
  SELECTION = 'SELECTION',
  INPUT_DREAM = 'INPUT_DREAM',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY'
}

export enum FortuneType {
  DREAM = 'DREAM',
  ORACLE = 'ORACLE',
  SOUL = 'SOUL'
}

export interface FortuneResult {
  title: string;
  subtitle: string;
  description: string;
  type: FortuneType;
  date: string;
  icon: string;
}

export interface HistoryItem extends FortuneResult {
  id: string;
}
