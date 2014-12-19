using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Microsoft.Practices.Unity;
using Tidrapport.Configuration;
using TimeReport.Business.Contract.Managers;
using TimeReport.Business.Managers;
using TimeReport.Data;
using TimeReport.Data.Contract;

namespace Tidrapport
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Configure Unity
            GlobalConfiguration.Configure(ConfigureUnity);

            // Configure AutoMapper
            AutoMapperConfiguration.Configure();
        }

        public static void ConfigureUnity(HttpConfiguration config)
        {
            var container = new UnityContainer();

            container.RegisterType<IUowFactory, UowFactory>();
            container.RegisterType<ITimeReportUow, TimeReportUow>();
            container.RegisterType<ICalculationManager, CalculationManager>();


            ControllerBuilder.Current.SetControllerFactory(new UnityControllerFactory(container));
        }
    }
}
