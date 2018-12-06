using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HtmlToPdf.Domain;
using HtmlToPdf.Services;

namespace HtmlToPdf.Areas.Api
{
    [Route("api/[controller]")]
    public class ConverterController : ControllerBase
    {
        private readonly IPhantomJsService _phantomJsService;

        public ConverterController(IPhantomJsService phantomJsService)
        {
            _phantomJsService = phantomJsService ?? throw new ArgumentNullException(nameof(phantomJsService));
        }

        [HttpPost("ConvertHtmlToPdf")]
        public async Task<IActionResult> ConvertHtmlToPdf([FromBody] HtmlToPdfModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Url) || string.IsNullOrEmpty(model.FileType))
            {
                return Ok(new { Success = false, Message = "Error of input data." });
            }

            if (model.FileType.ToLower() == "pdf")
            {
                if (!Enum.TryParse<PaperType>(model.PaperType, true, out var paperType))
                {
                    return Ok(new { Success = false, Message = "Error of input data." });
                }

                if (!Enum.TryParse<PaperOrientation>(model.PaperOrientation, true, out var paperOrientation))
                {
                    paperOrientation = PaperOrientation.Portrait;
                }

                var dimension = (Dimension)null;
                if (paperType == PaperType.Custom)
                {
                    if (model.PaperWidth == null || model.PaperHeight == null)
                    {
                        return Ok(new { Success = false, Message = "Width and height of the document should be set." });
                    }
                    else
                    {
                        dimension = new Dimension
                        {
                            Width = model.PaperWidth.Value,
                            Height = model.PaperHeight.Value,
                            UnitName = model.PaperUnitName
                        };
                    }
                }
                try
                {
                    var data = await _phantomJsService.ConvertHtmlToPdfAsync(model.Url, paperType, paperOrientation, dimension);
                    return File(data, "application/pdf", "File.pdf");
                }
                catch (Exception e)
                {
                    return Ok(new { Success = false, e.Message });
                }
            }
            else
            {
                if (!Enum.TryParse<ImageType>(model.ImageType, true, out var imageType))
                {
                    return Ok(new { Success = false, Message = "Error of input data." });
                }

                var dimension = (Dimension)null;
                if (model.ImageWidth != null && model.ImageHeight != null)
                {
                    dimension = new Dimension
                    {
                        Width = model.ImageWidth.Value,
                        Height = model.ImageHeight.Value,
                        UnitName = "px"
                    };
                }
                else if (model.ImageWidth != null)
                {
                    dimension = new Dimension
                    {
                        Width = model.ImageWidth.Value,
                        UnitName = "px"
                    };
                }

                try
                {
                    var data = await _phantomJsService.ConvertHtmlToImageAsync(model.Url, imageType, dimension);
                    return File(data, model.ImageType.ToLower() == "jpg" ? "application/jpeg" : "application/png", $"File.{model.ImageType.ToLower()}");
                }
                catch (Exception e)
                {
                    return Ok(new { Success = false, e.Message });
                }
            }
        }

        public class HtmlToPdfModel
        {
            public string Url { get; set; }

            public string FileType { get; set; }

            public string PaperType { get; set; }

            public string PaperOrientation { get; set; }

            public decimal? PaperWidth { get; set; }

            public decimal? PaperHeight { get; set; }

            public string PaperUnitName { get; set; }

            public string ImageType { get; set; }

            public decimal? ImageWidth { get; set; }

            public decimal? ImageHeight { get; set; }
        }
    }
}