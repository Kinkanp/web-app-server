import * as bcrypt from 'bcrypt';

export function getRandomNumber(): number {
  const from = 1;
  const to = 999_999;

  return Math.floor(Math.random() * (from - to) + to);
}

export function hash(data: string | Buffer, salt: number): Promise<string> {
  return bcrypt.hash(data, salt);
}

export function useDataOnce<T>(data: T[]): (quantity?: number) => T[] {
  const unusedItems = [...data];

  return (quantity = 1) => {
    const items =  unusedItems.splice(0, quantity);

    if (!items.length) {
      throw new Error('useDataOnce: No items available');
    }

    return items;
  };
}

