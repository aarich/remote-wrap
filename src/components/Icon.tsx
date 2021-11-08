import { Octicons } from '@expo/vector-icons';
import React, { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<typeof Octicons>;
export type IconName = Props['name'];

export const Icon = (props: Props) => {
  return <Octicons {...props} />;
};

type IconKey =
  | 'EDIT'
  | 'SIGN_IN'
  | 'SIGN_OUT'
  | 'TRASH'
  | 'CANCEL'
  | 'PERSON'
  | 'CHECK'
  | 'EMAIL'
  | 'PASSWORD'
  | 'PLUS'
  | 'CHEVRON_RIGHT'
  | 'OPEN'
  | 'SHARE'
  | 'LINK'
  | 'FLAME'
  | 'INFO'
  | 'HEART'
  | 'UNFOLLOW'
  | 'GIFT'
  | 'DEMO'
  | 'SETTINGS'
  | 'ALERT';

export const Icons: Record<IconKey, IconName> = {
  EDIT: 'pencil',
  SIGN_IN: 'sign-in',
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
  LINK: 'link',
  FLAME: 'flame',
  INFO: 'info',
  HEART: 'heart',
  UNFOLLOW: 'x',
  GIFT: 'gift',
  DEMO: 'play',
  SETTINGS: 'settings',
  ALERT: 'alert',
};
