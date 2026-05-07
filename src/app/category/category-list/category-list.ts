import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit, OnDestroy {
  categories: Category[] = [];
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categories = data;
      this.cdr.detectChanges();
    });

    this.categoryService.getAll().subscribe({
      next: () => {
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.errorMessage = 'Could not load categories. Is the backend running?';
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editCategory(id: string | undefined): void {
    if (id) this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: string | undefined): void {
    if (!id) return;
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to delete category:', err);
        this.errorMessage = 'Could not delete category.';
        this.cdr.detectChanges();
      },
    });
  }
}