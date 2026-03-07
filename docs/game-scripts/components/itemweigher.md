---
id: itemweigher
title: Itemweigher
description: Manages trophy scale type tagging and provides a hook for weighing in items.
tags: [inventory, entity, tags]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b949240c
system_scope: inventory
---

# Itemweigher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ItemWeigher` is a lightweight component that manages a `type` property and dynamically updates entity tags (`trophyscale_<type>`) when that type changes. It also provides a callback mechanism (`ondoweighinfn`) for executing custom logic during a weighing-in operation. This component is typically attached to trophy scale entities to support dynamic visual/type updates and integrate with gameplay actions like weighing in a trophy.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("itemweigher")

inst.components.itemweigher:SetOnDoWeighInFn(function(inst, target, doer)
    print("Weighing in:", target:GetDescription(), "by", doer:GetName())
    return true
end)

inst.components.itemweigher.type = "giraffe"
inst.components.itemweigher:DoWeighIn(some_target, player)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds and removes tags in the form `trophyscale_<type>` (e.g., `trophyscale_giraffe`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string or `nil` | `nil` | The current trophy scale type. Changing this property triggers tag updates via the `ontype` handler. |
| `ondoweighinfn` | function or `nil` | `nil` | Callback function invoked by `DoWeighIn`. Takes `(inst, target, doer)` and returns a value (typically boolean or `nil`). |

## Main functions
### `SetOnDoWeighInFn(fn)`
* **Description:** Assigns the callback function used during a weighing-in operation. This function is called by `DoWeighIn`.
* **Parameters:** `fn` (function) - A function accepting three arguments: `inst` (this component's entity), `target` (the item being weighed in), and `doer` (the entity performing the weigh-in). Should return a value (often used to indicate success/failure).
* **Returns:** Nothing.

### `DoWeighIn(target, doer)`
* **Description:** Executes the stored weighing-in callback if it exists.
* **Parameters:**  
  - `target` (Entity) - The item/entity being weighed in.  
  - `doer` (Entity) - The entity performing the weigh-in (e.g., a player).
* **Returns:** The return value of `ondoweighinfn`, or `nil` if no callback is set.
* **Error states:** Returns `nil` if `ondoweighinfn` is `nil`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  

### Tag management side effect
- When `type` is assigned, the `ontype` handler automatically:
  - Removes the old tag `trophyscale_<old_type>` (if `old_type` is not `nil`).
  - Adds the new tag `trophyscale_<type>` (if `type` is not `nil`).  
This occurs only during property assignment and is not exposed as an event listener or pusher.
