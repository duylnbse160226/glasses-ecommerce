using System;

namespace Domain;

public class ActivityAttendee
{
    //Composite key (UserId, ActivityId) is can not null because they are part of primary key of the table
    public Guid UserId { get; set; }
    //(null! - null-forgiving operator) tell to compiler that we are sure this property will not be null
    //and avoid warning of nullable reference type
    public User User { get; set; } = null!;
    public Guid ActivityId { get; set; }
    public Activity Activity { get; set; } = null!;
    public bool IsHost { get; set; }
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    
}
