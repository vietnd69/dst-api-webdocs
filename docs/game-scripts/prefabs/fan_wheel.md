---
id: fan_wheel
title: Fan Wheel
description: A client-side FX prefab that visually represents a spinning fan wheel attached to an item, synchronized with networked spinning state and cleaned up via stategraph transitions.
tags: [fx, animation, audio, networking, cleanup]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f3a7ff25
system_scope: fx
---

# Fan Wheel

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fan_wheel` prefab is a client-only FX entity that renders a spinning fan wheel as a follower of an item (e.g., when equipped or held). It synchronizes its spin state (`_isspinning`) via a `net_bool` replication token and responds to UI-driven spin events. It is not persisted and exists solely for visual and auditory feedback during item use.

The prefab delegates animation and sound logic to `CreateFanWheelFX`, which constructs a non-networked FX entity parented to the item. Cleanup is coordinated through stategraph transitions (e.g., `item_in`) or removal events to avoid mid-animation visual glitches.

## Usage example
```lua
-- The fan_wheel prefab is spawned automatically by the game when an item requires fan visuals (e.g., held by a character).
-- Modders should not manually create this prefab; instead, trigger the spin state on the parent item:
local parent = GetPlayer()
if parent.components.inventoryitem:IsHoldingItemWithTag("fan") then
    parent.components.inventoryitem.item.components.fan_wheel:SetSpinning(true)
end
```

## Dependencies & tags
**Components used:** `net_bool` (via `net_bool` helper), `Transform`, `AnimState`, `SoundEmitter`, `Follower`  
**Tags:** Adds `FX` to the FX entity created in `CreateFanWheelFX`. Does *not* add tags to the owning instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_isspinning` | `net_bool` | `false` | Networked boolean indicating whether the fan wheel is spinning; written via `SetSpinning`. |

## Main functions
### `SetSpinning(isspinning)`
*   **Description:** Updates the networked spinning state of the fan wheel and notifies the FX entity to start or stop spinning.
*   **Parameters:** `isspinning` (boolean) — `true` to begin spinning, `false` to stop.
*   **Returns:** Nothing.
*   **Error states:** No error states. Has no effect if called on a dedicated server (since the prefab is client-only).

### `StartUnequipping(item)`
*   **Description:** Initiates cleanup of the FX entity when the parent item is unequipped or removed. It ensures the FX persists during animation transitions (e.g., `item_in` state) and cleans up only when appropriate.
*   **Parameters:** `item` (Entity) — The item being unequipped.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if the item is no longer held by the parent, or if the item lacks `inventoryitem` or the parent mismatch.

## Events & listeners
- **Listens to:**  
  - `isspinningdirty` — on the FX entity, triggers `ToggleSpin` when the networked `_isspinning` value changes.  
  - `ondropped` — on the parent item, removes the FX immediately if the item is dropped.  
  - `newstate` — on the parent, detects state transitions (e.g., exiting `item_in`) to schedule or cancel removal.  
  - `onremove` — on the proxy parent, destroys the FX entity.  
- **Pushes:** None.