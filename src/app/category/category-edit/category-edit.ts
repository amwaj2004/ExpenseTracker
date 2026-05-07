import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-category-edit',
  standalone: false,
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css',
})
export class CategoryEdit implements OnInit, OnDestroy {
  category: Category = { name: '' };
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.categoryService.getOne(id).subscribe({
      next: (data) => {
        this.category = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load category:', err);
        this.errorMessage = 'Could not load category.';
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
    this.categoryService.update(id, this.category).subscribe({
      next: () => {
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        console.error('Failed to update category:', err);
        this.errorMessage = 'Could not update category. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}