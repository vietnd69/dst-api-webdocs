---
id: deer_fx
title: Deer Fx
description: Generates visual and audio effect prefabs for the Deer creature's ice and fire circle abilities, including particle effects, lighting, and interaction logic with nearby entities.
tags: [fx, lighting, audio, entity, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: acefae13
system_scope: fx
---

# Deer Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`deer_fx.lua` defines a set of visual FX prefabs used by the Deer creature’s magical abilities. It implements common lighting, sound, particle, and animation logic via a shared `MakeFX` factory function. Two main FX types are covered: **ice circle** (cold, speed penalty, freezing) and **fire circle** (heat, ignition, thawing). These prefabs are instantiated dynamically and do not persist across sessions (`inst.persists = false`).

The prefabs interact with the following components on nearby entities: `burnable`, `freezable`, `fueled`, `grogginess`, `health`, `locomotor`, `propagator`, and `temperature`. Master-server logic manages entity effect application; client logic focuses on visual updates and local player impact.

## Usage example
```lua
-- Example of spawning a deer fire circle effect manually
local fx = SpawnPrefab("deer_fire_circle")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
    -- Master-side logic is handled automatically via postinit
end

-- Trigger particle bursts from an active FX
if fx.TriggerFX ~= nil then
    fx:TriggerFX()
end
```

## Dependencies & tags
**Components used:** `propagator`, `sound`, `animstate`, `transform`, `network`.  
The prefabs also reference external components via `inst.components.X` but do not add them directly.

**Tags added:** `FX`, `deer_ice_circle`, `deer_fire_circle` (on the respective circle prefabs).

## Properties
No public properties are exposed on the component level. FX prefabs are generated via a factory function (`MakeFX`), and internal state is held in instance-local variables (`inst._fade`, `inst._rad`, `inst.burstdelay`, etc.) not documented as public API.

## Main functions
The following functions are exposed as methods on FX instances.

### `KillFX(anim)`
*   **Description:** Stops the FX effect. Plays a kill animation, kills ambient sound, fades out light (if present), and removes the entity after animation completes.
*   **Parameters:** `anim` (string, optional) – Animation name to play during kill (default: `"pst"`).
*   **Returns:** Nothing.
*   **Error states:** Has no effect if `inst.killed` is already `true`.

### `TriggerFX()`
*   **Description:** Spawns child FX prefabs (listed in `inst.fxprefabs`) around the FX center and sets up parent-child cleanup.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnKillFX(anim)`
*   **Description:** Hook called by `KillFX` before the main kill logic. Allows subclasses (via `data.onkillfx` in `MakeFX`) to perform cleanup.
*   **Parameters:** `anim` (string, optional) – Passed through to `KillFX`.
*   **Returns:** Nothing.
*   **Error states:** No effect if `inst.killed` is `true`.

### `OnInitIceCircle(inst)`
*   **Description:** Initializes the ice circle’s periodic task for applying cold/slow effects to entities within range.
*   **Parameters:** `inst` (entity) – The ice circle instance.
*   **Returns:** Nothing.

### `OnInitFireCircle(inst)`
*   **Description:** Initializes the fire circle’s periodic task for applying heat/ignition effects and updates the `propagator` component range.
*   **Parameters:** `inst` (entity) – The fire circle instance.
*   **Returns:** Nothing.

### `deer_charge_master_postinit(inst, init)`
*   **Description:** Handles sound playback for the deer charge FX on master.
*   **Parameters:** `inst` (entity) – The charge FX instance. `init` (boolean) – Whether this is an initial call.
*   **Returns:** Nothing.

## Events & listeners
### Listens to
- `fadedirty` (client): Triggers light fade update (`OnFadeDirty`).
- `animover` (server): Stops looping sound and sets kill state (`OnAnimOverIceCircle`, `OnKillFireCircle`).
- `onremove` (client): Tracks child FX lifetimes for proper cleanup (`OnFXKilled`).

### Pushes
- `fadedirty` (client): Signals light update cycle to recompute fade state.
- `onextinguish` (via `burnable:Extinguish`).
- `unfreeze` (via `freezable:Unfreeze`).