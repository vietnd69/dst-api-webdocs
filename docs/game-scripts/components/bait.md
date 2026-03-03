---
id: bait
title: Bait
description: Manages bait behavior for traps, handling attachment to and detachment from trap entities via lifecycle events.
tags: [trap, inventory, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 56a0893d
system_scope: world
---

# Bait

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Bait` component enables an entity to function as bait for traps. It tracks an optional association with a trap entity (`self.trap`) and responds to key lifecycle events (`onremove`, `onpickup`, `oneaten`, `onstolen`) to notify the trap of bait state changes. When the bait is removed or stolen without a connected trap, it attempts to give itself to the thief’s inventory.

## Usage example
```lua
local inst = Prefab("bait_item", ...)
inst:AddComponent("bait")
-- Attach to a trap (e.g., a snare)
inst.components.bait.trap = some_trap
-- When bait is eaten, stolen, or removed, the trap is notified automatically.
```

## Dependencies & tags
**Components used:** `inventory` (accessed only on thieves during `onstolen` when no trap is attached)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trap` | entity or `nil` | `nil` | Reference to the trap this bait is attached to. Set externally; not managed by this component. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a string representation for debugging, showing the current trap reference.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"Trap:"..tostring(trap)`, e.g., `"Trap:table"` or `"Trap:nil"`.

### `IsFree()`
* **Description:** Indicates whether this bait is currently unattached to any trap.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `trap` is `nil`, otherwise `false`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from its entity. Unregisters all event callbacks to prevent memory leaks.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` — triggers `OnRemove`, which notifies the attached trap (if any) via `trap:RemoveBait()`.  
  - `onpickup` — triggers `OnRemove`, same behavior as above.  
  - `oneaten` — triggers `OnEaten`, which notifies the attached trap via `trap:BaitTaken(eater)` if attached.  
  - `onstolen` — triggers `OnStolen`:  
    - If a trap is attached, calls `trap:BaitTaken(thief)`.  
    - Otherwise, gives the bait entity to the thief’s inventory via `thief.components.inventory:GiveItem(inst)`.

- **Pushes:** None.
