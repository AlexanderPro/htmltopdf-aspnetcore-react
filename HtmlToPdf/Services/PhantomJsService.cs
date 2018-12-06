using System;
using System.IO;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using HtmlToPdf.Domain;

namespace HtmlToPdf.Services
{
    public class PhantomJsService : IPhantomJsService
    {
        public async Task<byte[]> ConvertHtmlToPdfAsync(string url, PaperType paperType, PaperOrientation paperOrientation, Dimension dimension = null)
        {
            var phantomJsDirectoryName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "runtime", "phantomjs");
            var phantomJsFileName = RuntimeInformation.IsOSPlatform(OSPlatform.Linux) ? "linux_phantomjs" : RuntimeInformation.IsOSPlatform(OSPlatform.OSX) ? "osx_phantomjs" : "windows_phantomjs.exe";
            phantomJsFileName = Path.Combine(phantomJsDirectoryName, "exe", phantomJsFileName);

            var outputFileName = $"output_{Guid.NewGuid()}.pdf";
            var arguments = paperType != PaperType.Custom ? $"rasterize.js \"{url}\" \"{outputFileName}\" \"{paperType.ToString()}\" \"{paperOrientation.ToString().ToLower()}\"" : 
                $"rasterize.js \"{url}\" \"{outputFileName}\" \"{dimension.Width.ToString().Replace(",", ".")}{dimension.UnitName}*{dimension.Height.ToString().Replace(",", ".")}{dimension.UnitName}\" \"{paperOrientation.ToString().ToLower()}\"";
            var startInfo = new ProcessStartInfo(phantomJsFileName)
            {
                WorkingDirectory = phantomJsDirectoryName,
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                StandardOutputEncoding = System.Text.Encoding.UTF8
            };

            var process = new Process { StartInfo = startInfo };
            process.Start();
            var output = await process.StandardOutput.ReadToEndAsync();
            process.WaitForExit();
            if (process.ExitCode == 1)
            {
                throw new Exception(output);
            }

            outputFileName = Path.Combine(phantomJsDirectoryName, outputFileName);
            var bytes = await File.ReadAllBytesAsync(outputFileName);
            if (File.Exists(outputFileName))
            {
                File.Delete(outputFileName);
            }
            return bytes;
        }

        public async Task<byte[]> ConvertHtmlToImageAsync(string url, ImageType imageType, Dimension dimension = null)
        {
            var phantomJsDirectoryName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "runtime", "phantomjs");
            var phantomJsFileName = RuntimeInformation.IsOSPlatform(OSPlatform.Linux) ? "linux_phantomjs" : RuntimeInformation.IsOSPlatform(OSPlatform.OSX) ? "osx_phantomjs" : "windows_phantomjs.exe";
            phantomJsFileName = Path.Combine(phantomJsDirectoryName, "exe", phantomJsFileName);

            var outputFileName = $"output_{Guid.NewGuid()}.{imageType.ToString().ToLower()}";
            var arguments = dimension == null ? $"rasterize.js \"{url}\" \"{outputFileName}\"" : dimension.Height == null ? 
                $"rasterize.js \"{url}\" \"{outputFileName}\" \"{dimension.Width.ToString().Replace(",", ".")}{dimension.UnitName}\"" : 
                $"rasterize.js \"{url}\" \"{outputFileName}\" \"{dimension.Width.ToString().Replace(",", ".")}{dimension.UnitName}*{dimension.Height.ToString().Replace(",", ".")}{dimension.UnitName}\"";
            var startInfo = new ProcessStartInfo(phantomJsFileName)
            {
                WorkingDirectory = phantomJsDirectoryName,
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                StandardOutputEncoding = System.Text.Encoding.UTF8
            };

            var process = new Process { StartInfo = startInfo };
            process.Start();
            var output = await process.StandardOutput.ReadToEndAsync();
            process.WaitForExit();
            if (process.ExitCode == 1)
            {
                throw new Exception(output);
            }

            outputFileName = Path.Combine(phantomJsDirectoryName, outputFileName);
            var bytes = await File.ReadAllBytesAsync(outputFileName);
            if (File.Exists(outputFileName))
            {
                File.Delete(outputFileName);
            }
            return bytes;
        }
    }
}
