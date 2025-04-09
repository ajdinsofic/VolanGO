import {CommonModule, DOCUMENT} from '@angular/common';
import {Component, ElementRef, HostBinding, Inject, OnInit, signal, HostListener } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';
import { Observable, window } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import { CartService } from '../../../../services/cart-services/cart-service';
import { Location } from '@angular/common';  // Uvezi Location

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  // standalone:true,
  // imports: [
  //   RouterLink,
  //   RouterLinkActive,
  //   NgbCollapseModule,
  //   CommonModule
  // ]
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  IsLog: any;
  isCar: any;

  darkMode =signal<boolean>(false);

  @HostBinding('class.dark') get mode(){
    return this.darkMode();
  }

  lang:string =''

  constructor(public authService: MyAuthService, private router: Router,  private translateService:TranslateService, @Inject(DOCUMENT) private document: Document, private cartService: CartService,
  private location: Location, private elementRef: ElementRef
){
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.IsLog = loggedIn;  // Dodeljujemo vrednost true/false
    });
  }

  ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'en';

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkMode.set(true);
      this.updateTheme(true);
    } else {
      this.darkMode.set(false);
      this.updateTheme(false);
    }
  }

  toggleTheme() {
    const isDark = !this.darkMode();
    this.darkMode.set(isDark);
    this.updateTheme(isDark);
  }

  private updateTheme(isDark: boolean) {
    const classList = this.document.documentElement.classList;
    if (isDark) {
      classList.add('dark'); // Applies all :root.dark styles
      localStorage.setItem('theme', 'dark');
    } else {
      classList.remove('dark'); // Reverts to light theme
      localStorage.setItem('theme', 'light');
    }
  }

  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;


    localStorage.setItem('lang', selectedLanguage);


    this.translateService.use(selectedLanguage);
  }

  

  cartItems = [
    {
      name: 'Car 1',
      description: 'Luxury car model',
      price: 100,
      quantity: 1,
      image: '/assets/img/car1.jpg'
    },
    {
      name: 'Car 2',
      description: 'Sports car model',
      price: 150,
      quantity: 2,
      image: '/assets/img/car2.jpg'
    }
  ];

  // Function to calculate total price
  totalPrice() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Function to calculate tax (10% for example)
  totalTax() {
    return this.totalPrice() * 0.10;
  }

  // Function to update quantity
  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(index);
    } else {
      this.cartItems[index].quantity = quantity;
    }
  }

  // Function to remove an item from the cart
  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  // Checkout function (placeholder)
  checkout() {
    console.log('Proceeding to checkout...');
    // Implement checkout logic here
  }

  GenerateCart() {
    this.router.navigate([], {queryParams: {cartOption: 'true'}})
  }

  goForward() {
    this.location.forward();
  }

  goBackward() {
    this.location.back();
  }
}
