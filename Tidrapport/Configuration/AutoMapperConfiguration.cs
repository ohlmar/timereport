using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Tidrapport.ViewModels;
using TimeReport.Model.Entities;

namespace Tidrapport.Configuration
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile(new DayReportProfile());
                cfg.AddProfile(new UserProfile());
            });
        }

        public class DayReportProfile : Profile
        {
            protected override void Configure()
            {
                Mapper.CreateMap<DayReport, DayReportViewModel>();
                Mapper.CreateMap<DayReportViewModel, DayReport>();
            }
        }

        public class UserProfile : Profile
        {
            protected override void Configure()
            {
                Mapper.CreateMap<User, UserViewModel>();
                Mapper.CreateMap<UserViewModel, User>();
            }
        }
    }
}