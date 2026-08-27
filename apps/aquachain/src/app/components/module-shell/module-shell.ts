import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { aquachainContent, ModuleHero, ModuleHeroKey } from '../../content';
import { ModuleCrosslinks } from '../shared/module-crosslinks/module-crosslinks';

@Component({
  selector: 'module-shell',
  imports: [ModuleCrosslinks],
  templateUrl: './module-shell.html',
  styleUrl: './module-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleShell {
  readonly moduleKey = input.required<ModuleHeroKey>();
  readonly content = aquachainContent;

  hero(): ModuleHero {
    return this.content.moduleHeroes[this.moduleKey()];
  }

  photoObjectPosition(): string {
    return this.hero().photo.objectPosition ?? 'center';
  }
}
