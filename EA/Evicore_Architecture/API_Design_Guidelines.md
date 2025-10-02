# API Design Guidelines

Owned by Kamal Gurnani
Jan 12, 2022

## Design Considerations

- Coupling: Low coupling for flexibility and reusability
- Chattiness: Avoid excessive API calls
- Client Complexity: See BFF pattern
- Cognitive Complexity: Keep logic simple for testability
- Caching: See API Management Strategy
- Response Caching: See API Management Strategy
- Discoverability: Provide clear API documentation
- Versioning: Adopt proper versioning strategy
- Security: See Secure by Design section

## Implementation Recommended Practices

- Use sequence diagrams
- Embrace Clean Architecture (Hexagonal)
- Secure by Design: Authorization, input validation, output encoding, cryptography, secret management
- Size and Granularity
- User-digestible response codes
- Backends for Front-ends
- Use cloud design patterns (Azure)

Reference: Cloud Design Patterns - Azure Architecture Center
