# API Design Instructions

## Overview

This document outlines the API design principles and best practices for building consistent, maintainable, and developer-friendly APIs based on the patterns established in this project.

## Core API Design Principles

### 1. Consistency First
- Maintain uniform naming conventions across all endpoints
- Use standardized response structures throughout the API
- Apply consistent error handling patterns
- Standardize authentication mechanisms

### 2. Developer Experience Priority
- Design APIs that are intuitive and easy to use
- Provide clear, comprehensive documentation
- Include realistic examples for all operations
- Minimize cognitive load for API consumers

### 3. RESTful Resource Design
- Model APIs around resources, not actions
- Use nouns for resource names, not verbs
- Maintain clear hierarchical relationships
- Follow HTTP semantics correctly

### URL Structure and Naming

#### API Versioning
APIs **MUST** use path-based versioning to ensure backward compatibility and clear evolution:

**Required Format**: `/{version}/{resource}`

**Version Format Rules**:
- Use semantic versioning: `v1`, `v2`, `v3`, etc.
- Always prefix with `v` (lowercase)
- Use integers only (no decimals): `v1` ✓, `v1.1` ✗
- Place version immediately after `/` segment

**Version Management**:
- **v1**: Initial API version (always start here)
- **v2+**: Breaking changes require new version
- **Backward Compatibility**: Maintain previous versions during transition
- **Deprecation**: Provide 6-month notice before removing old versions
- **Documentation**: Each version must have separate documentation

**Breaking Changes** (require new version):
- Removing fields from responses
- Changing field types or formats
- Modifying required request fields
- Changing HTTP status codes
- Altering authentication mechanisms

**Non-Breaking Changes** (same version):
- Adding optional fields to responses
- Adding optional request parameters
- Adding new endpoints
- Improving error messages
- Performance optimizations

#### Resource Naming
- Use plural nouns for collections: `/v1/orders`
- Use clear, descriptive resource names: `/v1/users`, `/v1/products`
- Avoid deep nesting beyond 2 levels: `/v1/users/{id}/orders` ✓, `/v1/users/{id}/orders/{id}/items/{id}` ✗


### HTTP Methods and Status Codes

#### Method Usage
| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve resources | `GET /v1/orders` |
| POST | Create new resource | `POST /v1/orders` |
| PUT | Replace entire resource | `PUT /v1/orders/{id}` |
| PATCH | Partial update | `PATCH /v1/orders/{id}` |
| DELETE | Remove resource | `DELETE /v1/orders/{id}` |

#### Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request syntax
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server errors

## Response Structure Standards

### Endpoint Response Rules

#### Detail Endpoints (Single Resource)
Endpoints that return a single resource **MUST** respond with the resource object directly:

```typescript
// GET /v1/orders/{id}
{
  "id": "order-123",
  "status": "pending",
  "total": 99.99,
  "createdAt": "2025-07-29T10:00:00Z"
}
```

#### List Endpoints (Collections)
Endpoints that return collections **MUST** respond with an object containing `data` and `pagination`:

```typescript
// GET /v1/orders
{
  "data": [
    {
      "id": "order-123",
      "status": "pending",
      "total": 99.99,
      "createdAt": "2025-07-29T10:00:00Z"
    },
    {
      "id": "order-124",
      "status": "completed",
      "total": 149.50,
      "createdAt": "2025-07-29T09:30:00Z"
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 20,
    "count": 150,
    "hasMore": true
  }
}
```

### Pagination Schema
All paginated endpoints **MUST** use this shared pagination structure:

```typescript
interface Pagination {
  offset: number;    // Current offset (0-based)
  limit: number;     // Number of items per page
  count: number;     // Total number of items
  hasMore: boolean;  // Whether more items exist
}
```

### Query Parameters for Pagination
Paginated endpoints **MUST** support these query parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `offset` | number | No | 0 | Starting position (0-based) |
| `limit` | number | No | 20 | Number of items to return |

Examples:
```
GET /v1/orders                    // First page (offset=0, limit=20)
GET /v1/orders?offset=20&limit=20 // Second page
GET /v1/orders?offset=0&limit=50  // First 50 items
```

### Data Array Structure
The `data` field in paginated responses **MUST**:
- Always be an array of objects
- Contain homogeneous object types
- Be empty array `[]` when no results found
- Never be `null` or `undefined`

## Performance Considerations

### Pagination Strategy
- Use offset/limit pagination for simple cases
- Consider cursor-based pagination for large datasets
- Default limit: 20 items (`API_DEFAULT_LIMIT`)
- Maximum limit: 100 items

### Response Optimization
- Use appropriate HTTP caching headers
- Implement compression (gzip)
- Consider field selection for large resources
- Optimize JSON payload size

## Documentation Requirements

### API Documentation Standards
- Document all endpoints with examples
- Include request/response schemas
- Provide error code explanations
- Include authentication requirements
- Add rate limiting information

---

## OpenAPI 3.0+ Specification Best Practices

### Imperative Rules for OpenAPI Specifications

#### 1. Structure and Metadata
- **MUST** include `openapi: 3.0.3` or higher
- **MUST** provide complete `info` section with title, version, description
- **MUST** include contact information and license
- **MUST** define all server environments with versioned paths


#### 2. Path Definitions
- **MUST** use consistent parameter naming across operations
- **MUST** include `operationId` for each operation
- **MUST** provide `summary` and `description` for all operations
- **MUST** specify all possible response codes
- **MUST** include examples for all request/response bodies
- **MUST** follow versioned path structure: `/v1/resource`, `/v2/resource`

#### 3. Schema Definitions
- **MUST** define all models in `components/schemas`
- **MUST** use `$ref` to reference common schemas
- **MUST** specify `required` fields explicitly
- **MUST** include validation constraints (min/max, pattern, enum)
- **MUST** provide realistic examples for all properties

#### 4. Response Specifications
- **MUST** define consistent error response schema
- **MUST** include pagination schema for collection endpoints
- **MUST** specify content-type for all responses
- **MUST** document all possible HTTP status codes

#### 5. Security Definitions
- **MUST** define security schemes in `components/securitySchemes`
- **MUST** specify security requirements for each operation
- **MUST** document authentication flow and requirements
- **MUST** include security examples in documentation

#### 6. Parameter Specifications
- **MUST** define parameter types and formats explicitly
- **MUST** specify parameter location (path, query, header)
- **MUST** include parameter validation rules
- **MUST** provide parameter examples
- **MUST** mark required parameters appropriately

#### 7. Data Types and Formats
- **MUST** use appropriate data types (string, number, boolean, array, object)
- **MUST** specify format for specialized types (date, date-time, email, uri)
- **MUST** define enum values explicitly
- **MUST** include pattern validation for string fields

#### 8. Documentation Quality
- **MUST** provide clear, concise descriptions
- **MUST** include code examples for complex operations
- **MUST** document business logic and constraints
- **MUST** explain error conditions and recovery
- **MUST** maintain up-to-date documentation

#### 9. Consistency Requirements
- **MUST** use consistent naming conventions
- **MUST** follow uniform response structure patterns
- **MUST** apply standard error handling across all endpoints
- **MUST** maintain consistent parameter ordering

#### 10. Validation and Testing
- **MUST** validate OpenAPI specification syntax
- **MUST** test all documented examples
- **MUST** verify schema compliance with actual API responses
- **MUST** ensure all referenced components exist
- **MUST** validate security definitions work as documented
