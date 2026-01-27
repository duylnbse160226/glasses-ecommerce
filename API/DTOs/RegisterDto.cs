using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    //We're also not going to use fluent validation here.
    //Because We're going to have a different system effectively for identity compared to 
    // what we're doing with the rest of our app.
    // And because we want our controller to handle the validation for this, then we'll just use data annotations
    [Required]
    public string DisplayName { get; set; } = ""; // Default value of string is null. If we are not give it initial value is ""
    //So you will not have a standard error, the error is Json serialization (because null) instead of is required
    //The user won't be able to send up an empty string and pass validation because Required attribute are not allowed
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    //Required attribute in here is a bit pointless 
    //because asp identity is enforce a complex password for the password
    public string Password { get; set; } = "";
}
