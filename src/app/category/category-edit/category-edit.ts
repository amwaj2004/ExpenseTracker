import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-category-edit',
  standalone: false,
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css',
})
export class CategoryEdit implements OnInit {
  category: Category = { name: '' };

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.categoryService.getOne(id).subscribe((data) => {
      this.category = data;
    });
  }

  onSubmit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.categoryService.update(id, this.category).subscribe(() => {
      this.router.navigate(['/categories']);
    });
  }
}
