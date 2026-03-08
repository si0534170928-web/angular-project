import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMemberForm } from './add-member-form';

describe('AddMemberForm', () => {
  let component: AddMemberForm;
  let fixture: ComponentFixture<AddMemberForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMemberForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMemberForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit memberFormSubmitted when form is valid', (done) => {
    const memberEmail = 'test@example.com';
    component.memberForm.patchValue({ email: memberEmail });
    
    component.memberFormSubmitted.subscribe((data) => {
      expect(data.email).toBe(memberEmail);
      done();
    });

    component.onSubmit();
  });

  it('should not emit when form is invalid', () => {
    let emitted = false;
    component.memberFormSubmitted.subscribe(() => {
      emitted = true;
    });

    component.onSubmit();
    expect(emitted).toBeFalsy();
  });

  it('should reset form after submission', () => {
    component.memberForm.patchValue({ email: 'test@example.com' });
    component.onSubmit();
    expect(component.memberForm.get('email')?.value).toBeNull();
  });

  it('should validate email format', () => {
    const emailControl = component.memberForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });
});