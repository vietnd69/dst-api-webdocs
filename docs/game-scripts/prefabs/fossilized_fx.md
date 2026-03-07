---
id: fossilized_fx
title: Fossilized Fx
description: Creates and manages transient visual effect prefabs used during fossilization and fossil break animations in the game world.
tags: [fx, animation, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e0413e2b
system_scope: fx
---

# Fossilized Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines three pre-fabricated effect prefabs (`fossilized_break_fx`, `fossilizing_fx`, `fossilizing_fx_1`, `fossilizing_fx_2`) that render localized visual feedback during fossil-related environmental changes. The prefabs are non-persistent, non-networked visual FX entities that play animations and automatically remove themselves after completion. It does not implement a reusable component class; instead, it defines standalone prefab factory functions used elsewhere in the codebase to spawn temporary FX entities.

## Usage example
```lua
-- Spawn the break effect at a specific world position
local break_fx = SpawnPrefab("fossilized_break_fx")
if break_fx ~= nil then
    break_fx.Transform:SetPosition(x, y, z)
end

-- Spawn a fossilizing effect relative to a proxy entity
local fx = SpawnPrefab("fossilizing_fx")
if fx ~= nil then
    fx.Transform:SetFromProxy(proxy_guid)
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`  
**Tags:** Adds `FX` to all spawned entities; internally references prefabs `"fossilizing_fx_1"` and `"fossilizing_fx_2"`.

## Properties
No public properties. This file defines prefab factory functions, not an ECS component with instance variables.

## Main functions
### `breakfn()`
* **Description:** Factory function for the `fossilized_break_fx` prefab. Creates an FX entity that plays the "fossilized_break_fx" animation and removes itself upon animation completion.
* **Parameters:** None.
* **Returns:** An `Entity` instance configured as a one-shot FX. On dedicated servers, returns `nil`-equivalent early (no FX).
* **Error states:** On clients (non-mastersim), returns the FX entity immediately after animation setup; on mastersim, sets `persists = false` and schedules removal after `animover` or 1s delay.

### `PlayFossilizingAnim(proxy, anim)`
* **Description:** Helper function that spawns and configures a local-only FX entity (non-networked) to play a fossilizing animation relative to a given `proxy` entity. Typically called via `DoTaskInTime(0, ...)` to ensure correct positioning.
* **Parameters:**
  * `proxy` (Entity) — Entity whose transform and parentage are used as the basis for positioning.
  * `anim` (string) — Animation name to play (e.g., `"idle1"`, `"idle2"`).
* **Returns:** Nothing — the function operates by side-effect (creates and returns an entity only internally).
* **Error states:** No error return, but silently skips scaling logic if `proxy` or its parent lacks physics radius.

### `MakeFossilizingFX(name, anim, prefabs)`
* **Description:** Factory generator returning a `Prefab` constructor for fossilizing effects. Optionally sets a specific animation; otherwise defaults to random selection via `fossilizing_fx` variant.
* **Parameters:**
  * `name` (string) — Name of the new prefab.
  * `anim` (string? | nil) — Animation to play; if `nil`, animation is randomized between `"idle1"` and `"idle2"`.
  * `prefabs` (table) — List of dependent prefabs to load (e.g., child FX entities).
* **Returns:** A `Prefab` function suitable for returning in a `return Prefab(...)` chain.
* **Error states:** On dedicated servers, the inner FX logic is skipped entirely. On non-mastersim clients, returns the FX entity without scheduling delayed removal.

## Events & listeners
- **Listens to:** `animover` — used to trigger `ErodeAway` (for `fossilized_break_fx`) or direct `inst.Remove` (for fossilizing FX).
- **Pushes:** None — this file does not fire custom events.