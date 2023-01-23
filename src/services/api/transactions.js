import {invoke} from './invoke';

export const getTransactions = (params, abort) => {
    return invoke('GET', 'api', params, abort);
}

