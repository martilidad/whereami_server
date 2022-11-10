import { Component, OnInit } from '@angular/core';
import { AUTOSTART, SettingsService, VOLUME } from 'src/app/service/settings/settings.service';
import { SoundService } from 'src/app/service/sound/sound.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  volume:number;
  autoStart:boolean;

  constructor(private settingsService: SettingsService,
    private soundService: SoundService,
    public userService: UserService) { 
    this.volume = settingsService.load(VOLUME);
    this.autoStart = settingsService.load(AUTOSTART);
  }

  ngOnInit(): void {
  }

  volumeHandler() {
    this.settingsService.save(this.volume, VOLUME);
    this.soundService.complete();
  }

  autoStartHandler() {
    this.settingsService.save(this.autoStart, AUTOSTART);
  }

}
