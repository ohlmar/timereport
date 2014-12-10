using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Tidrapport.ViewModels;
using TimeReport.Data.Contract;
using TimeReport.Model.Entities;

namespace Tidrapport.Controllers
{
    [Authorize]
    public class TimeReportController : Controller
    {
        private readonly IUowFactory _uowFactory;

        public TimeReportController(IUowFactory uowFactory)
        {
            _uowFactory = uowFactory;
        }

        public JsonResult Post(DayReportViewModel model)
        {
            var result = new ResultViewModel();

            var mappedModel = Mapper.Map<DayReport>(model);
            mappedModel.UserId = User.Identity.GetUserId();

            using (var uow = _uowFactory.GetUow())
            {
                var dayReportFromDb = uow.DayReportRepository.GetById(mappedModel.Id);
                if (dayReportFromDb != null)
                {
                    dayReportFromDb.UserId = mappedModel.UserId;
                    dayReportFromDb.StartWork = mappedModel.StartWork;
                    dayReportFromDb.StartLunch = mappedModel.StartLunch;
                    dayReportFromDb.EndLunch = mappedModel.EndLunch;
                    dayReportFromDb.EndWork = mappedModel.EndWork;
                    dayReportFromDb.Updated = DateTime.UtcNow;

                    uow.DayReportRepository.Update(dayReportFromDb);
                }
                else
                {
                    mappedModel.Created = DateTime.UtcNow;
                    uow.DayReportRepository.Add(mappedModel);
                }

                uow.Commit();
            }

            return Json(result);
        }

        public JsonResult GetForDay(DateTime day)
        {
            var result = new ResultViewModel();



            return Json(result);
        }
    }
}