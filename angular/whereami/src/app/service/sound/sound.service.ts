import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService, VOLUME } from '../settings/settings.service';

export interface SoundResult {
  audio: HTMLAudioElement,
  promise: Promise<void>
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  errorHandler = (v:any) =>{};

  constructor(private settingsService: SettingsService) { }

  pin(): SoundResult {
    return this.play('/assets/sound/pin.mp3');
  }

  private play(fileName: string): SoundResult {
    const audio = new Audio(fileName);
    audio.volume = this.settingsService.load(VOLUME);
    return {audio: audio, promise: audio.play().catch(this.errorHandler)};
  }

  arrive(): SoundResult {
    return this.play('/assets/sound/arrive.mp3');
  }

  complete(): SoundResult {
    return this.play('/assets/sound/CCLicensed/complete.wav');
  }

  start(): SoundResult {
    return this.play('/assets/sound/CCLicensed/start.wav');
  }

  tenSeconds(prematureEndObservable: Observable<any>) {
    const result = this.play('/assets/sound/10sCountdown.mp3');
    prematureEndObservable.subscribe(() => result.audio.pause());
    return result;
  }

  score(score: number, max:number): SoundResult | void {
    if(score > max * 0.99) {
      return this.play('/assets/sound/wow.mp3');
    } else if (score >= max * 0.9) {
      return this.play('/assets/sound/CCLicensed/good.mp3');
    } else if (score < max * 0.1) {
      return this.play('/assets/sound/disappointed.wav');
    }
  }
}
