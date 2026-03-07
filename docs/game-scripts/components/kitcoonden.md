---
id: kitcoonden
title: Kitcoonden
description: Manages a collection of kitcoons associated with an entity, tracking their presence and responding to their removal.
tags: [creature, collection, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 035b93bc
system_scope: entity
---

# Kitcoonden

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KitcoonDen` is an entity component that maintains a dynamic collection of kitcoon entities. It provides methods to add, remove, and query the number of kitcoons attached to its owner entity. It listens for the `onremove` event on each kitcoon to automatically track when they are removed from the world, updating internal state and triggering optional callbacks (`OnAddKitcoon`, `OnRemoveKitcoon`). This component is typically used on structures or objects that host or regulate kitcoons (e.g., a den or nest).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("kitcoonden")

inst.components.kitcoonden.OnAddKitcoon = function(den_inst, kitcoon, doer)
    print("Kitcoon added to den")
end

inst.components.kitcoonden.OnRemoveKitcoon = function(den_inst, kitcoon)
    print("Kitcoon removed from den")
end

inst.components.kitcoonden:AddKitcoon(some_kitcoon, some_doer)
print(inst.components.kitcoonden:GetDebugString())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kitcoons` | table | `{}` | Map of kitcoon entities currently in the den (key and value are the entity instance). |
| `num_kitcoons` | number | `0` | Total count of kitcoons in the den. |
| `OnAddKitcoon` | function | `nil` | Optional callback fired when a kitcoon is added: `function(den_inst, kitcoon, doer)`. |
| `OnRemoveKitcoon` | function | `nil` | Optional callback fired when a kitcoon is removed: `function(den_inst, kitcoon)`. |
| `onremove_kitcoon` | function | *(internal)* | Private handler for `onremove` event on individual kitcoons. |

## Main functions
### `AddKitcoon(kitcoon, doer)`
* **Description:** Adds a kitcoon to the den’s collection. Registers an `onremove` event listener on the kitcoon to auto-remove it later. Does nothing if the kitcoon is already present.
* **Parameters:**  
  `kitcoon` (entity) — The kitcoon entity to add.  
  `doer` (entity or `nil`) — The entity responsible for adding the kitcoon (passed to the `OnAddKitcoon` callback if set).
* **Returns:** Nothing.

### `RemoveKitcoon(kitcoon)`
* **Description:** Removes a specific kitcoon from the den, decrementing the count and unregistering its `onremove` listener.
* **Parameters:**  
  `kitcoon` (entity) — The kitcoon entity to remove.
* **Returns:** Nothing.

### `RemoveAllKitcoons()`
* **Description:** Removes all kitcoons from the den, invoking removal logic for each.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing the current number of kitcoons.
* **Parameters:** None.
* **Returns:**  
  `string` — Format: `"Count:"` followed by the number of kitcoons (e.g., `"Count:3"`).

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from its entity. Ensures all kitcoons are properly untracked.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — On each added kitcoon, to trigger automatic removal from the den when the kitcoon is destroyed or removed from the world.
