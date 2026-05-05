import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categories = data;
    });

    this.categoryService.getAll().subscribe({
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.errorMessage = 'Could not load categories. Is the backend running?';
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
    // tap() in the service removes the item from the subject automatically
    this.categoryService.delete(id).subscribe({
      error: (err) => {
        console.error('Failed to delete category:', err);
        this.errorMessage = 'Could not delete category.';
      },
    });
  }
}
