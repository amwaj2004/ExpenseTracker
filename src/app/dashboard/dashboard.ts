import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.expenseService.getAll().subscribe(
      (response) => {
        this.expenses = response;
        this.calculateSummary();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load expenses. Is the backend running?';
        console.error('Error loading expenses:', error);
        this.cdr.detectChanges();
      }
    );

    this.categoryService.getAll().subscribe(
      (response) => {
        this.categories = response;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.cdr.detectChanges();
      }
    );
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