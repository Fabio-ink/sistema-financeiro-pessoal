import { useState, useMemo } from 'react';

export function useSelection(items) {
    const [selectedItems, setSelectedItems] = useState(new Set());

    const handleSelect = (itemId) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(itemId)) {
                newSelected.delete(itemId);
            } else {
                newSelected.add(itemId);
            }
            return newSelected;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(new Set(items.map(item => item.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    const clearSelection = () => {
        setSelectedItems(new Set());
    };

    const isAllSelected = useMemo(() => 
        items.length > 0 && selectedItems.size === items.length,
        [selectedItems.size, items.length]
    );

    return {
        selectedItems,
        handleSelect,
        handleSelectAll,
        clearSelection,
        isAllSelected
    };
}
