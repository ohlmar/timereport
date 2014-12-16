using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using TimeReport.Model;
using TimeReport.Model.Entities;

namespace TimeReport.Data
{
    public class TimeReportDbContext : IdentityDbContext<User>
    {
        public DbSet<DayReport> DayReports { get; set; }

        public TimeReportDbContext(): base("TimeReport")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

            modelBuilder.Entity<DayReport>().HasKey(x => x.Id);

            modelBuilder.Entity<DayReport>().HasRequired(x => x.User).WithMany(x => x.DayReports).HasForeignKey(x => x.UserId);

            modelBuilder.Entity<DayReport>().Property(x => x.TotalWork).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
        }
    }
}
