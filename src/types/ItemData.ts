import { ItemType } from './';

export class ItemData {
  key: string;
  type: ItemType;
  path: string;
  depth: number;
  length?: number | undefined;
  children?: ItemData[] | undefined;
  value?: unknown;
  constructor(key: string, type: ItemType, path: string, depth: number) {
    // ...
    this.key = key;
    this.type = type;
    this.path = path;
    this.depth = depth;
  }
}
