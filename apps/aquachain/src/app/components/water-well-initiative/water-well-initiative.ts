import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'water-well-initiative',
  imports: [CommonModule],
  templateUrl: './water-well-initiative.html',
  styleUrl: './water-well-initiative.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterWellInitiative {}
