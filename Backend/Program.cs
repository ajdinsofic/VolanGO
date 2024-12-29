using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using RS1_2024_25.API.Data.Models;
using VolanGo;
using VolanGo.Extensions;
using Microsoft.AspNetCore.Identity.Data;
using VolanGo.RequestBodies;
using Backend.DbConnection;
using Stripe;
using Microsoft.AspNetCore.RateLimiting;
using VolanGo.Services;
using System.Threading.RateLimiting;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("fixed", httpContext =>
    {
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromSeconds(10)
            });
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.AllowAnyOrigin();
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                      });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "VolanGO API",
        Version = "v1",
        Description = "API documentation for VolanGO project",
        Contact = new OpenApiContact
        {
            Name = "Your Name",
            Email = "your.email@example.com",
        }
    });
});
builder.Services.AddScoped<CaptchaServices>();
builder.Services.AddHttpClient<CohereServices>();
builder.Services.AddSingleton<EmailService>();
// Konfiguracija baze podataka
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("db1")));
StripeConfiguration.ApiKey = builder.Configuration["Stripe:ApiKey"];

var app = builder.Build();


// Swagger UI za razvojno okruženje
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("http://localhost:5136/swagger/v1/swagger.json", "VolanGO API v1");
        c.RoutePrefix = string.Empty; // Swagger UI dostupan na root URL-u
    });
    app.ApplyMigrations();
}
app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.MapGet("validate-access-token", () => Results.Ok(true));

app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();


app.Run();
