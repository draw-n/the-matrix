export interface ControlledValueProps<T> {
  value?: T;
  onChange?: (value: T) => void;
}

export interface CommonFormProps {
  onSubmit: () => void;
}

export interface CommonTableProps {
  refresh: () => void;
}

export interface EditableComponentProps<T> {
    handleClick?: (editMode: boolean, setEditMode: (editMode: boolean) => void, values?: Partial<T>) => void;
}