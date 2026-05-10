import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  users: any[] = [];
  loading = true;
  message = '';
  error = '';

  newUser = { username: '', password: '', role: 'user' };
  creating = false;

  editingUser: any = null;
  editForm = { username: '', role: 'user' };

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => { this.users = users; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Failed to load users.'; }
    });
  }

  createUser(): void {
    if (!this.newUser.username || !this.newUser.password) {
      this.error = 'Username and password required.';
      return;
    }
    this.creating = true;
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.message = 'User created!';
        this.newUser = { username: '', password: '', role: 'user' };
        this.creating = false;
        this.loadUsers();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create user.';
        this.creating = false;
      }
    });
  }

  startEdit(user: any): void {
    this.editingUser = user;
    this.editForm = { username: user.username, role: user.role };
  }

  saveEdit(): void {
    this.userService.updateUser(this.editingUser._id, this.editForm).subscribe({
      next: () => {
        this.message = 'User updated!';
        this.editingUser = null;
        this.loadUsers();
      },
      error: (err) => { this.error = err.error?.message || 'Update failed.'; }
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  deleteUser(user: any): void {
    if (!confirm(`Delete user "${user.username}"?`)) return;
    this.userService.deleteUser(user._id).subscribe({
      next: () => { this.message = 'User deleted.'; this.loadUsers(); },
      error: () => { this.error = 'Failed to delete user.'; }
    });
  }

  clearMessages(): void {
    this.message = '';
    this.error = '';
  }
}