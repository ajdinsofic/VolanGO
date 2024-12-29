export interface Reservation {
  ReservationId: number;
  UserId : number;
  VehicleID : number;
  LocationId : number;
  ReservationDate : Date;
  PickupDate : Date;
  DropoffDate: Date;
  TotalAmmount : number;
  Status :number;
}
