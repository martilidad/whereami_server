import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DefinedPropertyKey, SettingsService } from '../service/settings/settings.service';

@Directive({
  selector: '[appCheckBoxSetting]'
})
export class CheckBoxSettingDirective {
  @Input() configKey?: 'autostart' | 'ghost' | 'reactions';

  constructor(
    private settingsService: SettingsService,
    private el: ElementRef<HTMLInputElement>
  ) {}

  ngOnInit() {
    if (!this.configKey) {
      throw new Error('Missing required configKey input on appSaveCheckboxValue directive');
    }
    this.settingsService.loadFromKey$(this.configKey).subscribe(value => {
      this.el.nativeElement.checked = value as boolean;
    });
  }

  @HostListener('click', ['$event.target'])
  onClick(checkbox: HTMLInputElement) {
    this.settingsService.saveForKey(checkbox.checked, this.configKey!);
  }

}
