using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace TimeReport.Model.Entities
{
    public class User : IdentityUser
    {
        public virtual ICollection<DayReport> DayReports { get; set; } 
    }
}
