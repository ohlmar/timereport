using System.Web.Http;
using Microsoft.Practices.Unity;
using TimeReport.Business.Contract.Managers;
using TimeReport.Business.Managers;
using TimeReport.Data;
using TimeReport.Data.Contract;

namespace Tidrapport.Configuration
{
    public class UnityConfiguration
    {
        public static void Configure(HttpConfiguration config)
        {
            var container = new UnityContainer();

            container.RegisterType<IUowFactory, UowFactory>();
            container.RegisterType<ITimeReportUow, TimeReportUow>();

            container.RegisterType<ICalculationManager, CalculationManager>();

        }
    }
}