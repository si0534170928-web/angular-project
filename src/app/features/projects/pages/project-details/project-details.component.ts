import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../projects.service';
import { TeamsService } from '../../../teams/teams.service';
import { TasksService } from '../../../tasks/tasks.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../projects.DTOs';
import { Team } from '../../../teams/teams.DTOs';
import { CreateTaskModalComponent } from '../../../tasks/components/create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CreateTaskModalComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetails {
  // 1. Get route parameter using the new input() function
  id = input.required<string>();

  // 2. Inject services
  private router = inject(Router);
  private projectsService = inject(ProjectsService);
  private teamsService = inject(TeamsService);
  private tasksService = inject(TasksService);

  // 3. Create signals for state management
  currentProject = signal<Project | undefined>(undefined);
  currentTeam = signal<Team | undefined>(undefined);
  projectTasks = this.tasksService.tasks;
  showCreateTaskModal = signal(false);
  isLoading = signal(true);
  error = signal<string | undefined>(undefined);

  constructor() {
    // 4. Use an effect to react to changes in the id input
    effect(() => {
      const projectId = Number(this.id());
      if (projectId) {
        this.loadProjectData(projectId);
      }
    });
  }

  private async loadProjectData(projectId: number) {
    try {
      this.isLoading.set(true);
      this.error.set(undefined);

      // Load all projects and find the current one
      const projects = await this.projectsService.loadProjects();
      const project = projects.find(p => p.id === projectId);
      this.currentProject.set(project);

      if (project) {
        // Load teams to get team details
        this.teamsService.getTeams().subscribe(teams => {
          const team = teams.find(t => t.id === project.team_id);
          this.currentTeam.set(team);
          this.isLoading.set(false);
        });
        
        // Load tasks for this project
        this.tasksService.loadProjectTasks(projectId);
      } else {
        this.error.set('Project not found');
        this.isLoading.set(false);
      }
    } catch (err) {
      console.error('Error loading project:', err);
      this.error.set('Failed to load project');
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  viewTask(taskId: number) {
    this.router.navigate(['/projects', this.id(), 'tasks', taskId]);
  }

  onAddTask() {
    this.showCreateTaskModal.set(true);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}