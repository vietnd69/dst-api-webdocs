---
id: api-update-template
title: API Update Template
sidebar_position: 6
last_updated: 2023-07-06
slug: /api/update-template
---
*Last Update: 2023-07-06*
# API Update Template

This template demonstrates how to document API changes for Don't Starve Together updates. When documenting a new game update, copy this template and fill in the details.

## Game Update: [Version Number] ([Release Date])

Brief overview of the update and its major themes (e.g., "This update focuses on improving the modding API for UI components and adds new events for world generation").

### New Features

#### [Feature Name]

**Description**: Detailed explanation of the new feature or API.

**API Reference**:
```lua
-- Function signature or component definition
function NewFunction(param1, param2)
    -- Implementation details if relevant
end

-- Or for components
NewComponent = Class(function(self, inst)
    self.inst = inst
    -- Component initialization
end)
```

**Usage Example**:
```lua
-- Example of how to use the new feature
local result = NewFunction("value1", "value2")

-- Or for components
inst:AddComponent("newcomponent")
inst.components.newcomponent:SomeMethod()
```

**Notes**:
- Important considerations when using this feature
- Compatibility information
- Performance implications

### Changed APIs

#### [API Name]

**Previous Behavior**:
```lua
-- How the API worked before
local result = OldFunction(param)
```

**New Behavior**:
```lua
-- How the API works now
local result = UpdatedFunction(param, new_param)
```

**Migration Guide**:
Step-by-step instructions for updating mods to use the new API:
1. Replace calls to `OldFunction` with `UpdatedFunction`
2. Add the new required parameter `new_param`
3. Update any code that depends on the return value

**Compatibility Notes**:
- Information about backward compatibility
- Whether the old API still works (and for how long)
- Edge cases to be aware of

### Deprecated APIs

#### [API Name]

**Deprecated Function/Component**:
```lua
-- The deprecated API
local result = DeprecatedFunction(param)
```

**Recommended Alternative**:
```lua
-- The recommended replacement
local result = RecommendedFunction(param)
```

**Reason for Deprecation**:
Brief explanation of why this API is being deprecated (e.g., performance issues, design flaws, replaced by better alternatives).

**Timeline**:
Information about when the deprecated API will be removed completely.

### Removed APIs

#### [API Name]

**Removed API**:
```lua
-- The API that no longer exists
-- local result = RemovedFunction(param)
```

**Replacement**:
```lua
-- The replacement API
local result = ReplacementFunction(param)
```

**Migration Steps**:
Detailed steps for updating mods that relied on the removed API:
1. Identify all calls to `RemovedFunction`
2. Replace them with `ReplacementFunction`
3. Update any dependent code to handle different return values or behavior

## Additional Resources

- Link to official update announcement
- Link to relevant forum discussions
- Link to example mods demonstrating the new features
- Link to related documentation pages

## Known Issues

List of known issues or edge cases with the new APIs that mod developers should be aware of.

## Community Feedback

Information about how mod developers can provide feedback on the API changes or report issues they encounter. 
