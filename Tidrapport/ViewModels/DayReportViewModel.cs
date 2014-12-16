using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tidrapport.ViewModels
{
    public class DayReportViewModel
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public DateTime Day { get; set; }

        public bool IsVacation { get; set; }

        public DateTime? StartWork { get; set; }

        public DateTime? StartLunch { get; set; }

        public DateTime? EndLunch { get; set; }

        public DateTime? EndWork { get; set; }

        public double? TotalWork { get; set; }

        public DateTime Created { get; set; }
    }
}