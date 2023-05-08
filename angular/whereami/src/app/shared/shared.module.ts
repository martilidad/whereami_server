import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckBoxSettingDirective } from './check-box-setting.directive';
import { DateElementDirective } from './date-element.directive';
import { FormatTimePipe } from './format-time.pipe';
import { PreviewMapComponent } from './preview-map/preview-map.component';
import { CoverageToggleComponent } from './coverage-toggle/coverage-toggle.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    CheckBoxSettingDirective,
    DateElementDirective,
    FormatTimePipe,
    PreviewMapComponent,
    CoverageToggleComponent,
  ],
  exports: [
    CheckBoxSettingDirective,
    DateElementDirective,
    FormatTimePipe,
    PreviewMapComponent,
    CoverageToggleComponent,
  ],
  imports: [CommonModule, GoogleMapsModule],
})
export class SharedModule {}
