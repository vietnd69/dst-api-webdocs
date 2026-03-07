---
id: gestalt_guard
title: Gestalt Guard
description: Manages a high-priority nightmare-based combat entity with dynamic targeting and transparency logic based on observer sanity and inventory.
tags: [combat, ai, boss, nightmare]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 312057db
system_scope: entity
---

# Gestalt Guard

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gestalt_guard` defines the behavior and rendering logic for a boss-tier nightmare creature in DST. It is a specialized variant of the Gestalt family, designed to aggressively hunt players and shadow creatures. Its targeting logic dynamically evaluates potential targets using a multi-level priority system based on sanity, inventory, and tags. The guard also supports client-side transparency changes based on observer perception and includes logic to extinguish fire and suppress loot drops on specific kills.

## Usage example
```lua
-- Typical instantiation via Prefab system (not direct component usage)
local guard = Prefab("gestalt_guard", nil, nil, nil)
-- The guard is spawned via world generation or brain logic, not manually added as a component
```

## Dependencies & tags
**Components used:** `sanityaura`, `locomotor`, `health`, `combat`, `knownlocations`, `gestaltcapturable`, `inspectable`, `transparentonsanity`, `burnable`, `lootdropper`  
**Tags:** Adds `brightmare`, `brightmare_guard`, `crazy`, `NOBLOCK`, `extinguisher`, `soulless`, `lunar_aligned`, `gestaltcapturable`, `scarytoprey` (conditionally); checks `player`, `gestalt_possessable`, `gestaltnoloot`, and various `shadow*` tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `blobhead` | Entity or `nil` | `nil` | Reference to the attached `gestalt_guard_head` prefab (client-only). |
| `behaviour_level` | number | `0` | Current targeting level: `0`=idle, `1`=ignore, `2`=watch, `3`=attack. Set by `Retarget` and `OnNewCombatTarget`. |
| `isguard` | boolean | `true` | Internal flag indicating guard identity. |
| `_notrail` | boolean | `true` | Prevents trail effects from rendering. |
| `_level` | NetVar (tinybyte) | `1` | Networked level value for replication. |

## Main functions
### `SetHeadAlpha(inst, a)`
* **Description:** Sets the alpha (transparency) of the attached `blobhead` entity via multicolour override.
* **Parameters:** `inst` (Entity), `a` (number) — alpha value between `0` (invisible) and `1` (opaque).
* **Returns:** Nothing.

### `FindRelocatePoint(inst)`
* **Description:** Computes a walkable point near the spawn location (if within range) or at the home point, using increasing offset radii and fallbacks. Used when the guard needs to reposition.
* **Parameters:** `inst` (Entity).
* **Returns:** Vector (x, z) representing a valid walkable position.
* **Error states:** Falls back to the spawn point if no walkable offset is found.

### `GetLevelForTarget(target)`
* **Description:** Assigns a targeting level (1–3) to a given target based on sanity, inventory, and tags. Also returns the current sanity ratio.
* **Parameters:** `target` (Entity or `nil`).
* **Returns:** `level` (number), `sanity` (number) — `level=1` (ignore), `2` (watch), `3` (attack); `sanity` is `0` for non-player targets, else normalized sanity (with penalty) or `1`.
* **Error states:** Returns `(1, 1)` if `target` is `nil`.

### `Retarget(inst)`
* **Description:** Core retargeting callback. Searches for new targets at aggressive (`attack`) and passive (`watch`) ranges using `FindEntity`, evaluates level, and updates combat state. Triggers `droppedtarget` if no new target exists.
* **Parameters:** `inst` (Entity).
* **Returns:** `target` (Entity or `nil`), `changed` (boolean) — whether the target changed.
* **Error states:** Drops current target if no new target is found; does not fire `newcombattarget` — callers must handle that event.

### `OnNewCombatTarget(inst, data)`
* **Description:** Event handler called when a new combat target is assigned. Updates behavior level and ensures `inspectable` and `scarytoprey` tags are present.
* **Parameters:** `inst` (Entity), `data` (table) — contains `target` (Entity).
* **Returns:** Nothing.

### `OnNoCombatTarget(inst)`
* **Description:** Event handler called when combat target is lost. Restarts attack cooldown, resets behavior level, and removes `inspectable` and `scarytoprey`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `Client_CalcTransparencyRating(inst, observer)`
* **Description:** Calculates transparency alpha for a given observer based on sanity and target level. Returns higher (less transparent) alpha for observers with low sanity or who are shadow-targeted.
* **Parameters:** `inst` (Entity), `observer` (Entity).
* **Returns:** `alpha` (number) — value in `[0.2, TUNING.GESTALT_COMBAT_TRANSPERENCY]` (default `0.85`).
* **Error states:** Defaults to `TUNING.GESTALT_COMBAT_TRANSPERENCY` if `inspectable` component is present or `level >= 3`.

## Events & listeners
- **Listens to:**
  - `newcombattarget` → `OnNewCombatTarget`
  - `droppedtarget` → `OnNoCombatTarget`
  - `losttarget` → `OnNoCombatTarget`
  - `onattackother` → `onattackother` (extinguishes shadow-fire targets)
  - `killed` → `onkilledtarget` (suppresses loot for `gestaltnoloot` targets)
- **Pushes:** None (does not fire custom events).