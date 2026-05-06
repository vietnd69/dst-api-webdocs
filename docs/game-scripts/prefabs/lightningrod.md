---
id: lightningrod
title: Lightningrod
description: Spawnable structure entity that attracts lightning strikes, stores electrical charge for up to 3 days, and can be used as a battery component by other devices.
tags: [prefab, structure, electricity, battery]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 8029a04d
system_scope: entity
---

# Lightningrod

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`lightningrod.lua` registers a spawnable structure entity that serves dual purposes: attracting lightning strikes during storms and storing electrical charge that can be consumed by battery-powered devices. The prefab's `fn()` constructor builds the physics body, light emitter, and client-side components; server-side logic (after `TheWorld.ismastersim` check) attaches gameplay components including `workable`, `lootdropper`, `inspectable`, and `battery`. The lightningrod holds 1 charge that decays over 3 days (tracked as `chargeleft` counter), not 3 separate charges. Instantiated with `SpawnPrefab("lightning_rod")`.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("lightning_rod")
inst.Transform:SetPosition(0, 0, 0)

-- Check charge status:
if inst.charged then
    print("Charges remaining: " .. tostring(inst.chargeleft))
end
```

## Dependencies & tags
**External dependencies:**
- `prefabutil` -- utility functions for prefab construction (MakeSnowCoveredPristine, MakeHauntableWork, etc.)

**Components used:**
- `lootdropper` -- drops loot when hammered to destruction
- `workable` -- enables hammering with 4 work units, HAMMER action
- `inspectable` -- provides status string via `getstatus` callback
- `battery` -- allows other devices to consume stored charge via callback functions

**Tags:**
- `structure` -- added in fn() for targeting and loot rules
- `lightningrod` -- added in fn() for lightning attraction logic

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries for animation banks and minimap icon. |
| `prefabs` | table | `{"lightning_rod_fx", "collapse_small"}` | Dependent prefab names spawned for effects and destruction FX. |
| `inst.charged` | boolean | `false` | Whether the lightningrod currently holds electrical charge. Set by `setcharged()`. |
| `inst.chargeleft` | number | `nil` | Number of days of charge remaining. Starts at 3 when struck by lightning, decrements daily. |
| `inst.zaptask` | task | `nil` | Scheduled task reference for periodic zap effects. Cancelled on discharge. |
| `inst.Light` | component | --- | Light emitter configured with orange colour (235/255, 121/255, 12/255), radius 1.5, intensity 0.5. |
| `inst.scrapbook_specialinfo` | string | `"LIGHTNINGROD"` | Identifier for scrapbook/codex entries. |

## Main functions
### `fn()`
* **Description:** Client-side prefab constructor. Creates the entity, adds Transform, AnimState, MiniMapEntity, Light, SoundEmitter, and Network components. Configures light properties, sets animation bank/build, adds tags, and returns `inst`. On master sim, continues to attach gameplay components (lootdropper, workable, inspectable, battery), registers event listeners, and sets save/load hooks.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server). Server-side component attachment skipped on clients via `TheWorld.ismastersim` guard.

### `onhammered(inst, worker)`
* **Description:** Callback when hammering work completes (4 work units). Drops loot via `lootdropper:DropLoot()`, spawns `collapse_small` destruction FX at entity position with metal material, then removes the entity.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `worker` -- player entity performing the hammering
* **Returns:** None
* **Error states:** Errors if `inst.components.lootdropper` is nil (should not occur — component added in fn()).

### `onhit(inst, worker)`
* **Description:** Callback when work is performed (each hammer hit). Plays "hit" animation then pushes "idle" animation to queue.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `worker` -- player entity performing the hammering
* **Returns:** None
* **Error states:** None.

### `dozap(inst)`
* **Description:** **Scheduled task.** Creates visual and audio zap effects. Cancels existing `zaptask` if present, plays lightningrod sound, spawns `lightning_rod_fx` prefab at entity position, then schedules next zap after random 10-40 seconds. Called repeatedly while charged.
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** None
* **Error states:** None — guards `zaptask` nil check before cancel.

### `discharge(inst)`
* **Description:** Removes all charge from the lightningrod. Stops watching world state "cycles", clears bloom effect handle, sets `charged` to false, clears `chargeleft`, disables light emitter, and cancels `zaptask`. Called when charge depletes or consumed by battery.
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** None
* **Error states:** None — guards `zaptask` nil check before cancel.

### `setcharged(inst, charges)`
* **Description:** Sets the lightningrod to charged state with specified charge amount. If not already charged, enables bloom effect, enables light, starts watching "cycles" world state, and sets `charged` to true. Sets `chargeleft` to maximum of current or new charges, then triggers `dozap()`.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `charges` -- number of charge days to set (typically 3 from lightning strike)
* **Returns:** None
* **Error states:** None.

### `onlightning(inst)`
* **Description:** Handler for `lightningstrike` event. Plays hit animation and sets charge to 3 days via `setcharged()`.
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** None
* **Error states:** None.

### `ondaycomplete(inst)`
* **Description:** Handler for day cycle completion. Triggers `dozap()` visual effect. If `chargeleft` is greater than 1, decrements by 1. Otherwise (`chargeleft` is 1 or less), calls `discharge()` to fully deplete charge.
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** None
* **Error states:** None — assumes `chargeleft` is valid when called (guarded by world state watch).

### `OnSave(inst, data)`
* **Description:** Save hook. Writes `charged` and `chargeleft` to save data table if entity is currently charged.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `data` -- table to populate with save state
* **Returns:** None
* **Error states:** None.

### `OnLoad(inst, data)`
* **Description:** Load hook. Restores charge state from save data if `data.charged` is true and `data.chargeleft` is valid (>0). Calls `setcharged()` with loaded value.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `data` -- table containing saved state
* **Returns:** None
* **Error states:** None — guards all data access with nil checks.

### `getstatus(inst)`
* **Description:** Inspectable status callback. Returns "CHARGED" string if entity is charged, otherwise returns `nil` (no status displayed).
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** "CHARGED" string or `nil`
* **Error states:** None.

### `CalcActualCharge(inst)` (local)
* **Description:** **Code note:** V2C comment states lightningrod holds 1 charge that decays over 3 days, NOT 3 separate charges. Calculates actual usable charge value as `chargeleft - (ceil(chargeleft) - 1)`. Returns fractional charge representation for battery consumption logic.
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** number representing actual charge, or `nil` if `chargeleft` is nil
* **Error states:** None.

### `CanBeUsedAsBattery(inst, user, mult)`
* **Description:** Battery component callback. Determines if lightningrod can power a device. If `mult` (multiplier/charge cost) is provided, checks if `actual_charge >= mult`. Otherwise returns true if `charged` is true. Returns false with "NOT_ENOUGH_CHARGE" error string if insufficient charge.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `user` -- entity attempting to use the battery
  - `mult` -- charge multiplier/cost required (optional)
* **Returns:** `true` if usable, or `false, "NOT_ENOUGH_CHARGE"` if not
* **Error states:** None.

### `UseAsBattery(inst, user, mult)`
* **Description:** Battery component callback. Consumes charge from the lightningrod. If `mult` is provided and `actual_charge > mult`, triggers `dozap()` and decrements `chargeleft` by `mult`. Otherwise calls `discharge()` to fully deplete.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `user` -- entity consuming the battery
  - `mult` -- charge multiplier/cost to consume (optional)
* **Returns:** None
* **Error states:** None.

### `ResolvePartialChargeMult(inst, user, mult)`
* **Description:** Battery component callback. Returns the actual charge amount that can be consumed, capped at the requested `mult`. Used when device requests more charge than available.
* **Parameters:**
  - `inst` -- lightningrod entity
  - `user` -- entity consuming the battery
  - `mult` -- requested charge multiplier
* **Returns:** number (minimum of `mult` and `actual_charge`), or `mult` if no charge available
* **Error states:** None.

### `onbuilt(inst)`
* **Description:** Handler for `onbuilt` event. Plays "place" animation, pushes "idle" to queue, and plays craft sound.
* **Parameters:** `inst` -- lightningrod entity
* **Returns:** None
* **Error states:** None.

## Events & listeners
- **Listens to:** `lightningstrike` -- triggers `onlightning()` to add 3 days of charge.
- **Listens to:** `onbuilt` -- triggers `onbuilt()` for placement animation and sound.
- **Watches:** `cycles` world state -- triggers `ondaycomplete()` at day end to decrement charge.
- **Pushes:** None directly (lootdropper component pushes `entity_droploot` on destruction).