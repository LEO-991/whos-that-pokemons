import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  auth = inject(AuthService);
  private http = inject(HttpClient);

  legendaryImages: string[] = [];

  // Known legendary Pokémon IDs
  legendaryIds = [144,145,146,150,151,243,244,245,249,250,251,
                  377,378,379,380,381,382,383,384,385,386,
                  480,481,482,483,484,485,486,487,488,491,492,493,
                  638,639,640,641,642,643,644,645,646,647,648,649];

  rules = [
    { icon: '🎯', title: 'Choose Difficulty', desc: 'Pick Easy, Medium, or Hard. Each sets your timer and hint availability.' },
    { icon: '🌑', title: 'Guess the Silhouette', desc: 'A blacked-out Pokémon appears. Pick the correct name from 4 choices.' },
    { icon: '⏱️', title: 'Beat the Clock', desc: 'Answer before time runs out! Wrong or slow answers end your streak.' },
    { icon: '🏆', title: 'Climb the Leaderboard', desc: 'Your highest score is saved per difficulty. Compete with other trainers!' },
  ];

  difficultyRows = [
    { label: 'Easy',   icon: 'pokeball.ico',  timer: '30 sec', hints: 'Type + Region', rowClass: 'easy-row' },
    { label: 'Medium', icon: 'ultraBall.ico', timer: '20 sec', hints: 'Type only',     rowClass: 'medium-row' },
    { label: 'Hard',   icon: 'masteball.ico', timer: '10 sec', hints: 'No hints',      rowClass: 'hard-row' },
  ];

  ngOnInit(): void {
    // Pick 12 random legendaries
    const shuffled = [...this.legendaryIds].sort(() => Math.random() - 0.5).slice(0, 12);
    shuffled.forEach(id => {
      this.legendaryImages.push(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      );
    });
  }
}