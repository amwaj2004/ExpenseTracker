import { Category } from './category.interface';

export interface Expense {
  _id?: string;
  description: string;
  amount: number;
  date?: string;
  category?: string | Category | null;
}
