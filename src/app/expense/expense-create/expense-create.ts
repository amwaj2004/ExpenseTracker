import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../../interfaces/expense.interface';
import { Category } from '../../interfaces/category.interface';
import { ExpenseService } from '../../services/expense';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-expense-create',
  standalone: false,
  templateUrl: './expense-create.html',
  styleUrl: './expense-create.css',
})
export class ExpenseCreate implements OnInit, OnDestroy {
  expense: Expense = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
  };
  categories: Category[] = [];
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categories = data;
    });

    this.categoryService.getAll().subscribe({
      error: (err) => console.error('Failed to load categories:', err),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.errorMessage = '';
    const payload: Expense = { ...this.expense };
    if (!payload.category) delete payload.category;
    this.expenseService.create(payload).subscribe({
      next: () => {
        this.router.navigate(['/expenses']);
      },
      error: (err) => {
        console.error('Failed to create expense:', err);
        this.errorMessage = 'Could not save expense. Please try again.';
      },
    });
  }
}
