import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ExpenseList } from './expense/expense-list/expense-list';
import { ExpenseCreate } from './expense/expense-create/expense-create';
import { ExpenseEdit } from './expense/expense-edit/expense-edit';
import { CategoryList } from './category/category-list/category-list';
import { CategoryCreate } from './category/category-create/category-create';
import { CategoryEdit } from './category/category-edit/category-edit';
import { Dashboard } from './dashboard/dashboard';

@NgModule({
  declarations: [
    App,
    ExpenseList,
    ExpenseCreate,
    ExpenseEdit,
    CategoryList,
    CategoryCreate,
    CategoryEdit,
    Dashboard,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
