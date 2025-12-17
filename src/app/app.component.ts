import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TabsComponent } from './tabs/tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, TabsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  darkmode = false;

  toggleDarkmode(value: boolean) {
    this.darkmode = value;
  }
}
