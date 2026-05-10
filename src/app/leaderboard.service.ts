import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://whos-that-pokemons.onrender.com/api';

  getLeaderboard(difficulty: 'easy' | 'medium' | 'hard'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard/${difficulty}`);
  }
}