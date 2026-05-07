import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expense } from '../../interfaces/expense.interface';
import { Category } from '../../interfaces/category.interface';
import { ExpenseService } from '../../services/expense';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-expense-edit',
  standalone: false,
  templateUrl: './expense-edit.html',
  styleUrl: './expense-edit.css',
})
export class ExpenseEdit implements OnInit, OnDestroy {
  expense: Expense = { description: '', amount: 0 };
  categories: Category[] = [];
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categories = data;
      this.cdr.detectChanges();
    });

    this.categoryService.getAll().subscribe({
      error: (err) => console.error('Failed to load categories:', err),
    });

    const id = this.route.snapshot.paramMap.get('id')!;
    this.expenseService.getOne(id).subscribe({
      next: (data) => {
        const cat = data.category;
        this.expense = {
          ...data,
          date: data.date ? data.date.toString().split('T')[0] : '',
          category: cat && typeof cat === 'object' ? (cat as Category)._id : (cat as string) ?? '',
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load expense:', err);
        this.errorMessage = 'Could not load expense.';
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.errorMessage = '';
    const id = this.route.snapshot.paramMap.get('id')!;
    const payload: Expense = { ...this.expense };
    if (!payload.category) delete payload.category;
    this.expenseService.update(id, payload).subscribe({
      next: () => {
        this.router.navigate(['/expenses']);
      },
      error: (err) => {
        console.error('Failed to update expense:', err);
        this.errorMessage = 'Could not update expense. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}