import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatSlideToggleModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  darkmode = false;
  @Output() darkmodeChange = new EventEmitter<boolean>();

  toggleDarkMode() {
    this.darkmode = !this.darkmode;
    this.darkmodeChange.emit(this.darkmode);
  }
}
