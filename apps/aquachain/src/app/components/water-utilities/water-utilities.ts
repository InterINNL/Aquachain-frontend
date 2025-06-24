import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'water-utilities',
  imports: [CommonModule],
  templateUrl: './water-utilities.html',
  styleUrl: './water-utilities.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterUtilities {}
