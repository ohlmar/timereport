using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeReport.Model.Entities
{
    public class DayReport
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }

        public DateTime Day { get; set; }

        public DateTime StartWork { get; set; }

        public DateTime StartLunch { get; set; }

        public DateTime EndLunch { get; set; }

        public DateTime EndWork { get; set; }

        public DateTime Created { get; set; }

        public DateTime? Updated { get; set; }
    }
}
