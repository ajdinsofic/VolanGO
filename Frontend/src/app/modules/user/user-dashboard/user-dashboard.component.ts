// import { Component } from '@angular/core';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import * as jwt_decode from 'jwt-decode';
import { RequestUser } from '../dto/user';
import { Component, ElementRef, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {MyConfig} from '../../../my-config';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  userInfo: any = {};
  userUpdate: RequestUser | undefined

  isModalOpen = false;
  enteredCode = '';
  message = '';
  phoneNumber = '';
  isCodeSent= false;
  is2FAEnabled = false;

  constructor(private authService: MyAuthService,private http: HttpClient){}

  ngOnInit(): void {
    this.getUserDetails();

    const userId = this.getUserIdFromCookie();
  if (!userId) {
    console.error('User ID not found.');
    return;
  }// Replace with actual user ID

  this.http.get(`${this.apiUrl}/api/users/profile-picture/${userId}`, { responseType: 'blob' })
    .subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImage = reader.result as string; // Convert blob to Data URL
          console.log('Profile picture loaded successfully');
        };
        reader.readAsDataURL(blob);
      },
      error: () => {
        console.log('No profile picture found or failed to load.');
        this.profileImage = 'http://bootdey.com/img/Content/avatar/avatar1.png'; // Default image
      }
    });
  }

  getUserDetails() {
    this.authService.getUserInfo(this.getEmailFromToken()).subscribe({
      next: (response) => {
        if (response.success) {  
          this.userInfo = response.user;
        } else {
          console.error('Failed to fetch user info:', response.message);
        }
      },
      error: (err) => {
        console.error('An error occurred while fetching user data:', err);
      }
    });


  }

  getEmailFromToken(): string {
      var accessToken = this.authService.getAccessToken();
      if (!accessToken) {
        return " ";
      }

      try {
        // Dekodiranje JWT tokena
        const decoded: any = jwt_decode.jwtDecode(accessToken);

        // Pretpostavimo da je email u claim-u 'email'
        return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
        ;  // Ako je ime ključa drugačije, zamijenite sa stvarnim imenom
      } catch (error) {
        console.error('Error decoding token', error);
        return " ";
      }
    }
    
    Save() {
      this.userUpdate = {
        userId: this.userInfo.userId,          // Dodeljujemo vrednost userId iz userInfo
        email: this.userInfo.email,             // Dodeljujemo vrednost email iz userInfo
        username: this.userInfo.username,       // Dodeljujemo vrednost username iz userInfo
        firstName: this.userInfo.firstName,     // Dodeljujemo vrednost firstName iz userInfo
        lastName: this.userInfo.lastName,       // Dodeljujemo vrednost lastName iz userInfo
        gender: this.userInfo.gender,           // Dodeljujemo vrednost gender iz userInfo
        phoneNumber: this.userInfo.phoneNumber, // Dodeljujemo vrednost phoneNumber iz userInfo
        dateOfBirth: this.userInfo.dateOfBirth, // Dodeljujemo vrednost dateOfBirth iz userInfo
      }
    
      this.authService.SaveChanges(this.userUpdate).subscribe((response) => {
        console.log(response);
        // Ažuriraj korisničke podatke bez osvežavanja stranice
        this.userInfo = { ...this.userUpdate };  // Ažuriranje podataka u userInfo
        window.location.reload();  
      }, (error) => {
        console.error("Greška pri slanju podataka:", error);
      });
      window.location.reload();
    }
    open2FAModal(): void {
      this.isModalOpen = true;
      const phoneNumberWithCountryCode = "+387" + this.userInfo.phoneNumber;
      this.authService.sendCode(phoneNumberWithCountryCode).subscribe({
        next: () => {
          this.message = 'Code sent successfully!';
          this.isCodeSent = true;
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to send WhatsApp code.';
        },
      });
    }

    closeModal(): void {
      this.isModalOpen = false;
      this.enteredCode = '';
      this.message = '';
      this.showModal = false;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = undefined;  // Clear the cropper instance
      }
    }



    verifyCode(): void {
      if(!this.enteredCode){
        this.message = 'Verification code is required!';
        return;
      }
      const phoneNumberWithCountryCode = "+387" + this.phoneNumber;
      this.authService.verifySentCode(phoneNumberWithCountryCode, this.enteredCode).subscribe({
        next: () => {
          this.message = '2FA enabled successfully!';
          this.is2FAEnabled = true;
          this.isCodeSent = false;
          setTimeout(() => {
            this.closeModal();
          }, 2000);
        },
        error: (err) => {
          this.message = err.error?.message || 'Invalid or expired code.';
        },
      });


    }


  profileImage: string = 'http://bootdey.com/img/Content/avatar/avatar1.png';
  showModal: boolean = false;
  cropper: Cropper | undefined;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('cropImage') cropImage: ElementRef | undefined;

  private apiUrl = `${MyConfig.api_address}`;




  openFileSelector(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = e.target.result;
        this.showModal = true;  // Show the modal
        setTimeout(() => {      // Wait for modal rendering
          this.initializeCropper(img);
        }, 0);
      };
      reader.readAsDataURL(file);
    }
  }

  initializeCropper(imageSrc: string): void {
    // Destroy previous cropper instance if it exists
    if (this.cropper) {
      this.cropper.destroy();
    }

    const imageElement = this.cropImage?.nativeElement;
    if (imageElement) {
      imageElement.src = imageSrc;
      this.cropper = new Cropper(imageElement, {
        aspectRatio: 1,  // Circular crop (1:1 aspect ratio)
        viewMode: 2,
        preview: '.crop-preview',
        cropBoxResizable: true,
        cropBoxMovable: true,
        ready: () => {
          // Apply circular shape to the crop box and preview image after cropper is ready
          const cropBox = document.querySelector('.cropper-crop-box') as HTMLElement;
          const preview = document.querySelector('.crop-preview') as HTMLElement;

          if (cropBox) {
            cropBox.style.borderRadius = '50%';  // Make the crop area circular
          }

          if (preview) {
            preview.style.borderRadius = '50%';  // Apply the circle to the preview as well
          }
        }
      });
    }
  }





  // promjeno
  saveCroppedImage(): void {
    const userId = this.getUserIdFromCookie();
    if (!userId) {
      console.error('User ID not found.');
      return;
    }

    if (this.cropper) {
      const canvas = this.cropper.getCroppedCanvas();
      const imageData = canvas.toDataURL('image/png'); // Get base64 data
      const base64Image = imageData.split(',')[1]; // Remove the 'data:image/png;base64,' prefix


      // Upload the cropped image to the backend
      this.http.post(`http://localhost:5136/api/users/upload-profile-picture/${userId}`, { imageData: base64Image })
        .subscribe({
          next: () => {
            console.log('Image uploaded successfully');

            // Fetch and update the profile picture after a successful upload
            this.http.get(`http://localhost:5136/api/users/profile-picture/${userId}`, { responseType: 'blob' })
              .subscribe({
                next: (blob: Blob) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    this.profileImage = reader.result as string; // Update the image source dynamically
                    console.log('Profile image updated immediately');

                    // Close the modal only after the image is updated
                    this.closeModal();
                  };
                  reader.readAsDataURL(blob);
                },
                error: (err) => {
                  console.error('Error fetching profile image:', err);
                  alert('Failed to update the profile picture. Please refresh the page.');
                }
              });
          },
          error: (err) => {
            console.error('Error uploading image:', err);
            alert('Error uploading image. Please try again.');
          }
        });
    }
  }


  updateProfileImage(userId: number): void {
    this.http.get(`http://localhost:5136/api/users/profile-picture/${userId}`, { responseType: 'blob' })
      .subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.profileImage = reader.result as string; // Update the image source dynamically
            console.log('Profile image updated immediately');
          };
          reader.readAsDataURL(blob);
        },
        error: (err) => {
          console.error('Error fetching profile image:', err);
        }
      });
  }







  getUserIdFromCookie(): number | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'userId') {
        return parseInt(value, 10); // Convert userId to number
      }
    }
    return null;
  }

}
