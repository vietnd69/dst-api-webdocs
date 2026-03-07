---
id: coldfire
title: Coldfire
description: Manages the behavior and fuel dynamics of the cold fire structure, including burning, extinguishing, and fuel consumption modified by rain conditions.
tags: [environment, fire, fuel]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c68acb59
system_scope: environment
---

# Coldfire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `coldfire` prefab represents a special fire that burns blue instead of orange, functioning as a campfire variant. It integrates multiple components to manage its state: `burnable` for ignition and flame effects, `fueled` for fuel consumption and stage tracking, `workable` for hammering, and `hauntable` for haunt interactions. Rain reduces its fuel consumption rate. When fully consumed, it degrades into ash and removes itself after a short delay.

## Usage example
```lua
local coldfire = SpawnPrefab("coldfire")
coldfire.Transform:SetPosition(x, y, z)
coldfire.components.fueled:DoDelta(TUNING.COLDFIRE_FUEL_MAX) -- Refuel fully
coldfire.components.burnable:Ignite() -- Light the fire
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `workable`, `inspectable`, `hauntable`, `storytellingprop`, `lootdropper`, `sound_emitter`, `transform`, `animstate`, `network`, `physics`
**Tags:** Adds `campfire`, `blueflame`, `NPC_workable`, `storytellingprop`, `NOCLICK` (after erosion begins).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefabs` | array of strings | `{"coldfirefire", "collapse_small", "ash"}` | Prefabs spawned during lifecycle events (fire FX, collapse, ash). |
| `assets` | array of assets | `{"ANIM", "anim/coldfire.zip"}` | Asset required for animation. |

## Main functions
### `updatefuelrate(inst)`
* **Description:** Dynamically adjusts the fuel consumption rate based on rain intensity. Rain reduces the rate if the fire is not rain-immune.
* **Parameters:** `inst` (Entity) — the coldfire entity instance.
* **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst)`
* **Description:** Handles transitions between fuel stages (0–4). Extinguishes when empty, reignites if fueled, updates animations, and triggers FX. Also performs degradation when fully consumed.
* **Parameters:** 
  - `newsection` (number) — current fuel stage (0–4).
  - `oldsection` (number) — previous fuel stage.
  - `inst` (Entity) — the coldfire entity instance.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Returns a human-readable status string corresponding to the current fuel stage.
* **Parameters:** `inst` (Entity) — the coldfire entity instance.
* **Returns:** String: `"OUT"`, `"EMBERS"`, `"LOW"`, `"NORMAL"`, or `"HIGH"`.

### `OnHaunt(inst)`
* **Description:** Called during a haunt event. Adds a small fuel amount with probability and sets haunt value if the fire is accepting fuel.
* **Parameters:** `inst` (Entity) — the coldfire entity instance.
* **Returns:** `true` if fuel was added; otherwise `false`.

## Events & listeners
- **Listens to:** 
  - `onextinguish` — triggers `onextinguish` handler to zero fuel.
  - `onbuilt` — triggers `onbuilt` handler to play build animation and sound.
- **Pushes:** none directly; relies on component-sourced events (e.g., `burnable`, `fueled`) for state synchronization.

## Notes
- Rain reduces fuel consumption rate via `TUNING.COLDFIRE_RAIN_RATE * TheWorld.state.precipitationrate`.
- Fuel consumption rate defaults to `1` (per-second), scaled up in rain unless the fire is rain-immune.
- The `propagator`, `workable`, and other components are removed upon full degradation to prevent further interaction.
- A phantom fuel refill from haunting uses `TUNING.TINY_FUEL` and sets haunt value to `TUNING.HAUNT_SMALL`.