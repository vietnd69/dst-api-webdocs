---
id: winona_catapult_projectile
title: Winona Catapult Projectile
description: Handles the physics, targeting, and area-of-effect effects of a Winona catapult projectile upon impact, including elemental damage, terrain destruction, trap spawning, and object tossing.
tags: [combat, aoe, destructible, projectile]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1151acd
system_scope: combat
---

# Winona Catapult Projectile

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This prefab defines the visual and gameplay behavior of a Winona catapult projectile in DST. Upon impact with the ground, it triggers area-of-effect (AOE) combat attacks against nearby entities, destroys collapsible terrain features (e.g., trees, stumps, rocks), spawns trap vines (for mega variants), tosses nearby inventory items into the air, and optionally handles ocean fishing or kelp destruction. It supports three elemental types (`shadow`, `lunar`, `hybrid`), normal and mega variants, and configurable AOE radius and level.

The component logic is embedded directly in the prefab factory (`fn()`) rather than as a reusable component. It uses the `complexprojectile`, `combat`, `planardamage`, and `damagetypebonus` components internally to implement its behavior.

## Usage example
This prefab is instantiated internally by the `winona_catapult` item via its `complexprojectile` logic. It is not intended for direct manual instantiation by modders. However, its public API methods can be invoked on a spawned instance:

```lua
local proj = SpawnPrefab("winona_catapult_projectile")
proj:SetElementalRock("lunar", true)  -- set to mega lunar variant
proj:SetAoeRadius(5, 3)               -- set radius and AOE level
-- physics/flight is handled automatically by complexprojectile component
```

## Dependencies & tags
**Components used:** `complexprojectile`, `combat`, `planardamage`, `damagetypebonus`  
**Tags added:** `FX`, `NOCLICK`, `notarget`, `projectile`, `complexprojectile`, `toughworker` (only for mega lunar/hybrid impacts)  
**Tags filtered in AOE logic:** `INLIMBO`, `ghost`, `playerghost`, `FX`, `DECOR`, `notarget`, `companion`, `shadowminion`, `wall`, `player`, `structure`, `sign`, `statue`, `sculpture`, `smashable`, `NPC_workable`, `fly`, `invisible`, `noattack`, `locomotor`, `_inventoryitem`, `trap_vines`, `NOBLOCK`, `character`, `walkableperipheral`, `oceanfishable`, `wave`, `intense`, `stump`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AOE_RADIUS` | number | `TUNING.WINONA_CATAPULT_AOE_RADIUS` | Radius (in tiles) of the AOE effect on impact. |
| `AOE_LEVEL` | number | `0` | AOE power level (0–3); affects trap count and placement rings. |
| `mega` | boolean | `false` | Whether the projectile is the "mega" variant (enhanced AOE effects). |
| `hideanim` | `net_bool` | `false` | Networked bool controlling visibility of the projectile mesh (used for FX). |
| `element` | `net_tinybyte` | `0` | Networked index into `ELEMENTS = {"shadow", "lunar", "hybrid"}`. |
| `aoebase` | `net_tinybyte` | `0` | Networked value representing AOE state for client-side FX. |
| `caster` | entity or `nil` | `nil` | Optional player/caster reference, used for ally checks during combat. |

## Main functions
### `SetElementalRock(element, mega)`
* **Description:** Configures the elemental type and mega status of the projectile before launch. Must be called before impact to affect the AOE effects.
* **Parameters:**  
  `element` (string) — one of `"shadow"`, `"lunar"`, `"hybrid"`, or `nil`/`false` for default ("dirt").  
  `mega` (boolean) — whether this is the mega variant (enables extra trap/toss effects).
* **Returns:** Nothing.
* **Error states:** No error checking; silently ignores invalid element names (defaults to `"shadow"` index `1` via table inversion).

### `SetAoeRadius(radius, level)`
* **Description:** Sets the radius (and AOE level) used for combat range and entity searches during impact.
* **Parameters:**  
  `radius` (number) — AOE radius in tiles.  
  `level` (number) — AOE level (0–3); used to determine trap placement rings.
* **Returns:** Nothing.

### `DoAOEAttack(inst, x, z, attacker, caster, element, mega)`
* **Description:** Internal helper that executes combat hits on entities within the projectile's AOE. Handles ally filtering, PV[P rules, and damage type bonuses. Uses the projectile (or optional attacker) as the combat source.
* **Parameters:**  
  `inst` (entity) — the projectile instance.  
  `x`, `z` (numbers) — impact coordinates.  
  `attacker` (entity or `nil`) — optional external attacker (e.g., player) to draw aggro.  
  `caster` (entity or `nil`) — reference entity used for ally checking.  
  `element` (string) — elemental type.  
  `mega` (boolean) — mega flag.
* **Returns:** Nothing (side effect only: entity attacks).
* **Error states:** Skips invalid, invisible, or non-targetable entities.

### `DoAOEWork(inst, x, z, isocean)`
* **Description:** Destroys or clears workable objects (e.g., trees, rocks, kelp) and picks vegetation within the AOE. Handles special kelp/root drop logic and `lunarhailbuildup` cleanup.
* **Parameters:**  
  `inst` (entity) — projectile instance.  
  `x`, `z` (numbers) — impact coordinates.  
  `isocean` (boolean) — whether impact occurred on ocean.
* **Returns:** Nothing.

### `TossItems(inst, x, z, isocean)`
* **Description:** Finds nearby inventory items (with `_inventoryitem` tag) and launches them upward with physics and optional ocean landing states.
* **Parameters:**  
  `inst` (entity) — projectile instance.  
  `x`, `z` (numbers) — impact coordinates.  
  `isocean` (boolean) — if true, marks items as "not landed" for water floating logic.
* **Returns:** Nothing.

### `DoOceanFishing(inst, x, z)`
* **Description:** Handles ocean-specific impact: kills fish, spawns loot, creates waterspout FX, and triggers waves.
* **Parameters:**  
  `inst` (entity) — projectile instance.  
  `x`, `z` (numbers) — impact coordinates.
* **Returns:** Nothing.

### `SpawnAOETrap(inst, x, z, attacker, caster)`
* **Description:** Spawns trap vines in concentric rings for mega variants. Supports levels 1–3 (ring counts increase with level).
* **Parameters:**  
  `inst` (entity) — projectile instance.  
  `x`, `z` (numbers) — impact coordinates.  
  `attacker`, `caster` (entities or `nil`) — passed to trap prefabs.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` — fires `inst.Remove` to delete the projectile entity and FX after animation finishes.  
  `hideanimdirty` — removes FX animation (`animent`) when `hideanim` becomes true.  
  `elementdirty` — updates FX animation/sprites based on current `element` value (client-side only).
- **Pushes:** None (all events are internal/asset-based, not game-logic events).