Absolutely, Siraj! Here's your complete C# Coding Standards & Naming Conventions Markdown file, combining naming rules, formatting guidelines, testing practices, and architecture tips—all in one clean .md document. You can drop this into your GitHub repo, share it with your team, or use it to guide Copilot suggestions.

---

`md

📘 C# Coding Standards & Naming Conventions

🔹 Purpose
This document defines coding and naming conventions for C# projects to ensure consistency, readability, and maintainability. It is intended for use with GitHub Copilot, team onboarding, and automated code review tools.

---

🧱 General Naming Guidelines

- ✅ Use PascalCase for types, methods, and properties.
- ✅ Use camelCase for local variables and method parameters.
- ✅ Prefix interfaces with I (e.g., IRepository).
- ✅ Use descriptive, meaningful names.
- ❌ Avoid abbreviations unless widely accepted (Id, Db).
- ❌ Avoid Hungarian notation (strName, intCount).

---

🧩 Naming Patterns by Element

| Element Type         | Convention     | Example                     |
|----------------------|----------------|-----------------------------|
| Class                | PascalCase     | CustomerService, OrderManager |
| Interface            | PascalCase + I prefix | IUserRepository, ILogger |
| Method               | PascalCase     | GetUserById(), CalculateTotal() |
| Property             | PascalCase     | FirstName, IsActive     |
| Field (private)      | camelCase +  prefix | cache, _userService    |
| Field (public)       | PascalCase     | ConnectionString          |
| Variable (local)     | camelCase      | totalAmount, userList   |
| Parameter            | camelCase      | userId, isEnabled       |
| Constant             | PascalCase     | MaxRetryCount, DefaultTimeout |
| Enum                 | PascalCase     | OrderStatus, UserRole   |
| Enum Members         | PascalCase     | Pending, Approved       |
| Event                | PascalCase     | OnUserCreated, DataLoaded |
| Namespace            | PascalCase     | Company.Product.Module    |
| Generic Type         | Single uppercase letter | T, K, V               |

---

🧠 Special Naming Considerations

- Async Methods: End with Async → SaveChangesAsync()
- Boolean Properties: Use Is, Has, Can, Should → IsEnabled, HasPermission
- Collection Naming: Use plural nouns → Users, Orders
- Unit Tests: Use MethodNameStateUnderTestExpectedBehavior → GetUserByIdInvalidIdReturnsNull()

---

🛠️ Contextual Examples

Dependency Injection
`csharp
private readonly IUserService _userService;
`

LINQ Queries
`csharp
users.Where(user => user.IsActive);
`

Async Method
`csharp
public async Task<bool> SaveChangesAsync()
`

---

🧩 Additional C# Coding Standards

📁 File & Folder Structure
- Group by feature, not type → User, Order, Product
- Keep interfaces and implementations together unless reused broadly
- Use consistent naming: Services, Repositories, Controllers, Models

---

🎨 Code Formatting
- Use 4 spaces for indentation (no tabs)
- Opening braces on new lines for methods, classes, and properties
- Keep line length under 120 characters
- Use regions sparingly and only for large files

---

📝 Commenting & Documentation
- Use XML comments (///) for public APIs
- Avoid redundant comments—prefer self-explanatory code
- Use TODO and FIXME tags for incomplete logic
`csharp
/// <summary>
/// Retrieves a user by ID.
/// </summary>
public User GetUserById(int id) { ... }
`

---

🧯 Error Handling
- Use try-catch only where necessary
- Avoid catching generic Exception unless logging or rethrowing
- Prefer custom exceptions for domain-specific errors
`csharp
try
{
    // logic
}
catch (UserNotFoundException ex)
{
    // handle specific case
}
`

---

📊 Logging Practices
- Use structured logging (e.g., Serilog, NLog)
- Avoid logging sensitive data (passwords, tokens)
- Include context: method name, parameters, correlation IDs

---

🧪 Unit Testing
- Use Arrange-Act-Assert pattern
- Name tests clearly: MethodNameStateExpectedResult
- Avoid testing private methods—test via public APIs
`csharp
[Test]
public void CalculateTotalEmptyCartReturnsZero() { ... }
`

---

⚙️ Async/Await Usage
- Use async/await for I/O-bound operations
- Avoid async void except for event handlers
- Use ConfigureAwait(false) in library code

---

🔒 Immutable Data Practices
- Prefer readonly fields and immutable models
- Use record for value-based DTOs
`csharp
public record UserDto(string Name, int Age);
`

---

✅ Code Review Checklist
- ✅ Are naming conventions followed?
- ✅ Is the logic clear and testable?
- ✅ Are dependencies injected properly?
- ✅ Is error handling appropriate?
- ✅ Are performance and security considerations addressed?

---

📦 Recommended Tools

- StyleCop Analyzers
- EditorConfig
- Roslyn Rulesets

---

> 📎 Consistency is clarity. These standards help teams write better, safer, and more maintainable C# code.
`

---

If you'd like, I can help you set up a .editorconfig or StyleCop ruleset to enforce these standards automatically across your projects. Just say the word!
