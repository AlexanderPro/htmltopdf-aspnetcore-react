using System.Threading.Tasks;
using HtmlToPdf.Domain;

namespace HtmlToPdf.Services
{
    public interface IPhantomJsService
    {
        Task<byte[]> ConvertHtmlToPdfAsync(string url, PaperType paperType, PaperOrientation paperOrientation, Dimension dimension = null);

        Task<byte[]> ConvertHtmlToImageAsync(string url, ImageType imageType, Dimension dimension = null);
    }
}
