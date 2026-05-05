import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../interfaces/expense.interface';
import { Category } from '../interfaces/category.interface';
import { ExpenseService } from '../services/expense';
import { CategoryService } from '../services/category';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  categories: Category[] = [];
  totalSpending = 0;
  spendingByCategory: { name: string; total: number }[] = [];
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Subscribe to the shared subject — gets last known value instantly on nav
    this.expenseService.expenses$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.expenses = data;
      this.calculateSummary();
    });

    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categories = data;
    });

    // Trigger a fresh fetch; tap() in the service pushes the result to the subjects above
    this.expenseService.getAll().subscribe({
      error: (err) => {
        console.error('Dashboard: failed to load expenses', err);
        this.errorMessage = 'Could not load expense data. Is the backend running?';
      },
    });

    this.categoryService.getAll().subscribe({
      error: (err) => console.error('Dashboard: failed to load categories', err),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateSummary(): void {
    this.totalSpending = this.expenses.reduce((sum, e) => sum + e.amount, 0);

    const groups: Record<string, number> = {};
    this.expenses.forEach((e) => {
      const cat = e.category;
      const name = cat && typeof cat === 'object' ? cat.name : 'Uncategorized';
      groups[name] = (groups[name] || 0) + e.amount;
    });

    this.spendingByCategory = Object.entries(groups).map(([name, total]) => ({
      name,
      total,
    }));
  }
}
