import { InjectionToken } from '@angular/core';

/** Token that is used for getting stored URL to restore */
export const REDIRECT_URL: InjectionToken<string> = new InjectionToken('REDIRECT_URL');
