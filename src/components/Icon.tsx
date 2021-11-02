import { Octicons } from '@expo/vector-icons';
import React, { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<typeof Octicons>;
export type IconName = Props['name'];

export const Icon = (props: Props) => {
  return <Octicons {...props} />;
};

export const Icons: Record<string, IconName> = {
  EDIT: 'pencil',
  SIGN_OUT: 'sign-out',
  TRASH: 'trashcan',
  CANCEL: 'x',
  PERSON: 'person',
  CHECK: 'check',
  EMAIL: 'mail',
  PASSWORD: 'key',
  PLUS: 'plus',
  CHEVRON_RIGHT: 'chevron-right',
  OPEN: 'unfold',
  SHARE: 'link-external',
  FLAME: 'flame',
  INFO: 'info',
};
