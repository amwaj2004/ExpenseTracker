import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../../interfaces/expense.interface';
import { Category } from '../../interfaces/category.interface';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-expense-list',
  standalone: false,
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to expenses$ for real-time updates (including deletions)
    this.expenseService.expenses$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.expenses = data;
      this.cdr.detectChanges();
    });

    // Load initial data from backend
    this.expenseService.getAll().subscribe({
      next: () => {
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Failed to load expenses:', err);
        this.errorMessage = 'Could not load expenses. Is the backend running?';
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCategoryName(category: string | Category | null | undefined): string {
    if (!category) return '—';
    if (typeof category === 'object') return category.name;
    return '—';
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  editExpense(id: string | undefined): void {
    if (id) this.router.navigate(['/expenses/edit', id]);
  }

  deleteExpense(id: string | undefined): void {
    if (!id) return;
    if (!confirm('Delete this expense?')) return;
    // delete() uses tap() to update the expenses$ subject,
    // triggering the subscription in ngOnInit to update the view automatically
    this.expenseService.delete(id).subscribe({
      next: () => {
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to delete expense:', err);
        this.errorMessage = 'Could not delete expense.';
        this.cdr.detectChanges();
      },
    });
  }
}