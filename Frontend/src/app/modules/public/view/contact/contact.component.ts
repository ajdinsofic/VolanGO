import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  subject: string = '';
  message: string = '';

  SubmitForm() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.subject = '';
    this.message = '';

    alert("Poruka zaprimljena, odgovor cete dobiti na vas mail, vas VolanGO tim")

    // Možeš dodati validaciju ili slanje podataka ovde
  }
}
