---
id: shadowthrall_hands
title: Shadowthrall Hands
description: Controls behavior and properties of Shadow Thrall Hands minions, including combat logic, movement, loot drops, and visual effects synchronization.
tags: [combat, ai, boss, creature, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1476524b
system_scope: entity
---

# Shadowthrall Hands

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadowthrall_hands` prefab defines the behavior and rendering of the Shadow Thrall Hands enemy, a secondary boss-fight entity tied to the Shadow Thrall. It integrates with multiple systems: `combat` for targeting and damage, `locomotor` for movement, `sanityaura` for nearby player sanity effects, and `lootdropper` for item drops. Visual FX (flames and fabric particles) are synchronized using `colouraddersync` and `entitytracker` to link it with its parent horns and wings. The prefab also handles networked and non-networked (client-only) state via conditional logic.

## Usage example
```lua
-- Typical usage occurs during boss summoning or world generation.
-- This prefab is not instantiated manually by modders.
-- Example reference for internal use:
local hands = Prefab("shadowthrall_hands", fn, assets, prefabs)
-- In a boss controller, e.g., when spawning hands:
local hands_entity = SpawnPrefab("shadowthrall_hands")
hands_entity.Transform:SetPosition(x, y, z)
hands_entity.components.entitytracker:AddEntity("horns", horns_entity)
hands_entity.components.entitytracker:AddEntity("wings", wings_entity)
```

## Dependencies & tags
**Components used:** `colouraddersync`, `combat`, `entitytracker`, `health`, `locomotor`, `lootdropper`, `planardamage`, `sanityaura`, `inspectable`, `drownable`, `planarentity`, `knownlocations`, `colouradder`.  
**Tags added:** `monster`, `hostile`, `scarytoprey`, `shadowthrall`, `shadow_aligned`.  
**Tags checked (via `HasTag`):** `player`, `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `highlightchildren` | table (array of entities) | `nil` | List of FX child entities (flame and fabric) used for colour syncing. |
| `displaynamefn` | function | `DisplayNameFn` | Callback to determine display name based on player allegiance. |
| `OnLoadPostPass` | function | `OnLoadPostPass` | Callback to initialize `lastattack` timestamps for team synchronization. |

## Main functions
### `RetargetFn(inst)`
* **Description:** Determines the new combat target when the retarget timer fires. Skips re-targeting if the entity is appearing or invisible, or if the current target is already in range. Also checks for devoured targets associated with the `horns` entity.
* **Parameters:** `inst` (Entity) — the shadow thrall hands instance.
* **Returns:** Entity — the closest player in range, or `nil`.
* **Error states:** May return `nil` if no suitable target exists or conditions prevent re-targeting.

### `KeepTargetFn(inst, target)`
* **Description:** Decides whether to continue targeting the current entity. Returns `true` if the target or the `horns`/`wings` entities are within the deaggro range, or if the target remains valid.
* **Parameters:**  
  - `inst` (Entity) — the shadow thrall hands instance.  
  - `target` (Entity) — the currently targeted entity.
* **Returns:** boolean — `true` if target should be kept, `false` otherwise.

### `OnAttacked(inst, data)`
* **Description:** Event handler fired on entity attack. If not currently near its active target, shifts aggression to the attacker.
* **Parameters:**  
  - `inst` (Entity) — the shadow thrall hands instance.  
  - `data` (table) — contains `attacker` entity.
* **Returns:** Nothing.

### `OnNewCombatTarget(inst, data)`
* **Description:** Triggers when a new combat target is set. Suggests the same target to the `horns` and `wings` entities (if present and combat-capable), enabling coordinated attacks.
* **Parameters:**  
  - `inst` (Entity) — the shadow thrall hands instance.  
  - `data` (table) — contains `oldtarget` and `target`.
* **Returns:** Nothing.

### `GetWintersFeastOrnaments(inst)`
* **Description:** Defines loot for Winters Feast event. Returns ornament configuration only if both `horns` and `wings` are absent (indicating standalone spawn).
* **Parameters:** `inst` (Entity) — the shadow thrall hands instance.
* **Returns:** table or `nil` — e.g., `{ basic = 1, special = "winter_ornament_shadowthralls" }`.

### `OnLoadPostPass(inst)`
* **Description:** Initializes staggered `lastattack` timestamps across the thrall team (`hands`, `horns`, `wings`) to prevent identical attack timing.
* **Parameters:** `inst` (Entity) — the shadow thrall hands instance.
* **Returns:** Nothing.

### `DisplayNameFn(inst)`
* **Description:** Returns a specialized display name string for Shadow-Aligned players.
* **Parameters:** `inst` (Entity) — the shadow thrall hands instance.
* **Returns:** string or `nil` — `STRINGS.NAMES.SHADOWTHRALL_HANDS_ALLEGIANCE` if player is shadow-aligned, otherwise `nil`.

### `CreateFlameFx()`
* **Description:** Creates and configures a local FX entity for flame particle effects.
* **Parameters:** None.
* **Returns:** Entity — non-networked FX entity with `FX` tag.

### `CreateFabricFx()`
* **Description:** Creates and configures a local FX entity for fabric particle effects (reused for two instances).
* **Parameters:** None.
* **Returns:** Entity — non-networked FX entity with `FX` tag.

### `OnColourChanged(inst, r, g, b, a)`
* **Description:** Syncs colour changes to child FX entities by setting `SetAddColour` on each.
* **Parameters:**  
  - `inst` (Entity) — the shadow thrall hands instance.  
  - `r, g, b, a` (numbers) — colour channel values.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — handled by `OnAttacked` to acquire new target if needed.  
- **Listens to:** `newcombattarget` — handled by `OnNewCombatTarget` to propagate target to team members.  
- **Pushes:** None identified.