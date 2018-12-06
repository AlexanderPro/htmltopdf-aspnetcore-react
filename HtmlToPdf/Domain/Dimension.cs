using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HtmlToPdf.Domain
{
    public class Dimension
    {
        public decimal Width { get; set; }

        public decimal? Height { get; set; }

        public string UnitName { get; set; }
    }
}
