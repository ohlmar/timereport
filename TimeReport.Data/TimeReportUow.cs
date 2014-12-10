using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeReport.Data.Contract;
using TimeReport.Data.Contract.Repositories;
using TimeReport.Data.Repositories;
using TimeReport.Model.Entities;

namespace TimeReport.Data
{
    public class TimeReportUow : ITimeReportUow
    {
        private TimeReportDbContext DbContext { get; set; }

        private IRepository<User> _userRepository;
        private IRepository<DayReport> _dayReportRepository;

        public IRepository<User> UserRepository
        {
            get { return _userRepository ?? (_userRepository = new BaseRepository<User>(DbContext)); }
            set { _userRepository = value; }
        }

        public IRepository<DayReport> DayReportRepository
        {
            get { return _dayReportRepository ?? (_dayReportRepository = new BaseRepository<DayReport>(DbContext)); }
            set { _dayReportRepository = value; }
        }

        public TimeReportUow()
        {
            CreateDbContext();
        }

        protected void CreateDbContext()
        {
            DbContext = new TimeReportDbContext();
        }

        public void Commit()
        {
            DbContext.SaveChanges();
        }

        public void Dispose()
        {
            if (DbContext != null)
            {
                DbContext.Dispose();
                DbContext = null;
            }
        }
    }
}
