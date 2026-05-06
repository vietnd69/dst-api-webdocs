---
id: selfstacker
title: Selfstacker
description: Enables items to automatically find and stack with compatible nearby items without player intervention.
tags: [inventory, stacking, automation]
sidebar_position: 10
last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: components
source_hash: e774ebe8
system_scope: inventory
---

# Selfstacker

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`SelfStacker` allows items to autonomously search for and combine with compatible stack partners within a defined radius. This component is typically used by item-stacking gnomes or automated stacking systems. It works alongside the `stackable` component to merge item stacks and coordinates bidirectionally with partner entities to prevent duplicate stacking attempts.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("selfstacker")
inst:AddComponent("stackable")
inst.components.selfstacker:SetIgnoreMovingFast(true)
inst.components.selfstacker:FindItemToStackWith()
```

## Dependencies & tags
**Components used:**
- `bait` -- checks `IsFree()` to ensure item is not trapped
- `burnable` -- checks `IsBurning()` to prevent stacking while on fire
- `inventoryitem` -- checks `IsHeld()` to ensure item is not in player inventory
- `stackable` -- uses `CanStackWith`, `Get`, `IsFull`, `Put`, `RoomLeft` for stack operations
- `Physics` -- simulation object, accesses `GetVelocity()` for movement speed checks

**Tags:**
- `selfstacker` -- added on component initialization, removed on entity removal
- `outofreach` -- excluded from stack partner search

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `searchradius` | number | `20` | Maximum distance to search for stack partners. |
| `stackpartner` | entity | `nil` | Reference to the entity this item will stack with. |
| `ignoremovingfast` | boolean/nil | `nil` | When `true`, skips velocity check in `CanSelfStack()`. |
| `stacktask` | task | `nil` | Scheduled task reference for delayed stacking operation. |
| `SELFSTACKER_MUST_TAGS` | constant (local) | `{ "selfstacker" }` | Required tags for valid stack partners in `FindItemToStackWith()`. |
| `SELFSTACKER_CANT_TAGS` | constant (local) | `{ "outofreach" }` | Excluded tags for stack partner search in `FindItemToStackWith()`. |

## Main functions
### `SetIgnoreMovingFast(ignorespeedcheck)`
* **Description:** Configures whether the component should skip the movement speed check when determining if stacking is allowed.
* **Parameters:** `ignorespeedcheck` -- boolean; if `true`, sets `ignoremovingfast` to `true`, otherwise sets to `nil`.
* **Returns:** nil
* **Error states:** None

### `CanSelfStack()`
* **Description:** Determines if the entity is eligible for automatic stacking. Checks multiple conditions: not in a trap, not burning, has room in stack, not held in inventory, not moving fast (unless ignored), and has no existing stack partner.
* **Parameters:** None
* **Returns:** `true` if all conditions pass, `false` otherwise.
* **Error states:** Errors if `inst.Physics` is nil (no nil guard before `GetVelocity()` call).

### `OnRemoveEntity()`
* **Description:** Cleanup handler called when the entity is removed. Cancels any pending stack task and removes the `selfstacker` tag.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None -- `stacktask` is nil-checked before calling `Cancel()`.

### `FindItemToStackWith()`
* **Description:** Searches within `searchradius` for a valid stack partner using `FindEntity`. When a partner is found, establishes a bidirectional link by setting the partner's `stackpartner` to this entity.
* **Parameters:** None
* **Returns:** The partner entity instance, or `nil` if no valid partner found.
* **Error states:** Errors if the found `stackpartner` does not have a `selfstacker` component (accesses `self.stackpartner.components.selfstacker.stackpartner` without nil guard).

### `DoStack()`
* **Description:** Executes the stacking operation. Cancels any existing stack task, finds a stack partner, calculates available room in this stack, retrieves items from the partner, and puts them into this entity's stack.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.inst` lacks `stackable` component (no nil guard on `self.inst.components.stackable`). Errors if `stackpartner` lacks `stackable` component (no nil guard on `self.stackpartner.components.stackable`).

### `OnEntityWake()`
* **Description:** Called when the entity becomes active (player nearby). Resets `stackpartner` to `nil`, checks if self-stacking is allowed, and schedules a `DoStack()` call with a random delay between 0-0.1 seconds.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `inst.Physics` is nil (inherited from `CanSelfStack()` call).

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified