using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using TimeReport.Data.Contract;

namespace TimeReport.Data
{
    public class UowFactory : IUowFactory
    {
        private IUnityContainer _unityContainer;

        public UowFactory(IUnityContainer container)
        {
            _unityContainer = container;
        }

        public ITimeReportUow GetUow()
        {
            return _unityContainer.Resolve<ITimeReportUow>();
        }
    }
}
