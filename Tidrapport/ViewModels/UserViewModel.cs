using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tidrapport.ViewModels
{
    public class UserViewModel
    {
        public DateTime? DefaultStartWork { get; set; }
        public DateTime? DefaultStartLunch { get; set; }
        public DateTime? DefaultEndLunch { get; set; }
        public DateTime? DefaultEndWork { get; set; }
    }
}