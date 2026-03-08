import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../projects.service';
import { TeamsService } from '../../../teams/teams.service';
import { ProjectsList } from '../../components/projects-list/projects-list';
import { ActionButton } from '../../../../shared/components/action-button/action-button';
import { CreateProjectModal } from '../../components/create-project-modal/create-project-modal';
import { ProjectDetailsModal } from '../../components/project-details-modal/project-details-modal';
import { Project, CreateProjectDTO } from '../../projects.DTOs';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsList, ActionButton, CreateProjectModal, ProjectDetailsModal],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  private projectsService = inject(ProjectsService);
  private teamsService = inject(TeamsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild(CreateProjectModal) createProjectModal!: CreateProjectModal;

  loading = signal(false);
  showCreateModal = signal(false);
  showDetailsModal = signal(false);
  selectedProject = signal<Project | null>(null);
  selectedTeamId = signal<number | null>(null);
  selectedTeamName = signal<string>('');

  // Access filtered projects by team
  get projects() {
    const teamId = this.selectedTeamId();
    if (teamId) {
      return this.projectsService.getProjectsByTeam(teamId);
    }
    return this.projectsService.getAllProjects()();
  }

  get teams() {
    return this.teamsService.teams();
  }

  ngOnInit(): void {
    // Read teamId from query parameters
    this.route.queryParams.subscribe(params => {
      const teamId = params['teamId'];
      if (teamId) {
        this.selectedTeamId.set(Number(teamId));
        // Find team name
        const team = this.teams.find(t => t.id === Number(teamId));
        if (team) {
          this.selectedTeamName.set(team.name);
        }
      }
    });
    
    this.loadProjects();
  }

  async loadProjects(): Promise<void> {
    this.loading.set(true);
    try {
      await this.projectsService.loadProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onProjectSelected(project: Project): void {
    this.selectedProject.set(project);
    this.showDetailsModal.set(true);
  }

  onCreateProject(): void {
    const teamId = this.selectedTeamId();
    const teamName = this.selectedTeamName();
    
    if (teamId && teamName) {
      this.showCreateModal.set(true);
    } else {
      console.log('No team selected');
      // Redirect back to teams page to select a team
      this.router.navigate(['/teams']);
    }
  }

  async onProjectCreated(projectData: CreateProjectDTO): Promise<void> {
    try {
      const newProject = await this.projectsService.createProject(projectData);
      
      // Update team project count
      this.teamsService.incrementProjectCount(projectData.teamId);
      
      // Close modal and reset form
      this.closeCreateModal();
    } catch (error) {
      // Error handling is done in the service
      // Reset modal's submitting state
      this.createProjectModal?.setSubmitting(false);
      console.error('Failed to create project:', error);
    }
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.selectedTeamId.set(null);
    this.selectedTeamName.set('');
  }

  onProjectDetailsClosed(): void {
    this.showDetailsModal.set(false);
    this.selectedProject.set(null);
  }

  onSeeProjectTasks(project: Project): void {
    // Close the details modal first
    this.onProjectDetailsClosed();
    
    // Navigate to project details page which will show tasks
    this.router.navigate(['/projects', project.id]);
  }

  goBackToTeams(): void {
    this.router.navigate(['/teams']);
  }
}
