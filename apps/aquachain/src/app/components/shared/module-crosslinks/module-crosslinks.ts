import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { aquachainContent, ModuleHeroKey } from '../../../content';

@Component({
  selector: 'module-crosslinks',
  imports: [RouterModule],
  templateUrl: './module-crosslinks.html',
  styleUrl: './module-crosslinks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleCrosslinks {
  readonly current = input.required<ModuleHeroKey>();
  readonly links = aquachainContent.moduleLinks;

  visibleLinks() {
    return this.links.filter((link) => link.key !== this.current());
  }
}
