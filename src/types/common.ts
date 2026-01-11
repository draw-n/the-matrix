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