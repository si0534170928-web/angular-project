import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../projects.DTOs';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  @Input() project!: Project;
  @Output() cardClick = new EventEmitter<Project>();
  
  onCardClick() {
    this.cardClick.emit(this.project);
  }
}
