import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from './footer/footer';
import { Nav } from './nav/nav';

@Component({
  imports: [RouterModule, Nav, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
