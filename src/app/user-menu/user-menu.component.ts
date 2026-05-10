import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { GameService } from '../game.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  private userService = inject(UserService);
  private gameService = inject(GameService);
  authService = inject(AuthService);
  private router = inject(Router);

  user: any = null;
  scores: any[] = [];
  history: any[] = [];
  newUsername = '';
  usernameMsg = '';
  usernameError = '';
  loading = true;

  scoreDiffs = [
    { key: 'easy',   label: 'Easy',   icon: 'pokeball.ico' },
    { key: 'medium', label: 'Medium', icon: 'ultraBall.ico' },
    { key: 'hard',   label: 'Hard',   icon: 'masteball.ico' }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userService.getProfile().subscribe({
      next: (userData) => { this.user = userData; this.loading = false; },
      error: () => this.router.navigate(['/login'])
    });
    this.gameService.getScores().subscribe({ next: (scores) => this.scores = scores });
    this.gameService.getHistory().subscribe({ next: (history) => this.history = history });
  }

  updateUsername(): void {
    if (!this.newUsername.trim()) return;
    this.usernameMsg = '';
    this.usernameError = '';
    this.userService.updateUsername(this.newUsername).subscribe({
      next: () => {
        this.usernameMsg = 'Username updated!';
        const currentUser = this.authService.getCurrentUser();
        currentUser.username = this.newUsername;
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.user.username = this.newUsername;
        this.newUsername = '';
      },
      error: (err) => {
        this.usernameError = err.error?.message || 'Failed to update username.';
      }
    });
  }

  deleteHistory(): void {
    if (!confirm('Delete all game history?')) return;
    this.userService.deleteHistory().subscribe({
      next: () => { this.history = []; }
    });
  }

  deleteAccount(): void {
    if (!confirm('Are you sure you want to permanently delete your account?')) return;
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  scoreFor(diff: string): number {
    return this.scores.find(s => s.difficulty === diff)?.score ?? 0;
  }
}