using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Tidrapport.ViewModels;
using TimeReport.Business.Contract.Managers;
using TimeReport.Data.Contract;
using TimeReport.Model;
using TimeReport.Model.Entities;

namespace Tidrapport.Controllers
{
    [Authorize]
    public class TimeReportController : Controller
    {
        private readonly IUowFactory _uowFactory;

        private readonly ICalculationManager _calculationManager;

        public TimeReportController(IUowFactory uowFactory, ICalculationManager calculationManager)
        {
            _uowFactory = uowFactory;
            _calculationManager = calculationManager;
        }

        public JsonResult Post(DayReportViewModel model)
        {
            var result = new ResultViewModel();

            var mappedModel = Mapper.Map<DayReport>(model);
            mappedModel.UserId = User.Identity.GetUserId();

            if (mappedModel.Day == DateTime.MinValue)
            {
                result.Messages.Add(new Message { Text = "DayReport.Day needs to have a value" });
                return Json(result);
            }

            if (mappedModel.IsVacation)
            {
                mappedModel.StartWork = null;
                mappedModel.StartLunch = null;
                mappedModel.EndLunch = null;
                mappedModel.EndWork = null;
            }

            //Validate that if IsVacation = false => all dates needs a value

            using (var uow = _uowFactory.GetUow())
            {
                var userId = User.Identity.GetUserId();
                var dayReportFromDb = uow.DayReportRepository.GetAll().FirstOrDefault(x => x.UserId == userId && DbFunctions.TruncateTime(model.Day) == DbFunctions.TruncateTime(x.Day));
                if (dayReportFromDb != null)
                {
                    dayReportFromDb.UserId = mappedModel.UserId;
                    dayReportFromDb.IsVacation = mappedModel.IsVacation;
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

                result.Data = new
                {
                    DayReport = Mapper.Map<DayReportViewModel>(dayReportFromDb ?? mappedModel)
                };
            }

            return Json(result);
        }

        public JsonResult GetDayReports(DateTime startDate, DateTime endDate)
        {
            var result = new ResultViewModel();

            using (var uow = _uowFactory.GetUow())
            {
                var userId = User.Identity.GetUserId();

                var reports = uow.DayReportRepository.GetAll().Where(x => x.UserId == userId && DbFunctions.TruncateTime(x.Day) >= DbFunctions.TruncateTime(startDate) && DbFunctions.TruncateTime(x.Day) <= DbFunctions.TruncateTime(endDate));

                result.Data = new
                {
                    Reports = Mapper.Map<List<DayReportViewModel>>(reports)
                };
            }

            return Json(result);
        }

        public JsonResult Delete(int id)
        {
            var result = new ResultViewModel();

            using (var uow = _uowFactory.GetUow())
            {
                var userId = User.Identity.GetUserId();

                var report = uow.DayReportRepository.GetAll().FirstOrDefault(x => x.UserId == userId && x.Id == id);
                if (report != null)
                {
                    uow.DayReportRepository.Delete(report);
                    uow.Commit();
                }
            }

            return Json(result);
        }

        public JsonResult CalculateTotalFlex()
        {
            var result = new ResultViewModel();

            var userId = User.Identity.GetUserId();

            result.Data = new
            {
                Flex = _calculationManager.CalculateFlex(userId)
            };

            return Json(result);
        }

        public JsonResult CalculateRemainingVacation()
        {
            var result = new ResultViewModel();

            using (var uow = _uowFactory.GetUow())
            {
                var userId = User.Identity.GetUserId();

                var user = uow.UserRepository.GetAll().FirstOrDefault(x => x.Id == userId);

                var usedVacationDays = uow.DayReportRepository.GetAll().Count(x => x.UserId == userId && x.IsVacation);

                result.Data = new
                {
                    TotalVacation = user.VacationDays,
                    RemainingVacation = user.VacationDays - usedVacationDays
                };
            }

            return Json(result);
        }

        public JsonResult GetFlexInterval(DateTime startDate, DateTime endDate)
        {
            var result = new ResultViewModel();

            result.Data = new
            {
                FlexList = _calculationManager.GetFlexForInterval(User.Identity.GetUserId(), startDate, endDate)
            };

            return Json(result);
        }

    }
}