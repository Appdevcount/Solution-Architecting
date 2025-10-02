using CareCoordination.Api.Extensions;
using CareCoordination.Api.Middleware;
using CareCoordination.Application.Abstracts.DALInterfaces;
using CareCoordination.Application.Abstracts.HandlerInterfaces;
using CareCoordination.Application.Abstracts.ServiceInterfaces;
using CareCoordination.Application.Handlers;
using CareCoordination.Application.Logger;
using CareCoordination.DAL.Implementation;
using CareCoordination.Services.Implementation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.RegisterServices();
builder.Services.AddCors(allowsites
=> allowsites.AddPolicy(name: "AllowOrigin", options => options
.WithOrigins("https://imageone.carecorenational.com/CareCoordinationUI", "http://localhost:3000/", "http://localhost:5290", "https://localhost:7036")
.AllowAnyHeader()
.AllowAnyMethod()));


string connectionString = builder.Configuration.GetConnectionString("PreAuthin");
var jwtKey = builder.Configuration["JwtSettings:SecretKey"];
builder.Services.AddSingleton(connectionString);
builder.Services.AddSingleton<IApplicationLogger, AppInsightsLogger>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine(context.Exception.Message);
                return Task.CompletedTask;
            }
        };
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateLifetime = true,
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

//Auto Mapper Service
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen(c =>
{
    // Define the API key scheme
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "X-API-KEY",
        Type = SecuritySchemeType.ApiKey,
        Description = "API Key needed to access the endpoints"
    });
    // Define the JWT bearer scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme."
    });
    // Apply security requirements globally
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
{
{
new OpenApiSecurityScheme
{
Reference = new OpenApiReference
{
Type = ReferenceType.SecurityScheme,
Id = "Bearer"
}
},
new string[] {}
}
});

});


var app = builder.Build();

app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("./v1/swagger.json", "Care Coordination");
});

app.UseHttpsRedirection();

app.UseCors("AllowOrigin");

app.UseHsts();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


app.Run();
