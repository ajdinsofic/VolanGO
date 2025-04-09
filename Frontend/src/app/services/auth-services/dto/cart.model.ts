export interface CartItem {
    name: string;
    image: string;
    pricePerDay: number;
    description: CartItemDescription;
    userId: number;
    vehicleId: number;
    locationId: number;
}
  
export interface CartItemDescription {
    PickUpDate: string;
    DropOffDate: string;
    CountDays: number;
}