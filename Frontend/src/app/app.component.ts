import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // standalone: true,   // <-- This is crucial for standalone components
  // imports: [RouterOutlet, TranslateService]  // <-- Import RouterOutlet for routing to work
})
export class AppComponent implements OnInit {
  title = 'RS1 - 2024-25 - template 1';
  //
  constructor(private router: Router,private translateService: TranslateService) {

    this.translateService.setDefaultLang('en');
    this.translateService.use(localStorage.getItem('lang') || 'en');
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scrolls to the top
      }
    });
  }
}
