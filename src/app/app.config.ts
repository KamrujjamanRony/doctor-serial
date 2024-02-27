import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { QueryClient, provideAngularQuery } from '@tanstack/angular-query-experimental';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()), provideHttpClient(withFetch()), provideAnimations(), provideAnimationsAsync(), provideAngularQuery(new QueryClient())]
};
