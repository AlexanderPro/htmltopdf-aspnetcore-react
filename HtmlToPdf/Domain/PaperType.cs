using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HtmlToPdf.Domain
{
    public enum PaperType : int
    {
        A3 = 0,
        A4 = 1,
        A5 = 2,
        Legal = 3,
        Letter = 4,
        Tabloid = 5,
        Custom = 6
    }
}
