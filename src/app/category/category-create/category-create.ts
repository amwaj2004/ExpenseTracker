import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-category-create',
  standalone: false,
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class CategoryCreate {
  category: Category = { name: '' };

  constructor(private categoryService: CategoryService, private router: Router) {}

  onSubmit(): void {
    this.categoryService.create(this.category).subscribe(() => {
      this.router.navigate(['/categories']);
    });
  }
}
