using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TimeReport.Model;

namespace Tidrapport.ViewModels
{
    public class ResultViewModel
    {
        public object Data { get; set; }

        public List<Message> Messages { get; set; }

        public ResultViewModel()
        {
            Messages = new List<Message>();
        }
    }
}