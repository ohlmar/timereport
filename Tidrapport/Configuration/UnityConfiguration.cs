using System.Web.Http;
using Microsoft.Practices.Unity;
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

        }
    }
}