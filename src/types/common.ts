export interface ControlledValueProps<T> {
    value?: T;
    onChange?: (value: T) => void;
}
export interface EditableComponentProps<T> {
    handleClick?: (
        editMode: boolean,
        setEditMode: (editMode: boolean) => void,
        values?: Partial<T>,
    ) => void;
}

export const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s };
};
