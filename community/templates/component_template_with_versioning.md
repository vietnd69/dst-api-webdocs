---
id: component_name
title: ComponentName
sidebar_position: 1
api_version: 0.5.2
last_updated: 2024-07-10
---
*Last Update: 2023-07-06*
# ComponentName

*Added in API version: 0.5.2*  
*Last game build tested: 619045*

## Overview

Brief description of what the component does and its purpose.

## Basic Usage Example

```lua
-- Basic example of how to use the component
local myEntity = TheWorld.entity
local myComponent = myEntity:AddComponent("component_name")
myComponent:SomeFunction(params)
```

## Properties

| Property | Type | Description | Added In |
|----------|------|-------------|----------|
| property1 | Type | Description of property1 | 0.5.0 |
| property2 | Type | Description of property2 | 0.5.2 |
| property3 | Type | Description of property3 (deprecated in 0.6.0) | 0.4.0 |

## Methods

### SomeFunction(param1, param2)

*Added in API version: 0.5.0*

Description of what the function does.

**Parameters**
- `param1` (Type): Description of param1
- `param2` (Type): Description of param2

**Returns**
- (ReturnType): Description of return value

**Example**
```lua
local result = myComponent:SomeFunction("value1", 123)
```

### AnotherFunction(param)

*Added in API version: 0.5.2*

Description of what the function does.

**Parameters**
- `param` (Type): Description of param

**Returns**
- (ReturnType): Description of return value

**Example**
```lua
local result = myComponent:AnotherFunction(value)
```

## Integration with Other Components

Explanation of how this component interacts with other components in the system.

## Complete Code Example

```lua
-- Full example demonstrating the component in a real-world scenario
local entity = TheWorld.entity
local component = entity:AddComponent("component_name")

-- Configure the component
component.property1 = "value1"
component.property2 = 123

-- Use the component
local result = component:SomeFunction("test", 42)
print(result)

-- Cleanup
entity:RemoveComponent("component_name")
```

## Common Issues and Solutions

List of common issues developers might encounter and how to solve them.

## Version History

| API Version | Game Build | Changes |
|-------------|------------|---------|
| 0.5.2 | 619045 | Added `AnotherFunction()` and `property2` |
| 0.5.0 | 587581 | Component introduced with `SomeFunction()` and `property1` |

## See Also

- [RelatedComponent1](./related_component1.md)
- [RelatedComponent2](./related_component2.md)
- [System that uses this component](../systems/system_name.md) 