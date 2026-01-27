using System;

namespace Application.Activities.DTOs;

public class BaseActivityDto
{
    //*********************Why using DataAnnotations instead of required modifier keyword**********************
    //Using DataAnnotations instead of required modifier keyword because the response error is better formatted

    //*********************Why using FluentValidation instead of DataAnnotations**********************
    //Using FluentValidation instead of DataAnnotations because FluentValidation is more powerful and flexible
    //Besides, DataAnnotations work rely on [ApiController] attribute in controller (API layer), it means that 
    // API layer not only handling responsibility for HTTP request/response but also handling validation responsibility.
    // This violate the Single Responsibility Principle of Clean Architecture in my project.
    // ====> So we use FluentValidation to handle validation in Business - Application layer.
 
    public string Title { get; set; } = "";
    //DateTime is a value type (struct) so don't get warning 
    //because c# give a default value of DateTime is 1/ January 0001 00:00:00
    public DateTime Date { get; set; }
    //string is a reference type so it can warning if it is null
    //we can use nullable reference type to avoid this warning
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    //location props
    public string City { get; set; } = "";
    //địa điểm 
    public string Venue { get; set; } = "";
    //vĩ độ
    //double | number is a value type and default value is 0
    public double Latitude { get; set; }
    //kinh độ
    public double Longitude { get; set; }
}
