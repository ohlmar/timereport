using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeReport.Data.Contract
{
    public interface IUowFactory
    {
        ITimeReportUow GetUow();
    }
}
