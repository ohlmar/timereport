using Microsoft.Owin;
using Owin;
using Tidrapport;

[assembly: OwinStartup(typeof(Startup))]
namespace Tidrapport
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
