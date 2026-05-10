import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'https://whos-that-pokemons.onrender.com/api';

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`, { headers: this.headers() });
  }

  updateUsername(username: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/me/username`, { username }, { headers: this.headers() });
  }

  deleteHistory(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/me/history`, { headers: this.headers() });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/me`, { headers: this.headers() });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { headers: this.headers() });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, data, { headers: this.headers() });
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, data, { headers: this.headers() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`, { headers: this.headers() });
  }
}