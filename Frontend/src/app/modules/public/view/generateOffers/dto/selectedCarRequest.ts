export interface SelectedCarRequest{
    vehicleId: number,
    name: string,
    image: string,
    pricePerDay: number,
    accessToken: string | null
    PickUpDate: string
    DropOffDate: string
    locationId: number
    userId: number
}