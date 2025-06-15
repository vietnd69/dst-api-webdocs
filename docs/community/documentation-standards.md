---
id: documentation-standards
title: Documentation Standards
sidebar_position: 2
---

# Documentation Standards

This document outlines the standards for contributing to the Don't Starve Together API Documentation. Following these guidelines ensures consistency and readability across the documentation.

## File Organization

- Place files in the appropriate directory based on content:
  - `/docs/api-vanilla/components/` - For component documentation
  - `/docs/api-vanilla/core/` - For core systems documentation
  - `/docs/api-vanilla/examples/` - For example code and tutorials
  - `/docs/api-vanilla/getting-started/` - For introductory materials
  - `/docs/api-vanilla/localization/` - For localization documentation

- Name files descriptively using kebab-case (e.g., `health-component.md`, `event-system.md`)

## Markdown Formatting

### Headers

- Use proper header hierarchy:
  - `# Title` (H1) - For page title only
  - `## Section` (H2) - For main sections
  - `### Subsection` (H3) - For subsections
  - `#### Minor section` (H4) - For smaller divisions

### Code Blocks

- Use triple backticks with language specifier:

```lua
-- Lua code example
local function example()
  return true
end
```

### Lists

- Use bulleted lists for collections of items:
  ```md
  - Item one
  - Item two
  - Item three
  ```

- Use numbered lists for sequential steps:
  ```md
  1. First step
  2. Second step
  3. Third step
  ```

### Tables

- Use tables for structured data:
  ```md
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
  | Cell 3   | Cell 4   |
  ```

### Notes and Warnings

- Use blockquotes for important notes:
  ```md
  > **Note:** This is an important detail to remember.
  ```

- Use warning blocks for critical information:
  ```md
  > **Warning:** This action cannot be undone.
  ```

## API Documentation Structure

API documentation should follow this consistent structure:

### Component Documentation

```md
---
id: component-name
title: Component Name
sidebar_position: X
version: 619045
---

# Component Name

Brief description of what the component does and its purpose.

## Basic Usage

```lua
-- Basic example of using the component
local entity = CreateEntity()
entity:AddComponent("componentname")

-- Configure the component
local component = entity.components.componentname
component:SomeMethod()
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `property1` | Type | Description of the property |
| `property2` | Type | Description of the property |

## Key Methods

```lua
-- Example of key methods
component:Method1()
component:Method2(param)
```

## Events

List of events the component responds to or triggers.

## Integration with Other Components

How this component works with other components.

## See also

- [Related Component](related-component.md)
- [Another Related Component](another-component.md)

## Examples

```lua
-- Full example of using the component
local function MakeEntityWithComponent()
  local inst = CreateEntity()
  
  -- Add and configure component
  inst:AddComponent("componentname")
  inst.components.componentname:Configure()
  
  return inst
end
```
```

### Function Documentation

```md
## FunctionName

Brief description of what the function does.

### Usage

```lua
local result = FunctionName(param1, param2)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| param1    | Type | Description of parameter |
| param2    | Type | Description of parameter |

### Returns

Description of return value(s)

### Example

```lua
-- Example of using the function
local result = FunctionName("test", 123)
print(result)
```
```

## Language and Style

- Write in clear, concise language
- Use present tense ("The function returns..." not "The function will return...")
- Use active voice when possible
- Define acronyms and technical terms on first use
- Break complex information into digestible sections

## Cross-Referencing

- Use relative links for cross-references:
  ```md
  [Component Name](../components/component-name.md)
  ```

- Link to relevant API documentation when mentioning functions or components

## Version Information

- Include version information when documenting API features:
  ```md
  ---
  version: 619045
  ---
  ```

- Clearly mark deprecated features and provide alternatives:
  ```md
  > **Deprecated:** This method is deprecated as of version X. Use [NewMethod](new-method.md) instead.
  ```

## Examples

Every API documentation page should include:

1. Basic usage examples
2. Examples showing integration with other components/systems
3. Complete, working code examples that can be copied and used

## Images and Diagrams

- Use images to illustrate complex concepts
- Provide alt text for all images
- Place images in the `/static/img/` directory
- Reference images using relative paths:
  ```md
  ![Description of image](/img/example.png)
  ```

By following these standards, we can maintain a high-quality, consistent documentation that helps the Don't Starve Together modding community. 