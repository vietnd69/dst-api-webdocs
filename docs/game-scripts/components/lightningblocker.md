---
id: lightningblocker
title: Lightningblocker
description: Manages lightning protection range and strike handling for an entity, adding or removing the `lightningblocker` tag based on block range.
tags: [lightning, protection, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: adc04430
system_scope: entity
---

# Lightningblocker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LightningBlocker` is an entity component that defines a circular area around an entity where lightning strikes are blocked. It dynamically manages the `lightningblocker` tag on its owning entity based on whether the current distance squared (`rsq`) to a lightning strike point falls outside the defined block radius. It also supports custom logic to be executed when a lightning strike occurs within range.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lightningblocker")
inst.components.lightningblocker:SetBlockRange(5) -- blocks lightning within 5 units
inst.components.lightningblocker:SetOnLightningStrike(function(sender, pos)
    print("Lightning blocked at", pos.x, pos.y, pos.z)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `lightningblocker` when within block range, removes it otherwise.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `block_rsq` | number? | `0` | Squared radius of the lightning block area. If `0` or `nil`, no blocking occurs. |

## Main functions
### `SetBlockRange(newrange)`
*   **Description:** Sets the maximum radius (in units) within which lightning strikes are blocked. Internally stores the squared radius (`newrange * newrange`) for performance.
*   **Parameters:** `newrange` (number?) - desired blocking radius. Use `nil` or `0` to disable blocking.
*   **Returns:** Nothing.

### `SetOnLightningStrike(fn)`
*   **Description:** Registers a callback function to be invoked when a lightning strike occurs within the block range.
*   **Parameters:** `fn` (function?) - callback accepting `(sender: Entity, pos: Vector3)` arguments. Set to `nil` to clear.
*   **Returns:** Nothing.

### `DoLightningStrike(pos)`
*   **Description:** Triggers the registered strike callback (if any) for the given position. Typically called by external logic when a strike occurs near this blocker.
*   **Parameters:** `pos` (Vector3) - world position of the lightning strike.
*   **Returns:** Nothing.
*   **Error states:** No-op if `on_strike` callback is `nil`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  

### `onblock_rsq(self, newrsq)`
*Internal helper function called when the squared distance to a lightning strike changes.*  
*   **Description:** Updates the `lightningblocker` tag based on whether `newrsq` exceeds the block range. `newrsq > EPSILON` means outside the block radius → tag is added; otherwise removed.  
*   **Parameters:**  
  - `newrsq` (number?) — squared distance from blocker center to strike point. `nil` disables blocking.  
*   **Returns:** Nothing.  
*   **Behavior:** Sets `self.inst:AddTag("lightningblocker")` when `newrsq > 0.001`, else `self.inst:RemoveTag("lightningblocker")`.  

### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when component is removed. Ensures the `lightningblocker` tag is always removed.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

## Notes
- The component does not directly listen to or trigger lightning-related events. External systems (e.g., world lightning manager) must call `DoLightningStrike` or update internal state via the `onblock_rsq` setter when the entity's tag needs toggling.
- Distance checks use squared distance (`rsq`) to avoid expensive square root calculations — a common DST optimization pattern.
- The `block_rsq` property is exposed as a public setter via metatable mapping (`{ block_rsq = onblock_rsq }`), enabling value changes to auto-update the tag.
