import { ComponentType } from 'react';

export type RoutePath = '/';

export interface RouteItem {
  path: RoutePath | string;
  component: ComponentType;
}
