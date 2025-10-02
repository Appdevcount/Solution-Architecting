using Microsoft.IdentityModel.Tokens;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CareCoordination.Api.Middleware
{
    [ExcludeFromCodeCoverage]
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _secretKey;
        public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _secretKey = configuration["JwtSettings:SecretKey"];
        }

        

        public string GenerateToken(string username)
        {
            // Create claims for the token (you can add more claims here if necessary)
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "User"), // Add roles or other claims as needed
            // Add other claims here as necessary
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                //issuer: _issuer,
                //audience: _audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1), // Set expiration time (e.g., 1 hour)
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token); // Return the generated JWT token as a string
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null)
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                if(jwtToken.ValidTo < System.DateTime.UtcNow)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token expired");
                    return;
                }
            }
            await _next(context);

        }
    }
}
