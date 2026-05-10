import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  selectedGeneration = 'gen1';
  selectedDifficulty: 'easy' | 'medium' | 'hard' = 'easy';

  generations = [
    { value: 'gen1', label: 'Gen I – Kanto (1–151)' },
    { value: 'gen2', label: 'Gen II – Johto (152–251)' },
    { value: 'gen3', label: 'Gen III – Hoenn (252–386)' },
    { value: 'gen4', label: 'Gen IV – Sinnoh (387–493)' },
    { value: 'gen5', label: 'Gen V – Unova (494–649)' },
    { value: 'gen6', label: 'Gen VI – Kalos (650–721)' },
    { value: 'gen7', label: 'Gen VII – Alola (722–809)' },
    { value: 'gen8', label: 'Gen VIII – Galar (810–905)' },
    { value: 'gen9', label: 'Gen IX – Paldea (906–1010)' }
  ];

difficulties = [
  { value: 'easy',   label: 'Easy',   desc: '30 sec | Type + Region hints', icon: 'pokeball.ico' },
  { value: 'medium', label: 'Medium', desc: '20 sec | Type hint only',       icon: 'ultraBall.ico' },
  { value: 'hard',   label: 'Hard',   desc: '10 sec | No hints',             icon: 'masteball.ico' }
];
  startGame(): void {
    this.gameService.setSettings({
      generation: this.selectedGeneration,
      difficulty: this.selectedDifficulty
    });
    this.router.navigate(['/game']);
  }
}