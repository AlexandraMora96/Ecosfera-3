import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home.component";
import { NewsComponent } from "./pages/news.component";
import { DetailComponent } from "./pages/detail.component";
import { FavoritesComponent } from "./pages/favorites.component";
import { ManageComponent } from "./pages/manage.component";
import { ContactComponent } from "./pages/contact.component";
/** Cinco destinos principales y una ruta parametrizada para cada noticia. */
export const routes: Routes = [
  { path: "", component: HomeComponent, title: "Inicio | Ecosfera" },
  { path: "noticias", component: NewsComponent, title: "Noticias | Ecosfera" },
  {
    path: "noticia/:id",
    component: DetailComponent,
    title: "Detalle | Ecosfera",
  },
  {
    path: "favoritos",
    component: FavoritesComponent,
    title: "Favoritos | Ecosfera",
  },
  { path: "gestion", component: ManageComponent, title: "Gestión | Ecosfera" },
  {
    path: "contacto",
    component: ContactComponent,
    title: "Contacto | Ecosfera",
  },
  { path: "**", redirectTo: "" },
];
