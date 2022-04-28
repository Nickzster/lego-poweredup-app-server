export interface IKeyValuePair<T> {
  key: string;
  value: T;
}

class CustomMap<T> {
  private map: any;

  public constructor() {
    this.map = {};
    return this;
  }

  public set(key: string, value: T) {
    this.map[key] = value;
    return this;
  }

  public get(key: string): T | null {
    return this.map[key];
  }

  public aggregate(): IKeyValuePair<T>[] {
    const items: IKeyValuePair<T>[] = [];
    for (let key in this.map) {
      items.push({ key, value: this.map[key] });
    }
    return items;
  }
}

export default CustomMap;
