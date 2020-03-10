import { en } from '../../translations/en';
import { pt } from './pt';

// tslint:disable:no-submodule-imports
import localePt from 'react-intl/locale-data/pt';
// tslint:enable

export const customLocaleData = ([...localePt]);

export type LangType = typeof en;

export const customLanguageMap = {
    pt,
};
