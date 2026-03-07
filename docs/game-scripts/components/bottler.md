---
id: bottler
title: Bottler
description: Provides a mechanism to bottle certain entities, invoking a customizable callback when the action succeeds.
tags: [entity, interaction, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fef73250
system_scope: entity
---

# Bottler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Bottler` is a lightweight component that enables an entity to perform a "bottle" action on a compatible target entity. It does not implement the actual bottling logic directly but delegates it to a callback function configured via `SetOnBottleFn`. The component checks if the target entity is valid and carries the `canbebottled` tag before invoking the callback. This pattern allows flexible, mod-defined behavior for bottling mechanics (e.g., capturing critters in jars).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bottler")
inst.components.bottler:SetOnBottleFn(function(bottler_inst, target, doer)
    -- Custom bottling logic here (e.g., remove target, add item)
    target:Remove()
    doer.components.container:GetInventory():PushItem(spawnprefab("bottled_target"))
    return true
end)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Checks for `canbebottled` on target entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onbottlefn` | function or `nil` | `nil` | Callback invoked when `Bottle` is called and conditions are met. Signature: `fn(bottler_inst, target, doer)` returning `true` on success. |

## Main functions
### `SetOnBottleFn(fn)`
*   **Description:** Sets the callback function to be invoked when bottling is attempted and conditions are satisfied.
*   **Parameters:** `fn` (function or `nil`) — The callback to execute on successful bottling. Expected to take three arguments: the bottler entity instance, the target entity instance, and the entity performing the action (`doer`). Should return `true` to indicate success.
*   **Returns:** Nothing.

### `Bottle(target, doer)`
*   **Description:** Attempts to bottle the given `target` entity using the current `doer`. Validates that `target` exists, is valid, and has the `canbebottled` tag, and that `onbottlefn` is set. If all conditions pass, invokes the callback and returns its result.
*   **Parameters:**
    *   `target` (Entity or `nil`) — The entity to bottle. Must be valid and have the `canbebottled` tag.
    *   `doer` (Entity or `nil`) — The entity performing the bottling action (e.g., a player).
*   **Returns:** `true` if the callback was invoked and returned `true`; otherwise `false`.
*   **Error states:** Returns `false` if `onbottlefn` is not set, `target` is `nil`/invalid, or `target:HasTag("canbebottled")` is `false`.

## Events & listeners
None identified.
