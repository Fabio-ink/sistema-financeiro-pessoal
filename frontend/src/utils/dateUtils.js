import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
    if (!date) return '';
    
    // If it's a string in YYYY-MM-DD format (typical from backend for local dates)
    // Parse it manually to avoid UTC conversion which shifts date in local timezone
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-').map(Number);
        return format(new Date(year, month - 1, day), pattern, { locale: ptBR });
    }

    // Fallback for timestamps or existing Date objects
    return format(new Date(date), pattern, { locale: ptBR });
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
