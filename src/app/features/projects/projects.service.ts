import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { NotificationService } from "../../core/services/notification.service";
import { Observable, pipe, tap, catchError, throwError, from } from "rxjs";
import { Project, CreateProjectDTO } from "./projects.DTOs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  
  private apiservice = inject(ApiService);
  private notificationService = inject(NotificationService);
  private projects = signal<Project[]>([]);
  
  async loadProjects(): Promise<Project[]> {
    try {
      const projects = await this.apiservice.get<Project[]>('/projects').toPromise();
      this.projects.set(projects || []);
      return projects || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async createProject(data: CreateProjectDTO): Promise<Project> {
    // Create optimistic project for immediate UI update
    const optimisticProject: Project = {
      id: Date.now(), // Temporary ID
      team_id: data.teamId,
      name: data.name,
      description: data.description,
      status: 'creating',
      created_at: new Date()
    };

    // Add optimistic update
    this.projects.update(projects => [...projects, optimisticProject]);

    try {
      // Make API call
      const newProject = await this.apiservice.post<Project, CreateProjectDTO>('/projects', data).toPromise();
      
      if (newProject) {
        // Replace optimistic project with real project
        this.projects.update(projects => 
          projects.map(p => p.id === optimisticProject.id ? newProject : p)
        );
        
        this.notificationService.success('Project created!');
        return newProject;
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      // Remove optimistic project on error
      this.projects.update(projects => 
        projects.filter(p => p.id !== optimisticProject.id)
      );
      
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    let errorMessage = 'Something went wrong.';
    
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          errorMessage = 'Missing info. Please check.';
          break;
        case 403:
          errorMessage = 'Not allowed to create project.';
          break;
        case 409:
          errorMessage = 'Project name already exists.';
          break;
        case 500:
          errorMessage = 'Server error. Try again.';
          break;
        default:
          errorMessage = error.error?.message || errorMessage;
      }
    }
    
    this.notificationService.error(errorMessage);
  }
  
  getProjectsByTeam(teamId: number): Project[] {
    return this.projects().filter(project => project.team_id === teamId);
  }
  
  getAllProjects() {
    return this.projects.asReadonly();
  }
  
  hasProjects(): boolean {
    return this.projects().length > 0;
  }
}