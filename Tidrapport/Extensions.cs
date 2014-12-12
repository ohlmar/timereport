using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tidrapport
{
    public static class Extensions
    {
        public static DateTime? RemoveSecAndMilliSec(this DateTime? time)
        {
            if (!time.HasValue)
            {
                return null;
            }

            return new DateTime(time.Value.Year, time.Value.Month, time.Value.Day, time.Value.Hour, time.Value.Minute, 0);
        }
    }
}