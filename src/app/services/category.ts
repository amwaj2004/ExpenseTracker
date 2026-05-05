import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../interfaces/category.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/categories`;

  private _categories = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this._categories.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((data) => this._categories.next(data))
    );
  }

  getOne(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap((created) => {
        this._categories.next([...this._categories.getValue(), created]);
      })
    );
  }

  update(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      tap((updated) => {
        const list = this._categories.getValue().map((c) => (c._id === id ? updated : c));
        this._categories.next(list);
      })
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._categories.next(this._categories.getValue().filter((c) => c._id !== id));
      })
    );
  }
}
