import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SelectedCarRequest } from '../../modules/public/view/generateOffers/dto/selectedCarRequest';
import { MyConfig } from '../../my-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartItem } from '../auth-services/dto/cart.model';
@Injectable({
  providedIn: 'root'  // Ovdje je ključna linija koja registruje servis globalno
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  isCartOpen: any;
  http: any;
  apiUrl = `${MyConfig.api_address}`



  constructor(private route: ActivatedRoute, private router: Router, private httpClient: HttpClient) {}

  addToCart(item: any) {
    const currentCart = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentCart, item]);
  }

  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  removeFromCart(item: any) {
    const currentCart = this.cartItemsSubject.value.filter(cartItem => cartItem !== item);
    this.cartItemsSubject.next(currentCart);
  }

  AddToCart(item: any) {
    const currentCart = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentCart, item]); // Dodaje novi objekat u korpu
  }

  CartOpen(): boolean {
    this.route.queryParams.subscribe((params) =>{
      if(params['cartOption'] === 'true'){
        this.isCartOpen = true;
      };
    })
    return this.isCartOpen;
  }

  closeCart() {
  // Set this.isCartOpen to false
  this.isCartOpen = false;
  // Update the query parameter 'cartOption' to 'false' in the URL
  this.updateUrlParam('false');
  }

  private updateUrlParam(cartOptionValue: string) {
  this.route.queryParams.subscribe((params) => {
    const updatedParams = { ...params, cartOption: cartOptionValue };

    // Navigate to update the URL without refreshing the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedParams,
      queryParamsHandling: 'merge', // Keeps other query parameters intact
    });
  });
 }

 saveToDataBase(selectedCar: SelectedCarRequest) {
  const headers = {
    'Content-Type': 'application/json'
  };
  return this.httpClient.post(`${this.apiUrl}/post/cartOption`, selectedCar, { headers });
 }

 deleteFromDatabase(selectedCar: SelectedCarRequest) {
  return this.httpClient.delete(`${this.apiUrl}/delete/cartOption`, {
    body: selectedCar
  });
 }
 
 getCartOptions(accessToken: string | null) {
  if (accessToken != null) {
    const params = new HttpParams().set('accessToken', accessToken); // Use HttpParams to set the query parameter
    return this.httpClient.get<any>(`${this.apiUrl}/get/cartOption`, { params });  // Pass params in the request options
  }
  return;
 }

 postCarsToStripe(cartItems: CartItem[]){
  return this.httpClient.post<{ url: string }>(`${this.apiUrl}/api/stripe/create-checkout-session-for-cart`, cartItems);
 }



 
}
