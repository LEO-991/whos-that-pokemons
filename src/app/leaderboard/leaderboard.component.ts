import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);

  activeTab: 'easy' | 'medium' | 'hard' = 'easy';
  boards: Record<string, any[]> = { easy: [], medium: [], hard: [] };
  loading = false;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    const diffs: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    let loaded = 0;
    for (const d of diffs) {
      this.leaderboardService.getLeaderboard(d).subscribe({
        next: (data) => {
          this.boards[d] = data;
          loaded++;
          if (loaded === diffs.length) this.loading = false;
        },
        error: () => { loaded++; if (loaded === diffs.length) this.loading = false; }
      });
    }
  }

  get currentBoard(): any[] {
    return this.boards[this.activeTab] || [];
  }

  setTab(tab: 'easy' | 'medium' | 'hard'): void {
    this.activeTab = tab;
  }

  medalFor(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }
}