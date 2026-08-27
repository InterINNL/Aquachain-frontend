import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-mosaic',
  templateUrl: './mosaic.html',
  styleUrl: './mosaic.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoMosaic {
  readonly photos = interinnlContent.mosaicPhotos;
}
