using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeReport.Business.Contract.Managers
{
    public interface ICalculationManager
    {
        double CalculateFlex(string userId);

        double CalculateFlex(string userId, DateTime? startDate, DateTime? endDate);

        List<double> GetFlexForInterval(string userId, DateTime startDate, DateTime endDate);
    }
}
