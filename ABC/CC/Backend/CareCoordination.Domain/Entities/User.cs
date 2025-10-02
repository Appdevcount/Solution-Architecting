namespace CareCoordination.Domain.Entities
{
    public class User
    {
        public string? UserId { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; } // Consider using hashed passwords
        public string? Role { get; set; }
        public bool HasLEA { get; set; }
        public string[]? Permissions { get; set; }
    }
}
