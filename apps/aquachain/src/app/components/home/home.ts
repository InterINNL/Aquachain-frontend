import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { aquachainContent } from '../../content';
import { PhotoCarousel } from '../photo-carousel/photo-carousel';

@Component({
  selector: 'home',
  imports: [FontAwesomeModule, PhotoCarousel, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly content = aquachainContent;
}
