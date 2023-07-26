import { ReactNode } from 'react';

export interface ButtonProps {
  buttonLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode;
}
