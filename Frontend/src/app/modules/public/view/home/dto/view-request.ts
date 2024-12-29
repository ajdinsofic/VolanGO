export interface ViewRequest{
    selectedCar: string,
    PickUpDate: string,
    PickUp: string,
    DropOffDate: string,
    DropOff: string,
    PickUpTime: string,
    DropOffTime: string
}

export interface ViewRequestMaps {
    PickUp: string;
    DropOff: string;
    [key: string]: string;  // Ovaj index signature omogućava korišćenje bilo kog stringa kao ključa
  }