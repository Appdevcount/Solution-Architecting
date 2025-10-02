using Azure.Core;
using System.IdentityModel.Tokens.Jwt;

namespace CareCoordination.Api.Helpers
{
    public static class JwtHelper
    {
        public static string GetUserId(HttpRequest request)
        {
            var token = request.Headers.Authorization.ToString().Split(" ").Last();
            Dictionary<string, string> claimList = new Dictionary<string, string>();      
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);  
            var claims = jwtToken.Claims;

            foreach (var claim in claims)
            {
                claimList.Add(claim.Type, claim.Value);
            }
            var userid = claimList["sub"];
            return userid;
        }
    }
}
