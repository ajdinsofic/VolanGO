// DTO to hold authentication information
export interface MyAuthInfo {
  userId: number;
  username: string;
  firstName: string | undefined;
  lastName: string | undefined;
  isAdmin: boolean;
  isUser: boolean;
  isLoggedIn: boolean;
}

//  isManager: boolean;
// "Username": "Mismekinjas",
//   "FirstName": "Mis",
//   "LastName": "Mekinjas",
//   "PhoneNumber": "1234567890",
//   "Gender": "Female",
//   "Password": "Mis123!",
//   "Email": "mis@yahoo.com"
