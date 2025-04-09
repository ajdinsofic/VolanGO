import { Component, OnInit } from '@angular/core';
import {LocationsService} from '../../../services/locations.service';
import {Location} from '../../../services/auth-services/dto/location.model';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];
  filters = { address: '', city: '', country: '' };

  adding = false;
  editing = false;

  currentLocation: Location = {
    locationId: 0,
    address: '',
    city: '',
    postalCode: '',
    country: '',
    latitude: 0,
    longitude: 0,
  };

  constructor(private locationsService: LocationsService) {}

  ngOnInit() {
    this.fetchLocations();
  }

  fetchLocations() {
    this.locationsService.getAll().subscribe((data: Location[]) => {
      this.locations = data;
    });
  }

  addLocation() {
    this.adding = true;
    this.editing = false;
    this.currentLocation = {
      locationId: 0,
      address: '',
      city: '',
      postalCode: '',
      country: '',
      latitude: 0,
      longitude: 0,
    };
  }

  editLocation(location: Location) {
    this.editing = true;
    this.adding = false;
    this.currentLocation = { ...location };
  }

  save() {
    if (this.editing) {
      this.locationsService
        .update(this.currentLocation.locationId, this.currentLocation)
        .subscribe(() => this.handleSuccess());
    } else {
      this.locationsService
        .create(this.currentLocation)
        .subscribe(() => this.handleSuccess());
    }
  }

  deleteLocation(id: number) {
    this.locationsService.delete(id).subscribe(() => this.fetchLocations());
  }

  handleSuccess() {
    this.adding = false;
    this.editing = false;
    this.fetchLocations();
  }

  cancel() {
    this.adding = false;
    this.editing = false;
  }

  search() {
    this.locationsService.getAll().subscribe((data: Location[]) => {
      this.locations = data.filter(
        (loc) =>
          loc.address.includes(this.filters.address) &&
          loc.city.includes(this.filters.city) &&
          loc.country.includes(this.filters.country)
      );
    });
  }

  clearFilters() {
    this.filters = { address: '', city: '', country: '' };
    this.fetchLocations();
  }
}
