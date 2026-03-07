---
id: chessjunk
title: Chessjunk
description: A destructible and repairable chess-themed debris entity that spawns chess piece minions upon destruction or repair, with loot drops and RuinsRespawner integration.
tags: [loot, combat, ruins, despawn]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 663ee87d
system_scope: world
---

# Chessjunk

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`chessjunk` is a game object representing scattered chess-themed debris found in the Ruins. It functions as a destructible structure that can be hammered to completion (destroyed) or repaired incrementally. Upon hammering, it has a chance to summon hostile chess monsters (e.g., bishop, rook, knight) via lightning strike. When fully repaired (after 6 hits), it respawns as a new monster and drops gear. The component relies heavily on `workable`, `lootdropper`, and `repairable`, and integrates with RuinsRespawner for world generation and respawn behavior. It supports Year of the Clockwork Knight (YOTH) event-specific loot with unwrappable pouches.

## Usage example
```lua
-- Example of creating a chess junk instance manually
local inst = SpawnPrefab("chessjunk1")
inst.Transform:SetPosition(x, y, z)

-- To trigger hammering behavior (simulated):
-- inst.components.workable:WorkedBy(player)

-- To repair manually:
-- inst.components.repairable:Repair(1, player, "gears")
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `repairable`, `inspectable`  
**Tags added:** `chess`, `mech`  
**Event listeners:** `loot_prefab_spawned` (YOTH-only), `saved`, `load` (via `inst.OnSave`/`inst.OnLoad`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `style` | number | `1`, `2`, or `3` | Visual variant (anim index suffix: "idle1", "idle2", "idle3"). Set during instantiation. |
| `repaired` | boolean | `false` | `true` if the entity has been fully repaired once (triggers respawn). |
| `repairerid` | string or `nil` | `nil` | User ID of the player who last repaired it, stored for loyalty tracking. |
| `repairerchar` | string or `nil` | `nil` | Prefab name of the player who last repaired it, stored for loyalty tracking. |

## Main functions
### `SpawnScionAtXZ(x, z, friendly, style, player, repairerid, repairerchar)`
*   **Description:** Spawns a Maxwell smoke FX, then a chess monster prefab at `(x, 0, z)`. Assigns `player` as a friendly friend (if `friendly=true`) or as a combat target (if `friendly=false`). If friend failed, attempts to find a nearby player to befriend.
*   **Parameters:** 
    - `x` (number) — world X coordinate.
    - `z` (number) — world Z coordinate.
    - `friendly` (boolean) — whether the spawned scion should be friendly.
    - `style` (number) — determines spawn probability for bishop/knight (style=1) or rook/knight (style=2).
    - `player` (`nil` or Entity) — target for befriend or aggro.
    - `repairerid` (`nil` or string) — user ID for memory retention.
    - `repairerchar` (`nil` or string) — prefab name for memory retention.
*   **Returns:** `nil`.
*   **Error states:** Silently skips befriend/aggro if `player` is `nil` or invalid; ignores scion `nil` gracefully.

### `OnRepaired(inst, doer)`
*   **Description:** Handles repair progress. When `workleft < MAXHITS`, plays hit animation/sound. At 6 hits (`workleft >= MAXHITS`), triggers respawn: removes self, spawns a friendly scion, and sets `repaired = true`.
*   **Parameters:** 
    - `inst` (Entity) — the `chessjunk` instance.
    - `doer` (Entity) — the repairer (player or AI).
*   **Returns:** `nil`.
*   **Error states:** Stores `doer.userid` and `doer.prefab` for follower memory only if `doer` and `doer.userid` exist.

### `OnHammered(inst, worker)`
*   **Description:** Called when hammering finishes (`MAXHITS` total work). Drops loot, removes the junk, then possibly spawns a hostile scion via lightning strike (based on luck roll).
*   **Parameters:** 
    - `inst` (Entity) — the `chessjunk` instance.
    - `worker` (Entity) — the hammerer.
*   **Returns:** `nil`.
*   **Error states:** Uses `TryLuckRoll` with `TUNING.CHESSJUNK_SPAWNSCION_CHANCE`; spawns `collapse_small` FX if no scion.

### `OnHit(inst, worker, workLeft)`
*   **Description:** Plays hit animation and sound on every hammer tick (not just completion).
*   **Parameters:** 
    - `inst` (Entity) — the `chessjunk` instance.
    - `worker` (Entity) — the hammerer.
    - `workLeft` (number) — remaining work before completion.
*   **Returns:** `nil`.

### `YOTH_OnLootPrefabSpawned(inst, data)`
*   **Description:** For Year of the Clockwork Knight event, wraps a `lucky_goldnugget` inside a `redpouch_yoth` loot drop (if spawned).
*   **Parameters:** 
    - `inst` (Entity) — the `chessjunk` instance.
    - `data` (table or `nil`) — loot spawn event data containing `loot`.
*   **Returns:** `nil`.
*   **Error states:** Skips wrapping if `loot.prefab ~= "redpouch_yoth"` or no `unwrappable` component.

### `BasePile(style)`
*   **Description:** Constructor helper for a `chessjunk` entity. Sets up physics, animations, tags, components, and callbacks. Returns a fully configured entity.
*   **Parameters:** 
    - `style` (number) — 1, 2, or 3, determines animation suffix and appearance.
*   **Returns:** `inst` (Entity) — a configured entity instance.
*   **Error states:** Returns a client-side ghost entity (with no components) on non-master worlds (`TheWorld.ismastersim == false`).

## Events & listeners
- **Listens to:** `loot_prefab_spawned` — handled only for YOTH event; triggers wrapping of gold nuggets in pouches.
- **Pushes:** `ms_sendlightningstrike` — triggered when a scion is spawned via lightning upon hammering.
