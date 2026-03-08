import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../projects.DTOs';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-projects-list',
  imports: [CommonModule, ProjectCard],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
})
export class ProjectsList {
  @Input() projects: Project[] = [];
  @Input() loading = false;
  @Output() projectSelected = new EventEmitter<Project>();

  onProjectSelected(project: Project): void {
    this.projectSelected.emit(project);
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }
}
