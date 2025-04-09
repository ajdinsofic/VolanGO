import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface TeamMember {
  name: string;
  profession: string;
  img: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  delay: string; // Animation delay
}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],  // Corrected styleUrls
  // standalone: true,
  // imports: [
  //   CommonModule// Add JsonPipe
  // ]
})

// implements OnInit
export class TeamsComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Martin Doe',
      profession: 'SUPPORT_SPECIALIST',
      img: '/assets/img/team-1.jpg',
      socialLinks: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
      delay: '0.1s',
    },
    {
      name: 'Jane Smith',
      profession: 'CUSTOMER_MANAGER',
      img: '/assets/img/team-2.jpg',
      socialLinks: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
      delay: '0.3s',
    },
    {
      name: 'John Brown',
      profession: 'TECHNICAL_SUPPORT',
      img: '/assets/img/team-3.jpg',
      socialLinks: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
      delay: '0.5s',
    },
    {
      name: 'Lisa White',
      profession: 'BILLING_SPECIALIST',
      img: '/assets/img/team-4.jpg',
      socialLinks: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
      delay: '0.7s',
    }
  ];

  data: any;
  errorMessage: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    const apiUrl = 'http://localhost:5136/api/Persons/proba';  // Replace with your Swagger API URL
    this.httpService.get<any>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response);  // Log the response
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.errorMessage = error.message;
      }
    );

  }
}
