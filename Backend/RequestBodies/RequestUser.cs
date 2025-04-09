using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.RequestBodies
{
    public class RequestUser
    {
       public int UserId { get; set; }          // Dodeljujemo vrednost userId
       public string Email { get; set; }        // Dodeljujemo vrednost email
       public string Username { get; set; }     // Dodeljujemo vrednost username
       public string FirstName { get; set; }    // Dodeljujemo vrednost firstName
       public string LastName { get; set; }     // Dodeljujemo vrednost lastName
       public string Gender { get; set; }       // Dodeljujemo vrednost gender
       public string PhoneNumber { get; set; }  // Dodeljujemo vrednost phoneNumber
       public DateTime DateOfBirth { get; set; }
       public string Password {get; set;} // Dodeljujemo vrednost dateOfBirth

    }
}