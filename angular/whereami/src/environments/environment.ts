// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiInterceptor } from "src/app/service/api-interceptor";

export const environment = {
  production: false
};

export const ADDITIONAL_PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  }
];

/**
 * django runs on 8000 in development mode
 * use null for window.location.hostname
 */
export const BACKEND_HOST: string | null = "localhost:8000";

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
