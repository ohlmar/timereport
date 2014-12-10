using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeReport.Data.Contract.Repositories;
using TimeReport.Model.Entities;

namespace TimeReport.Data.Contract
{
    public interface ITimeReportUow : IDisposable
    {
        IRepository<User> UserRepository { get; set; }
        IRepository<DayReport> DayReportRepository { get; set; }

        void Commit();
    }
}
