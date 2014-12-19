using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeReport.Business.Contract.Managers;
using TimeReport.Data.Contract;

namespace TimeReport.Business.Managers
{
    public class CalculationManager : ICalculationManager
    {
        private readonly IUowFactory _uowFactory;

        public CalculationManager(IUowFactory uowFactory)
        {
            _uowFactory = uowFactory;
        }

        public double CalculateFlex(string userId)
        {
            return CalculateFlex(userId, null, null);
        }

        public double CalculateFlex(string userId, DateTime? startDate, DateTime? endDate)
        {
            using (var uow = _uowFactory.GetUow())
            {
                var query = uow.DayReportRepository.GetAll().Where(x => x.UserId == userId && !x.IsVacation);

                if (startDate.HasValue)
                {
                    query = query.Where(x => DbFunctions.TruncateTime(x.Day) >= DbFunctions.TruncateTime(startDate));
                }

                if (endDate.HasValue)
                {
                    query = query.Where(x => DbFunctions.TruncateTime(x.Day) <= DbFunctions.TruncateTime(endDate));
                }

                var reports = query.ToList();

                return reports.Where(x => x.TotalWork != null).Sum(x => x.TotalWork.Value - 8);
            }
        }

        public List<double> GetFlexForInterval(string userId, DateTime startDate, DateTime endDate)
        {
            using (var uow = _uowFactory.GetUow())
            {
                var dayReports =
                    uow.DayReportRepository.GetAll()
                        .Where(x => x.UserId == userId && !x.IsVacation && DbFunctions.TruncateTime(x.Day) >= DbFunctions.TruncateTime(startDate) && DbFunctions.TruncateTime(x.Day) <= DbFunctions.TruncateTime(endDate))
                        .ToList();

                var totalDays = (endDate - startDate).TotalDays;
                var flexList = new List<double>();
                
                for (var i = 0; i < totalDays; i++)
                {
                    var day = dayReports.FirstOrDefault(x => x.Day.Date == startDate.AddDays(i).Date);
                    if (day != null)
                    {
                        flexList.Add(day.TotalWork.Value - 8);
                    }
                    else
                    {
                        flexList.Add(0);    
                    }
                }

                return flexList;
            }
        }
    }
}
