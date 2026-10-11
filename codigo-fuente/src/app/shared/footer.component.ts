import { PinComponent } from "./pin.component";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
@Component({
  selector: "app-footer",
  imports: [PinComponent, RouterLink],
  template: `<footer class="footer">
    <div class="shell footer-grid">
      <div>
        <a class="brand" routerLink="/"
          ><span class="brand-mark">◉</span> ECOSFERA</a
        >
        <p>
          Periodismo ambiental independiente. Ciencia, biodiversidad y turismo
          responsable para conocer y cuidar nuestro planeta.
        </p>
        <a class="footer-contact" routerLink="/contacto">Conversemos →</a>
      </div>
      <div>
        <strong>Secciones</strong
        ><a routerLink="/noticias" [queryParams]="{ categoria: 'Turismo' }"
          >Turismo sostenible</a
        ><a routerLink="/noticias" [queryParams]="{ categoria: 'Naturaleza' }"
          >Naturaleza y biodiversidad</a
        ><a routerLink="/noticias" [queryParams]="{ categoria: 'Ciencia' }"
          >Ciencia aplicada</a
        ><a routerLink="/noticias" [queryParams]="{ categoria: 'Conservación' }"
          >Conservación</a
        ><a routerLink="/gestion">Colabora con Ecosfera</a>
      </div>
      <div>
        <strong>Contacto editorial</strong>
        <p><app-pin /> Cra. 7 # 71–21, Torre B, piso 8<br />Bogotá, Colombia</p>
        <a href="mailto:redaccion@ecosfera.co">✉ redaccion@ecosfera.co</a
        ><a href="tel:+573028562890">☎ +57 (302) 856 2890</a
        ><small>© 2026 Ecosfera Magazine.</small>
      </div>
    </div>
  </footer>`,
})
export class FooterComponent {}
