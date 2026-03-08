import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamForm } from './team-form';

describe('TeamForm', () => {
  let component: TeamForm;
  let fixture: ComponentFixture<TeamForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit teamFormSubmitted when form is valid', (done) => {
    const teamName = 'Test Team';
    component.teamForm.patchValue({ name: teamName });
    
    component.teamFormSubmitted.subscribe((data) => {
      expect(data.name).toBe(teamName);
      done();
    });

    component.onSubmit();
  });

  it('should not emit when form is invalid', () => {
    let emitted = false;
    component.teamFormSubmitted.subscribe(() => {
      emitted = true;
    });

    component.onSubmit();
    expect(emitted).toBeFalsy();
  });

  it('should reset form after submission', () => {
    component.teamForm.patchValue({ name: 'Test Team' });
    component.onSubmit();
    expect(component.teamForm.get('name')?.value).toBeNull();
  });
});
