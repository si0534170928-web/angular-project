import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Team } from '../../teams.DTOs';
import { TeamCard } from '../team-card/team-card';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, TeamCard, MatIconModule],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.css',
})
export class TeamsList {
  @Input() teams: Team[] = [];
  @Input() canAddMembers: boolean = false;
  @Output() teamSelected = new EventEmitter<Team>();
  @Output() addMember = new EventEmitter<Team>();

  onTeamClick(team: Team) {
    this.teamSelected.emit(team);
  }

  onAddMember(team: Team) {
    this.addMember.emit(team);
  }

  trackByTeamId(index: number, team: Team): number {
    return team.id;
  }
}
