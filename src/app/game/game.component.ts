import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PokemonService } from '../pokemon.service';
import { GameService } from '../game.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  private pokemonService = inject(PokemonService);
  private gameService = inject(GameService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentPokemon: any = null;
  choices: any[] = [];
  silhouetteUrl = '';
  revealed = false;
  selectedAnswer: any = null;
  isCorrect: boolean | null = null;

  score = 0;
  streak = 0;
  round = 0;
  maxRounds = 10;

  timeLeft = 30;
  timerInterval: any = null;

  hints: { type: string; region: string } = { type: '', region: '' };
  showType = false;
  showRegion = false;

  loading = true;
  gameOver = false;

  difficulty = 'easy';
  generation = 'gen1';

  ngOnInit(): void {
    const settings = this.gameService.getSettings();
    this.difficulty = settings.difficulty;
    this.generation = settings.generation;
    this.loadNextPokemon();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadNextPokemon(): void {
    if (this.round >= this.maxRounds) {
      this.endGame();
      return;
    }
    this.loading = true;
    this.revealed = false;
    this.selectedAnswer = null;
    this.isCorrect = null;
    this.showType = false;
    this.showRegion = false;

    this.pokemonService.getRandomPokemon(this.generation).subscribe({
      next: (pokemon) => {
        this.currentPokemon = pokemon;
        this.silhouetteUrl = this.pokemonService.getSilhouetteUrl(pokemon);
        this.hints = this.pokemonService.getHints(pokemon);
        this.pokemonService.getRandomChoices(pokemon, this.generation).subscribe({
          next: (choices) => {
            this.choices = choices;
            this.loading = false;
            this.round++;
            this.startTimer();
            this.applyHints();
          }
        });
      },
      error: () => this.loadNextPokemon()
    });
  }

  applyHints(): void {
    const config = this.gameService.getConfig(this.difficulty);
    if (config.hints.includes('type'))   this.showType = true;
    if (config.hints.includes('region')) this.showRegion = true;
  }

  startTimer(): void {
    this.clearTimer();
    const config = this.gameService.getConfig(this.difficulty);
    this.timeLeft = config.timer;
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.timeUp();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  timeUp(): void {
    if (!this.revealed) {
      this.revealed = true;
      this.isCorrect = false;
      this.streak = 0;
      this.saveHistory('wrong');
      setTimeout(() => this.loadNextPokemon(), 2000);
    }
  }

  selectAnswer(choice: any): void {
    if (this.revealed) return;
    this.clearTimer();
    this.selectedAnswer = choice;
    this.revealed = true;
    this.isCorrect = choice.id === this.currentPokemon.id;

    if (this.isCorrect) {
      const points = this.difficulty === 'hard' ? 30 : this.difficulty === 'medium' ? 20 : 10;
      this.score += points + Math.max(0, this.timeLeft) * 2;
      this.streak++;
      this.saveHistory('correct');
    } else {
      this.streak = 0;
      this.saveHistory('wrong');
    }

    setTimeout(() => this.loadNextPokemon(), 2000);
  }

  saveHistory(result: 'correct' | 'wrong'): void {
    if (this.authService.isLoggedIn()) {
      this.gameService.saveHistory(this.currentPokemon.name, result).subscribe();
    }
  }

  endGame(): void {
    this.gameOver = true;
    this.clearTimer();
    if (this.authService.isLoggedIn()) {
      this.gameService.saveScore(this.difficulty, this.score).subscribe();
    }
  }

  playAgain(): void {
    this.router.navigate(['/lobby']);
  }

  get timerPercent(): number {
    const config = this.gameService.getConfig(this.difficulty);
    return (this.timeLeft / config.timer) * 100;
  }

  get timerClass(): string {
    if (this.timerPercent > 50) return 'safe';
    if (this.timerPercent > 25) return 'warning';
    return 'danger';
  }

  capitalize(name: string): string {
    return this.pokemonService.capitalize(name);
  }
}