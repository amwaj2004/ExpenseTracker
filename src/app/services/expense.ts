import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Expense } from '../interfaces/expense.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/api/expenses`;

  // BehaviorSubject holds the current list in memory — components that
  // subscribe get the last known value immediately on navigation.
  private _expenses = new BehaviorSubject<Expense[]>([]);
  readonly expenses$ = this._expenses.asObservable();

  constructor(private http: HttpClient) {}

  // Fetches fresh data from the server and pushes it into the subject,
  // so every subscriber (dashboard, list, etc.) updates automatically.
  getAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl).pipe(
      tap((data) => this._expenses.next(data))
    );
  }

  getOne(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  // After create/update/delete, update the in-memory list immediately
  // so the UI reflects the change without waiting for another getAll().
  create(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap((created) => {
        this._expenses.next([...this._expenses.getValue(), created]);
      })
    );
  }

  update(id: string, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense).pipe(
      tap((updated) => {
        const list = this._expenses.getValue().map((e) => (e._id === id ? updated : e));
        this._expenses.next(list);
      })
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._expenses.next(this._expenses.getValue().filter((e) => e._id !== id));
      })
    );
  }
}
