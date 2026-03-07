---
id: desiccant
title: Desiccant
description: Manages the drying behavior and wetness state of desiccant items, interacting with the InventoryItemMoisture and MoistureAbsorberSource components to regulate item drying when attached to entities.
tags: [inventory, moisture, drying, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b94b8ad5
system_scope: inventory
---

# Desiccant

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`desiccant` is a prefab constructor that creates a drying item used to reduce wetness in the environment. It leverages the `inventoryitemmoisture` and `moistureabsorbersource` components to manage moisture absorption and drying behavior. The item updates its visual wetness prefix and emits sound effects in response to moisture changes, and integrates with the fire-melting system to disable drying while burning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("inventoryitemmoisture")
inst:AddComponent("inventoryitem")
inst:AddComponent("moistureabsorbersource")

inst.components.inventoryitemmoisture:SetExternallyControlled(true)
inst.components.inventoryitemmoisture:SetOnlyWetWhenSaturated(true)
inst.components.inventoryitemmoisture:SetOnMoistureDeltaCallback(my_callback)

local rate_fn = function(inst, rate) return TUNING.DESICCANT_DRY_RATE end
local apply_fn = function(inst, rate, dt) inst.components.inventoryitemmoisture:DoDelta(rate * dt) end
inst.components.moistureabsorbersource:SetGetDryingRateFn(rate_fn)
inst.components.moistureabsorbersource:SetApplyDryingFn(apply_fn)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inventoryitemmoisture`, `moistureabsorbersource`, `inspectable`  
**Tags added:** `meltable`  
**Tags checked:** `inventoryitemmoisture`, `inventoryitem`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_playsfx` | NetEvent | `net_event(GUID, "desiccant.playsfx")` | Networked event used to play sound effects on clients. |
| `_isdamp` | NetBool | `net_bool(GUID, "desiccant.isdamp", "isdampdirty")` | Networked boolean indicating whether the item is damp (0 < moisture < MAX_WETNESS). |
| `_playsfx_threshold` | number | `nil` | Tracks moisture level at which last SFX was played; used for delta-based SFX triggering. |

## Main functions
### `IsFull(inst)`
*   **Description:** Determines whether the item is fully saturated (wetness ≥ `TUNING.MAX_WETNESS`).
*   **Parameters:** `inst` (entity) - the entity instance with `inventoryitemmoisture` component.
*   **Returns:** `true` if fully wet, `false` otherwise.

### `GetRate(inst, rate)`
*   **Description:** Returns the drying rate when the item is not fully saturated; returns zero otherwise.
*   **Parameters:** `inst` (entity), `rate` (unused number).
*   **Returns:** `TUNING.DESICCANT_DRY_RATE` if not full, else `0`.

### `ApplyDrying(inst, rate, dt)`
*   **Description:** Applies drying to the item's moisture level using the base drying rate and delta time.
*   **Parameters:** `inst` (entity), `rate` (unused number), `dt` (number) - time elapsed since last frame.
*   **Returns:** Nothing. Calls `inventoryitemmoisture:DoDelta(rate * dt)`.

### `GetRate_Boosted(inst, rate)`
*   **Description:** Similar to `GetRate`, but uses the boosted drying rate for the `desiccantboosted` variant.
*   **Parameters:** `inst` (entity), `rate` (unused number).
*   **Returns:** `TUNING.DESICCANTBOOSTED_DRY_RATE` if not full, else `0`.

### `ApplyDrying_Boosted(inst, rate, dt)`
*   **Description:** Applies drying using the boosted drying rate.
*   **Parameters:** `inst` (entity), `rate` (unused number), `dt` (number).
*   **Returns:** Nothing. Calls `inventoryitemmoisture:DoDelta(rate * dt)`.

### `OnIsDampDirty(inst)`
*   **Description:** Updates the item's wetness prefix (`wet_prefix`, `always_wet_prefix`) based on damp/full status and triggers tooltip update if changed.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Sets `wet_prefix` to `STRINGS.WET_PREFIX.GENERIC` when dry; sets to `DESICCANT` when damp; `DESICCANT_FULL` when saturated.

### `OnMoistureDeltaCallback(inst, oldmoisture, newmoisture)`
*   **Description:** Responds to moisture changes by updating the `_isdamp` state, triggering tooltip update, and optionally playing sound effects when moisture changes cross the threshold.
*   **Parameters:** `inst` (entity), `oldmoisture` (number), `newmoisture` (number).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `firemelt` - calls `OnFireMelt` to disable external moisture control (drying stops while burning).  
  `stopfiremelt` - calls `OnStopFireMelt` to re-enable moisture control.  
  `onputininventory` - calls `OnStopFireMelt` (ensures drying resumes when picked up after burning).  
  `desiccant.playsfx` (client-only) - triggers `OnPlaySFX` to broadcast `item_buff_changed`.  
  `isdampdirty` (client-only) - triggers `OnIsDampDirty` to update visuals and tooltips.
- **Pushes:**  
  `inventoryitem_updatetooltip` - fired when wetness prefix changes (inside `OnIsDampDirty`).  
  `item_buff_changed` (via `ThePlayer:PushEvent`) when SFX triggers.