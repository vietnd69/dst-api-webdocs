---
id: vault_ground_pattern
title: Vault Ground Pattern
description: Renders a background-level visual FX tile used for vault floor patterns, with configurable orientation and animation variation.
tags: [fx, visual, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1bb7d930
system_scope: fx
---

# Vault Ground Pattern

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vault_ground_pattern` is a client-side FX prefab that renders animated ground tiles for vault environments. It provides visual variation, orientation control, and optional center-layer hiding to support dynamic floor tiling in dungeon layouts. It is lightweight, non-interactive, and attached to entities solely for rendering purposes (e.g., as a visual layer for vault floors). The component logic is embedded directly in the prefab constructor function, and it is not used as a standalone component on other entities.

## Usage example
```lua
-- Not typically added as a component; used as a prefab for instancing.
-- Example of how it is instantiated internally by the game engine:
local inst = Prefab("vault_ground_pattern_fx", fn, assets)
inst:SetVariation(2)         -- change animation variation
inst:HideCenter()            -- hide the 'center' layer
inst:SetOrientation(3)       -- set rotation and scale
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`, `NOCLICK` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1` | Animation variation index (e.g., `1`, `2`, `3`) — determines which `idleN` animation plays. |
| `nocenter` | boolean | `false` | If `true`, the `center` animation layer is hidden (used to support seamless tiling). |
| `orientation` | number | `1` | Orientation index (`1`–`4`) controlling rotation and horizontal scaling. |

## Main functions
### `SetVariation(variation)`
* **Description:** Changes the animation variation and updates the anim state to play the corresponding `idle{variation}` animation.  
* **Parameters:** `variation` (number) — the variation index (typically `1`, `2`, or `3`).  
* **Returns:** `inst` (the entity) — enables method chaining.  
* **Error states:** Has no effect if the new variation matches the current `inst.variation`.

### `HideCenter()`
* **Description:** Hides the `center` animation layer, allowing adjacent tiles to tile seamlessly without visual gaps.  
* **Parameters:** None.  
* **Returns:** `inst` — enables method chaining.  
* **Error states:** Has no effect if `inst.nocenter` is already `true`.

### `SetOrientation(orientation)`
* **Description:** Adjusts the entity’s rotation and horizontal scale to support directional alignment (e.g., matching floor tile orientation in the world).  
* **Parameters:** `orientation` (number) — `1` to `4`, representing cardinal directions with special handling for variations `< 3`.  
* **Returns:** `inst` — enables method chaining.  
* **Error states:** When `orientation > 2` and `variation < 3` and `nocenter` is `false`, the effective orientation is decremented by `2`. Scale and rotation are recalculated based on the final orientation value.

### `OnSave(data)`
* **Description:** Serializes key state (`variation`, `nocenter`, `orientation`) into the save data table for persistence.  
* **Parameters:** `data` (table) — the table to populate with serializable state.  
* **Returns:** Nothing.  
* **Note:** Opts to omit default values (`variation == 1`, `orientation == 1`, `nocenter == false`) to reduce save size.

### `OnLoad(data)`
* **Description:** Restores state from saved data by calling the appropriate setter functions.  
* **Parameters:** `data` (table, optional) — the saved data table (can be `nil`).  
* **Returns:** Nothing.  
* **Error states:** Early-exits with no effect if `data` is `nil` or if a given key (`variation`, `nocenter`, `orientation`) is absent.

## Events & listeners
None identified.