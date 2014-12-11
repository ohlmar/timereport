using System;
using System.Collections.Generic;
using System.Data.Entity;
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
                var dayReportFromDb = uow.DayReportRepository.GetAll().FirstOrDefault(x => x.UserId == User.Identity.GetUserId() && DbFunctions.TruncateTime(model.Day) == DbFunctions.TruncateTime(x.Day));
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

            using (var uow = _uowFactory.GetUow())
            {
                var report = uow.DayReportRepository.GetAll().FirstOrDefault(x =>x.UserId == User.Identity.GetUserId() && DbFunctions.TruncateTime(day) == DbFunctions.TruncateTime(x.Day));
                
                result.Data = new
                {
                    Report = Mapper.Map<DayReportViewModel>(report)
                };
            }

            return Json(result);
        }

        public JsonResult Delete(int id)
        {
            var result = new ResultViewModel();

            using (var uow = _uowFactory.GetUow())
            {
                var report = uow.DayReportRepository.GetAll().FirstOrDefault(x => x.UserId == User.Identity.GetUserId() && x.Id == id);
                if (report != null)
                {
                    uow.DayReportRepository.Delete(report);
                    uow.Commit();
                }
            }

            return Json(result);
        }
    }
}