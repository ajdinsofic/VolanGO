using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Backend.EndPoints
{
    [ApiController]
    public class fileController : ControllerBase
    {
        [HttpPost("upload/file")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null)
            {
                return BadRequest("No file uploaded.");
            }
        
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles", file.FileName);
        
            // Kreiraj direktorijum ako ne postoji
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
        
            // Snimi fajl na server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        
            return Ok(new { FilePath = filePath });
        }

        [HttpGet("download/{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles", fileName);
        
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }
        
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
        }

        [HttpGet("get/files")]
        public IActionResult GetFiles()
        {
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
        
            // Proveri da li direktorijum postoji
            if (!Directory.Exists(directoryPath))
            {
                return NotFound("Directory not found");
            }
        
            // Uzimanje svih fajlova u direktorijumu
            var files = Directory.GetFiles(directoryPath)
                .Select(Path.GetFileName) // Uzima samo ime fajla, bez putanje
                .ToList();
        
            return Ok(files);
        }

    }
}