import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
} from "@angular/router";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
// Rutas con # para permitir recarga directa en GitHub Pages.
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
    ),
  ],
}).catch((error) => console.error("No se pudo iniciar Ecosfera", error));
