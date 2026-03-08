import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './action-button.html',
  styleUrl: './action-button.css'
})
export class ActionButton {
  // Input signals
  text = input<string>('Click Me');
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  icon = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);
  
  // Output signals
  clicked = output<void>();

  onClick() {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
