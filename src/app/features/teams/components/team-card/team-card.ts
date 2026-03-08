import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Team } from '../../teams.DTOs';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './team-card.html',
  styleUrl: './team-card.css',
})
export class TeamCard {
  @Input() team!: Team;
  @Input() canAddMembers: boolean = false;
  @Output() cardClick = new EventEmitter<Team>();
  @Output() addMemberClick = new EventEmitter<Team>();

  onClick() {
    this.cardClick.emit(this.team);
  }

  onAddMember(event: Event) {
    event.stopPropagation(); // Prevent card click
    this.addMemberClick.emit(this.team);
  }
}
