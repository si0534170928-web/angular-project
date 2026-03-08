import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailsModal } from './project-details-modal';
import { Project } from '../../projects.DTOs';

describe('ProjectDetailsModal', () => {
  let component: ProjectDetailsModal;
  let fixture: ComponentFixture<ProjectDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit seeTasks event when onSeeTasks is called with project', () => {
    const mockProject: Project = {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      status: 'active',
      created_at: new Date().toISOString(),
      team_id: 1
    };
    
    component.project = mockProject;
    spyOn(component.seeTasks, 'emit');
    
    component.onSeeTasks();
    
    expect(component.seeTasks.emit).toHaveBeenCalledWith(mockProject);
  });

  it('should emit close event when backdrop is clicked', () => {
    const mockEvent = { target: document.createElement('div'), currentTarget: document.createElement('div') };
    mockEvent.target = mockEvent.currentTarget;
    
    spyOn(component.close, 'emit');
    component.onBackdropClick(mockEvent);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close event when backdrop click target is not currentTarget', () => {
    const mockEvent = { 
      target: document.createElement('div'), 
      currentTarget: document.createElement('span') 
    };
    
    spyOn(component.close, 'emit');
    component.onBackdropClick(mockEvent);
    expect(component.close.emit).not.toHaveBeenCalled();
  });
});