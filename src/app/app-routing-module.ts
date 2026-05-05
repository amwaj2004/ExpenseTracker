import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { ExpenseList } from './expense/expense-list/expense-list';
import { ExpenseCreate } from './expense/expense-create/expense-create';
import { ExpenseEdit } from './expense/expense-edit/expense-edit';
import { CategoryList } from './category/category-list/category-list';
import { CategoryCreate } from './category/category-create/category-create';
import { CategoryEdit } from './category/category-edit/category-edit';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'expenses', component: ExpenseList },
  { path: 'expenses/new', component: ExpenseCreate },
  { path: 'expenses/edit/:id', component: ExpenseEdit },
  { path: 'categories', component: CategoryList },
  { path: 'categories/new', component: CategoryCreate },
  { path: 'categories/edit/:id', component: CategoryEdit },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
