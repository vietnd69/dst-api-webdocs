---
id: leif
title: Leif
description: Boss monster prefab that manages scale-based scaling, hibernation states, sanity aura, and integration with combat, health, and sleep systems.
tags: [combat, boss, ai, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7d13dfbd
system_scope: world
---

# Leif

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`leif` is a boss prefab implementation in DST representing a hostile tree monster. It integrates multiple core systems including combat, health, locomotion, sanity, burnable, freezable, sleeper, lootdropper, and acid infusible components. The prefab supports two visual variants—normal and sparse—via different build animations, and manages dynamic scaling via `SetLeifScale`. State persistence is handled through custom `OnPreLoad`, `OnLoad`, and `OnSave` callbacks to preserve scale, sleep status, hibernation state, and houndfriend tag across saves.

## Usage example
```lua
-- Create a Leif instance and apply custom scaling
local inst = Prefab("leif", ...)
inst:SetLeifScale(1.2)

-- Check sleep state and wake if needed
if inst.components.sleeper:IsAsleep() then
    -- Sleep state is persistent and controlled via sleeper
    -- No explicit wake function is defined; wake occurs via game logic
end
```

## Dependencies & tags
**Components used:** `locomotor`, `sanityaura`, `burnable`, `propagator`, `health`, `combat`, `sleeper`, `lootdropper`, `inspectable`, `drownable`, `acidinfusible`  
**Tags added:** `epic`, `smallepic`, `monster`, `hostile`, `leif`, `tree`, `evergreens`, `largecreature`, `houndfriend` (conditional on save data)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_scale` | number or nil | `nil` (if `scale == 1`) | Internal scale factor used for save data; set only when `scale ~= 1`. |
| `override_combat_fx_size` | string | `"med"` | Overrides combat effect size for visual feedback. |
| `override_combat_fx_height` | string | `"high"` | Overrides combat effect height for visual feedback. |
| `scrapbook_anim` | string | `"idle_loop"` | Animation used in the scrapbook interface. |

## Main functions
### `SetLeifScale(inst, scale)`
*   **Description:** Applies dynamic scaling to Leif's physical and combat properties. Updates transform scale, physics capsule, shadow size, walk speed, damage, range, and health while preserving current health percentage.
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.  
    * `scale` (number) — Scale multiplier (e.g., `1.5`). A value of `1` sets `_scale` to `nil`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst` is invalid or missing required components.

### `onpreloadfn(inst, data)`
*   **Description:** Loads persistent scaling data from save file during pre-load phase.
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.  
    * `data` (table or nil) — Save data table containing optional `leifscale` key.
*   **Returns:** Nothing.
*   **Error states:** Calls `SetLeifScale` only if `data.leifscale` is non-nil.

### `onloadfn(inst, data)`
*   **Description:** Restores persistent sleeper, houndfriend, and sleep state from save data after component initialization.
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.  
    * `data` (table or nil) — Save data table with optional keys: `hibernate`, `sleep_time`, `sleeping`, `houndfriend`.
*   **Returns:** Nothing.
*   **Error states:** Skips restoration if `data` is `nil`.

### `onsavefn(inst, data)`
*   **Description:** Serializes persistent state data (scale, houndfriend tag, sleep status, hibernation) into the save data table.
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.  
    * `data` (table) — Save data table to populate.
*   **Returns:** Nothing.

### `CalcSanityAura(inst)`
*   **Description:** Dynamic sanity aura function. Returns a larger negative aura when Leif has an active combat target; otherwise, returns a smaller negative aura.
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.
*   **Returns:** `number` — Sanity delta per tick (e.g., `-TUNING.SANITYAURA_LARGE` or `-TUNING.SANITYAURA_MED`).

### `OnBurnt(inst)`
*   **Description:** Called when Leif finishes burning. Enables `acceptsheat` on the propagator component once burning completes (but only if not already dead).
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Event handler invoked when Leif is attacked. Sets the attacker as Leif's combat target.
*   **Parameters:**  
    * `inst` (Entity) — The Leif entity instance.  
    * `data` (table) — Attack event data containing `attacker`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — Triggers `OnAttacked` to update combat target on damage received.
- **Pushes:** No events directly. Relies on component events (e.g., `gotosleep` via `sleeper`), but none are explicitly pushed here.
