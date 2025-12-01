import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
    if (!date) return '';
    return format(new Date(date), pattern, { locale: ptBR });
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
