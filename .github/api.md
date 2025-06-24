# API Design Guidelines for AI Generation

## Table of Contents
1. [General API Design Principles](#general-api-design-principles)
2. [RESTful API Design](#restful-api-design)
3. [URL Structure and Naming Conventions](#url-structure-and-naming-conventions)
4. [HTTP Methods and Status Codes](#http-methods-and-status-codes)
5. [Request and Response Design](#request-and-response-design)
6. [Authentication and Security](#authentication-and-security)
7. [Error Handling](#error-handling)
8. [API Versioning](#api-versioning)
9. [Documentation and OpenAPI Specification](#documentation-and-openapi-specification)
10. [Performance and Scalability](#performance-and-scalability)
11. [Testing and Quality Assurance](#testing-and-quality-assurance)
12. [OpenAPI 3.0+ Specification Guidelines](#openapi-30-specification-guidelines)

---

## General API Design Principles

### Consistency is Key
- Maintain consistent naming conventions across all endpoints
- Use uniform response structures throughout the API
- Apply consistent error handling patterns
- Standardize authentication mechanisms

### Design for the Consumer
- Prioritize developer experience and ease of use
- Provide clear, intuitive interfaces
- Minimize the number of API calls required for common tasks
- Design endpoints that match real-world use cases

### Follow Industry Standards
- Adhere to HTTP/1.1 and HTTP/2 specifications
- Implement standard authentication methods (OAuth 2.0, JWT)
- Use widely accepted content types (JSON, XML)
- Follow RFC standards for relevant protocols

### Backward Compatibility
- Design APIs to be backward compatible when possible
- Use deprecation warnings before removing features
- Provide migration paths for breaking changes
- Version APIs appropriately

---

## RESTful API Design

### Resource-Oriented Design
Design APIs around resources (nouns) rather than actions (verbs):

**Good:**
```
GET /users/123
POST /users
PUT /users/123
DELETE /users/123
```

**Bad:**
```
GET /getUser/123
POST /createUser
PUT /updateUser/123
DELETE /deleteUser/123
```

### Resource Relationships
Handle nested resources appropriately:

```
GET /users/123/orders          # Get orders for user 123
POST /users/123/orders         # Create order for user 123
GET /users/123/orders/456      # Get specific order for user 123
```

### Collection vs. Individual Resources
- Collections: `/users` (plural)
- Individual resources: `/users/123` (plural collection + identifier)

---

## URL Structure and Naming Conventions

### URL Naming Rules
1. **Use lowercase letters only**
   - Good: `/api/v1/user-profiles`
   - Bad: `/API/V1/UserProfiles`

2. **Use hyphens (-) to separate words, not underscores**
   - Good: `/user-preferences`
   - Bad: `/user_preferences`

3. **Use plural nouns for collections**
   - Good: `/users`, `/orders`, `/products`
   - Bad: `/user`, `/order`, `/product`

4. **Avoid deep nesting (maximum 3 levels)**
   - Good: `/users/123/orders`
   - Acceptable: `/users/123/orders/456/items`
   - Bad: `/users/123/orders/456/items/789/details/properties`

### URL Structure Template
```
{protocol}://{host}:{port}/api/{version}/{resource}/{id}/{sub-resource}
```

Example:
```
https://api.example.com/api/v1/users/123/orders
```

### Query Parameters Guidelines
- Use query parameters for filtering, sorting, pagination, and searching
- Use consistent parameter names across endpoints

```
GET /users?page=2&limit=50&sort=created_at&order=desc&filter=active
GET /products?category=electronics&min_price=100&max_price=500
```

---

## HTTP Methods and Status Codes

### HTTP Methods Usage

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve data | Yes | Yes |
| POST | Create new resource | No | No |
| PUT | Update/replace entire resource | Yes | No |
| PATCH | Partial update of resource | No | No |
| DELETE | Remove resource | Yes | No |
| HEAD | Get headers only | Yes | Yes |
| OPTIONS | Get allowed methods | Yes | Yes |

### HTTP Status Codes

#### Success Codes (2xx)
- **200 OK**: Successful GET, PUT, PATCH, or DELETE
- **201 Created**: Successful POST that creates a resource
- **202 Accepted**: Request accepted for processing (async operations)
- **204 No Content**: Successful request with no response body

#### Client Error Codes (4xx)
- **400 Bad Request**: Invalid request syntax or parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **405 Method Not Allowed**: HTTP method not supported
- **409 Conflict**: Resource conflict (e.g., duplicate creation)
- **422 Unprocessable Entity**: Valid syntax but semantic errors
- **429 Too Many Requests**: Rate limit exceeded

#### Server Error Codes (5xx)
- **500 Internal Server Error**: Generic server error
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Service temporarily unavailable
- **504 Gateway Timeout**: Upstream server timeout

---

## Request and Response Design

### JSON as Default Format
Use JSON as the primary data format:

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "created_at": "2023-10-15T14:30:00Z",
  "updated_at": "2023-10-15T14:30:00Z"
}
```

### Consistent Response Structure
Standardize response formats across all endpoints:

**Single Resource:**
```json
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "meta": {
    "timestamp": "2023-10-15T14:30:00Z",
    "version": "1.0"
  }
}
```

**Collection Response:**
```json
{
  "data": [
    {
      "id": 123,
      "name": "John Doe"
    },
    {
      "id": 124,
      "name": "Jane Smith"
    }
  ],
  "meta": {
    "total_count": 150,
    "page": 1,
    "per_page": 50,
    "total_pages": 3
  },
  "links": {
    "self": "/api/v1/users?page=1",
    "next": "/api/v1/users?page=2",
    "last": "/api/v1/users?page=3"
  }
}
```

### Field Naming Conventions
- Use `snake_case` for JSON field names
- Use descriptive, clear field names
- Avoid abbreviations unless widely understood
- Use consistent field names across resources

### Date and Time Format
- Use ISO 8601 format for all timestamps
- Always include timezone information
- Use UTC as the default timezone

```json
{
  "created_at": "2023-10-15T14:30:00Z",
  "updated_at": "2023-10-15T14:30:00+00:00"
}
```

---

## Authentication and Security

### Authentication Methods
1. **OAuth 2.0** (Recommended for third-party integrations)
2. **JWT (JSON Web Tokens)** (For stateless authentication)
3. **API Keys** (For simple service-to-service communication)

### Authorization Header Format
```
Authorization: Bearer <token>
Authorization: API-Key <api-key>
```

### Security Best Practices
- Always use HTTPS in production
- Implement rate limiting
- Validate all input data
- Use CORS appropriately
- Implement proper session management
- Store sensitive data securely (encrypted)

### Rate Limiting
Include rate limiting headers in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1377013266
```

---

## Error Handling

### Error Response Structure
Provide consistent, informative error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      },
      {
        "field": "age",
        "message": "Age must be between 18 and 100"
      }
    ],
    "timestamp": "2023-10-15T14:30:00Z",
    "request_id": "req_abc123def456"
  }
}
```

### Error Code Categories
- **VALIDATION_ERROR**: Input validation failures
- **AUTHENTICATION_ERROR**: Authentication issues
- **AUTHORIZATION_ERROR**: Permission issues
- **NOT_FOUND_ERROR**: Resource not found
- **CONFLICT_ERROR**: Resource conflicts
- **RATE_LIMIT_ERROR**: Too many requests
- **INTERNAL_ERROR**: Server-side errors

### Error Messages Guidelines
- Provide clear, actionable error messages
- Include field-specific validation errors
- Use consistent error codes
- Include request IDs for tracking
- Avoid exposing sensitive system information

---

## API Versioning

### Versioning Strategies
1. **URL Path Versioning** (Recommended)
   ```
   /api/v1/users
   /api/v2/users
   ```

2. **Header Versioning**
   ```
   Accept: application/vnd.api+json;version=1
   ```

3. **Query Parameter Versioning**
   ```
   /api/users?version=1
   ```

### Version Management
- Use semantic versioning (v1, v2, v3)
- Maintain multiple versions simultaneously
- Provide deprecation notices
- Set clear end-of-life dates for old versions

### Breaking vs. Non-Breaking Changes
**Breaking Changes (require new version):**
- Removing fields or endpoints
- Changing field types
- Modifying required fields
- Changing response structure

**Non-Breaking Changes (same version):**
- Adding new fields
- Adding new endpoints
- Adding new optional parameters

---

## Documentation and OpenAPI Specification

### Documentation Requirements
- Provide comprehensive API documentation
- Include code examples for each endpoint
- Document all parameters, headers, and responses
- Provide authentication examples
- Include error scenarios and handling

### Essential Documentation Sections
1. **Getting Started Guide**
2. **Authentication Setup**
3. **Endpoint Reference**
4. **Code Examples**
5. **Error Handling Guide**
6. **Rate Limiting Information**
7. **Changelog/Version History**

---

## Performance and Scalability

### Pagination
Implement consistent pagination across all collection endpoints:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 50,
    "total_pages": 10,
    "total_count": 500,
    "has_next": true,
    "has_prev": true
  },
  "links": {
    "first": "/api/v1/users?page=1",
    "prev": "/api/v1/users?page=1",
    "self": "/api/v1/users?page=2",
    "next": "/api/v1/users?page=3",
    "last": "/api/v1/users?page=10"
  }
}
```

### Filtering and Sorting
```
GET /api/v1/users?filter[status]=active&filter[role]=admin&sort=-created_at,name
```

### Caching
- Implement appropriate HTTP caching headers
- Use ETags for conditional requests
- Provide Last-Modified headers
- Consider implementing API-level caching

### Response Optimization
- Use field selection/sparse fieldsets
- Implement resource expansion
- Compress responses (gzip)
- Optimize JSON payload size

---

## Testing and Quality Assurance

### Testing Requirements
1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test endpoint interactions
3. **Contract Tests**: Verify API contracts
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Authentication and authorization

### API Testing Checklist
- [ ] All endpoints return correct status codes
- [ ] Response formats match specifications
- [ ] Error handling works correctly
- [ ] Authentication and authorization function properly
- [ ] Rate limiting is enforced
- [ ] Input validation is comprehensive
- [ ] Performance meets requirements

---

## OpenAPI 3.0+ Specification Guidelines

### Basic OpenAPI Structure
```yaml
openapi: 3.0.3
info:
  title: User Management API
  description: API for managing users and their profiles
  version: 1.0.0
  contact:
    name: API Support
    email: api-support@example.com
    url: https://example.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server
```

### Path Definitions
```yaml
paths:
  /users:
    get:
      summary: List users
      description: Retrieve a paginated list of users
      tags:
        - Users
      parameters:
        - name: page
          in: query
          description: Page number for pagination
          required: false
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalServerError'
    post:
      summary: Create user
      description: Create a new user account
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'
```

### Schema Definitions
```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
        - created_at
      properties:
        id:
          type: integer
          format: int64
          description: Unique identifier for the user
          example: 123
        email:
          type: string
          format: email
          description: User's email address
          example: "john.doe@example.com"
        name:
          type: string
          description: User's full name
          example: "John Doe"
          minLength: 1
          maxLength: 100
        phone:
          type: string
          description: User's phone number
          example: "+1-555-123-4567"
          pattern: '^\+[1-9]\d{1,14}$'
        status:
          type: string
          enum: [active, inactive, suspended]
          description: Current status of the user
          example: "active"
        created_at:
          type: string
          format: date-time
          description: Timestamp when the user was created
          example: "2023-10-15T14:30:00Z"
        updated_at:
          type: string
          format: date-time
          description: Timestamp when the user was last updated
          example: "2023-10-15T14:30:00Z"

    CreateUserRequest:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
          format: email
          description: User's email address
          example: "john.doe@example.com"
        name:
          type: string
          description: User's full name
          example: "John Doe"
          minLength: 1
          maxLength: 100
        phone:
          type: string
          description: User's phone number
          example: "+1-555-123-4567"

    UserResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/User'
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            version:
              type: string

    UserListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          type: object
          properties:
            total_count:
              type: integer
            page:
              type: integer
            per_page:
              type: integer
            total_pages:
              type: integer
        links:
          type: object
          properties:
            self:
              type: string
              format: uri
            next:
              type: string
              format: uri
            prev:
              type: string
              format: uri
            first:
              type: string
              format: uri
            last:
              type: string
              format: uri

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          description: Error code identifier
          example: "VALIDATION_ERROR"
        message:
          type: string
          description: Human-readable error message
          example: "The request contains invalid parameters"
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string
        timestamp:
          type: string
          format: date-time
        request_id:
          type: string
          description: Unique identifier for the request
          example: "req_abc123def456"

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'

    Forbidden:
      description: Forbidden
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'

    Conflict:
      description: Resource conflict
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT Bearer token authentication
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key authentication

security:
  - BearerAuth: []
  - ApiKeyAuth: []
```

### OpenAPI Best Practices

#### 1. Comprehensive Documentation
- Include detailed descriptions for all operations, parameters, and schemas
- Provide realistic examples for all data types
- Document all possible response scenarios

#### 2. Reusable Components
- Define reusable schemas in the components section
- Create common response objects for errors
- Use references ($ref) to avoid duplication

#### 3. Validation Rules
- Include all validation constraints (min/max, patterns, enums)
- Specify required vs. optional fields clearly
- Use appropriate data types and formats

#### 4. Security Documentation
- Document all authentication methods
- Specify security requirements for each endpoint
- Include examples of authentication headers

#### 5. Server Configuration
- List all available environments (dev, staging, production)
- Provide accurate server URLs
- Include server descriptions

### OpenAPI Generation Checklist
- [ ] All endpoints are documented with complete parameter definitions
- [ ] Request and response schemas are fully defined
- [ ] Error responses are documented for all relevant status codes
- [ ] Authentication and security requirements are specified
- [ ] Examples are provided for complex data structures
- [ ] Validation rules are included in schema definitions
- [ ] Server information is accurate and complete
- [ ] API metadata (title, description, version) is comprehensive
