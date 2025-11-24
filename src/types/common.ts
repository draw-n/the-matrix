export interface ControlledValueProps<T> {
  value?: T;
  onChange?: (value: T) => void;
}