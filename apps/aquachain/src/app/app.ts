import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { Navbar } from './components/navbar/navbar';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [RouterModule, FontAwesomeModule, Navbar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'AquaChain';

  constructor() {
    const library = inject(FaIconLibrary);
    library.addIconPacks(fas);
  }
}
