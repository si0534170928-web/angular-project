import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { ActionButton } from '../../../shared/components/action-button/action-button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-design-showcase',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTableModule,
    ActionButton,
    FormsModule
  ],
  templateUrl: './design-showcase.html',
  styleUrl: './design-showcase.css'
})
export class DesignShowcase {
  selectedValue = signal('');
  inputValue = signal('');
  progressValue = signal(65);
  
  // Add Math reference for template
  Math = Math;
  
  chipsList = [
    { name: 'Angular', selected: true },
    { name: 'Material', selected: false },
    { name: 'TypeScript', selected: true },
    { name: 'SCSS', selected: false }
  ];
  
  tableData = [
    { position: 1, name: 'Task Planning', status: 'In Progress', priority: 'High' },
    { position: 2, name: 'Design Review', status: 'Completed', priority: 'Medium' },
    { position: 3, name: 'Code Review', status: 'Pending', priority: 'High' },
    { position: 4, name: 'Testing', status: 'In Progress', priority: 'Low' }
  ];
  
  displayedColumns = ['position', 'name', 'status', 'priority'];

  onButtonClick(buttonType: string) {
    console.log(`${buttonType} button clicked!`);
  }
}