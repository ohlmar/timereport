using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeReport.Data.Contract.Repositories
{
    public interface IRepository<T>
    {
        T Add(T entity);

        void Update(T entity);

        void Delete(T entity);

        T GetById(int id);

        IQueryable<T> GetAll();
    }
}
