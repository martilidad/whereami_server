import { Pipe, PipeTransform } from '@angular/core';

import { AUTOSTART, GHOST, REACTIONS, SettingsService, VOLUME } from './settings.service';

@Pipe({
  name: 'settings',
  pure: false
})
export class SettingsPipe implements PipeTransform {

  volume: number = VOLUME.initial
  autostart: boolean = AUTOSTART.initial
  ghost: boolean = GHOST.initial
  reactions: boolean = REACTIONS.initial
  constructor(private settingsService: SettingsService) {
    settingsService.load$(VOLUME).subscribe(volume => this.volume = volume)
    settingsService.load$(AUTOSTART).subscribe(autostart => this.autostart = autostart)
    settingsService.load$(GHOST).subscribe(ghost => this.ghost = ghost)
    settingsService.load$(REACTIONS).subscribe(reactions => this.reactions = reactions)
  }

  //pipe needs to bind to at least some value
  transform(val: any) {
    return {
      volume: this.volume,
      autostart: this.autostart,
      ghost: this.ghost,
      reactions: this.reactions
    }
  }
}
