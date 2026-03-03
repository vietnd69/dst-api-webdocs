---
id: beard
title: Beard
description: Manages beard growth, appearance, and related inventory mechanics for bearded characters in DST.
tags: [entity, inventory, progression]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e56c7fff
system_scope: entity
---

# Beard

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `beard` component tracks growth progress, visual state, and gameplay effects for bearded characters (e.g., Wilson, Webber). It responds to world cycles (days), updates beard length via registered callbacks, adjusts insulation, manages beard-sack inventory slots, and supports persistence and skill-tree bonuses.

It depends on and integrates with the `skilltreeupdater`, `inventory`, `sanity`, and `container` components to deliver dynamic, progression-based beard behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("beard")
inst.components.beard:AddCallback(5, function(beard_inst, skinname)
    -- beard reaches 5 bits
    beard_inst.components.health:SetMaxHealth(150)
end)
inst.components.beard:SetSkin("wilson")
```

## Dependencies & tags
**Components used:** `skilltreeupdater`, `inventory`, `sanity`, `container`  
**Tags:** Adds `bearded` on initialization; removes it on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `daysgrowth` | number | `0` | Total growth days accumulated (including bonus days from skills). |
| `daysgrowthaccumulator` | number | `0` | Fractional growth accumulator for skill-based bonus days. |
| `callbacks` | table | `{}` | Map from day level (integer) to callback function `(inst, skinname) → nil`. |
| `prize` | string or `nil` | `nil` | Prefab name dropped when shaving removes bits (e.g., `"beefalobit"`). |
| `bits` | number | `0` | Current beard length in "bits", capped by `daysgrowth`. |
| `insulation_factor` | number | `1` | Multiplier applied to total insulation (e.g., for seasonal skins). |
| `pause` | boolean or `nil` | `nil` | If truthy, disables growth progression. |
| `skinname` | string | `"wilson"` | Identifier used when invoking callbacks (e.g., `"wilson"`, `"webber"`). |
| `canshavetest` | function or `nil` | `nil` | Optional filter function `(beard_inst, shaver) → pass, reason`. |

## Main functions
### `EnableGrowth(enable)`
*   **Description:** Starts or stops watching the `"cycles"` world state to trigger growth per day.
*   **Parameters:** `enable` (boolean) — whether to enable growth.
*   **Returns:** Nothing.

### `GetInsulation()`
*   **Description:** Computes insulation provided by the current beard length and active skill modifiers.
*   **Parameters:** None.
*   **Returns:** number — total insulation value.

### `ShouldTryToShave(who, whithwhat)`
*   **Description:** Checks whether the beard can be shaved by the given entity.
*   **Parameters:**  
    `who` (Entity) — the entity attempting to shave.  
    `whithwhat` — unused, retained for API consistency.  
*   **Returns:** `pass` (boolean), `reason` (string) — `pass` is `true` only if bits exist and `canshavetest` passes.

### `Shave(who, withwhat)`
*   **Description:** Reduces beard length by rewinding callbacks and bits; optionally drops prize items and grants sanity to self.
*   **Parameters:**  
    `who` (Entity) — the shaver.  
    `withwhat` — unused.  
*   **Returns:** `true` on success; returns `false, reason` on failure.
*   **Error states:** Returns `false, "NOBITS"` if beard has no bits.

### `AddCallback(day, cb)`
*   **Description:** Registers a callback to be invoked when beard reaches or exceeds the given growth day.
*   **Parameters:**  
    `day` (integer) — growth level at which to trigger.  
    `cb` (function) — `(beard_inst, skinname) → nil`.  
*   **Returns:** Nothing.

### `Reset()`
*   **Description:** Resets growth to zero and clears bits; invokes `onreset` callback if present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetSkin(skinname)`
*   **Description:** Sets the current skin identifier and re-invokes all callbacks up to current growth.
*   **Parameters:** `skinname` (string) — e.g., `"wilson"`, `"webber"`.
*   **Returns:** Nothing.

### `UpdateBeardInventory()`
*   **Description:** Ensures the equipped beard sack matches the current beard level (based on bits and skill activation `wilson_beard_7`). Equips or replaces the sack, transferring contained items.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string.
*   **Parameters:** None.
*   **Returns:** `string` — format: `"Bits: X Daysgrowth: Y Next Event: Z"`.

### `GetBeardSkinAndLength()`
*   **Description:** Returns networkable beard data for client-side rendering (e.g., oversized veggie pictures).
*   **Parameters:** None.
*   **Returns:** `skinname` (string), `length` (integer) — only if `length > 0`; otherwise `nil`.

## Events & listeners
- **Listens to:** `ms_respawnedfromghost` — calls `Reset()` on respawn.
- **Pushes:** `shaved` — fired after successful shave operation.

## Lifecycle & persistence
- **OnSave()**: Returns `{ growth, growthaccumulator, bits, skinname }`. (Note: The current implementation returns early and `nil`s the table — likely unintentional; preserved as-is from source.)
- **OnLoad(data)**: Restores `bits`, `growth`, `growthaccumulator`, and `skinname`; re-invokes callbacks up to loaded `daysgrowth`.
- **LoadPostPass(newents, data)**: Calls `UpdateBeardInventory()` to ensure correct sack state after deserialization.
