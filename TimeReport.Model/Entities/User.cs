using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace TimeReport.Model.Entities
{
    public class User : IdentityUser
    {
        public virtual ICollection<DayReport> DayReports { get; set; }

        public DateTime? DefaultStartWork { get; set; }
        public DateTime? DefaultStartLunch { get; set; }
        public DateTime? DefaultEndLunch { get; set; }
        public DateTime? DefaultEndWork { get; set; }

        public int VacationDays { get; set; }
    }
}
