---
id: grabbable
title: Grabbable
description: Marks an entity as grabbable by players and provides a callback for custom grab conditions; however, this component is deprecated in favor of using the inventoryitem component's grabbableoverridetag.
tags: [deprecated, inventory, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 24a74a28
system_scope: inventory
---

# Grabbable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `grabbable` component marks an entity as eligible to be picked up by players (i.e., added to inventory) by automatically adding the `grabbable` tag to its entity. It supports optional custom logic via a callback function (`SetCanGrabFn`) that determines whether a specific actor can grab the item. This component is marked as deprecated by the developers, and modders are advised to use `inventoryitem.grabbableoverridetag` instead for grab condition control.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("grabbable")
-- Optional: set custom grab condition
inst.components.grabbable:SetCanGrabFn(function(inst, doer)
    return doer:HasTag("player") and doer.inventory ~= nil
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `grabbable` on construction; removes `grabbable` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (set via constructor) | Reference to the entity this component belongs to. |
| `cangrabfn` | function or `nil` | `nil` | Optional callback function `(inst, doer) -> boolean` that determines if `doer` can grab this item. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Removes the `grabbable` tag from the entity when this component is removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetCanGrabFn(fn)`
*   **Description:** Sets a custom callback function used by `CanGrab` to determine whether an entity can be grabbed.
*   **Parameters:** `fn` (function or `nil`) — function with signature `(inst, doer) -> boolean`, or `nil` to disable custom logic.
*   **Returns:** Nothing.

### `CanGrab(doer)`
*   **Description:** Checks whether the given actor (`doer`) is allowed to grab this entity.
*   **Parameters:** `doer` (Entity) — the entity attempting to grab this item.
*   **Returns:** `boolean` — `true` if grab is allowed, `false` otherwise.
*   **Error states:** Returns `false` if no custom callback is set (`cangrabfn` is `nil`).

## Events & listeners
None identified.
