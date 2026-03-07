---
id: lunarhailmanager
title: Lunarhailmanager
description: Manages spawning, physics, and impact behavior of falling debris during lunar hail storms, including damage application, shelter detection, and interaction with the world topology.
tags: [weather, damage, world, events]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 907e2dd4
system_scope: environment
---
# Lunarhailmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lunarhailmanager` is a component responsible for orchestrating the lunar hail event: it spawns falling debris (moonglass chunks) at random locations, simulates their physics as they fall, detects ground impact and target collision, applies damage or effects to players and plants, and manages shelter/coverage logic. It runs exclusively on the master simulation (`ismastersim`) and responds to world state changes and player lifecycle events. The component integrates with multiple others to enforce protection rules (`sheltered`, `inventory`, `combat`) and plant stress mechanics (`farmplantstress`, `farmplanttendable`, `growable`).

## Usage example
```lua
-- Component is automatically added to TheWorld and activated by the lunar hail weather event.
-- Modders typically interact indirectly by:
-- - Setting custom debris via SetDebris()
-- - Defining per-tile debris via SetTagDebris()
-- - Enabling/disabling the lunar hail weather state.

TheWorld.components.lunarhailmanager:SetDebris({
    { weight = 3, loot = { "moonglass" } },
    { weight = 1, loot = { "moonglass_charged" } },
})

TheWorld.components.lunarhailmanager:SetTagDebris("forest", {
    { weight = 2, loot = { "twigs" } },
})
```

## Dependencies & tags
**Components used:** `combat`, `farmplantstress`, `farmplanttendable`, `growable`, `inventory`, `inventoryitem`, `lighttweener`, `sheltered`  
**Tags:** Checks tags like `"player"`, `"lunarhailprotection"`, `"INLIMBO"`, `"playerghost"`, `"invisible"`, `"epic"`, `"lunar_aligned"`, `"wall"`, `"hive"`, `"houndmound"`, `"lunarhaildebris"`, `"shadecanopy"`, `"shadecanopysmall"`, and `"player"` via `HasTag`. Adds `"lunarhaildebris"` to spawned debris prefabs internally.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | `nil` | Reference to the entity instance (always `TheWorld`) this component is attached to. |

No additional public properties are exposed.

## Main functions
### `SetDebris(data)`
* **Description:** Replaces the global fallback debris loot table used when a tile has no specific tag mapping. Must be called on the master simulation only.
* **Parameters:** `data` (table) — An array of tables, each with `weight` (number) and `loot` (array of strings). Example: `{ { weight = 1, loot = { "moonglass" } } }`.
* **Returns:** Nothing.

### `SetTagDebris(tile, data)`
* **Description:** Assigns a custom debris loot table for a specific world topology tile name (e.g., `"forest"`, `"cave"`). Must be called on the master simulation only.
* **Parameters:**
  * `tile` (string) — The topology tile name.
  * `data` (table) — Debris loot table with same structure as `SetDebris` input.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  * `ms_playerjoined` — Triggered when a new player joins the world; begins scheduling debris drops for that player if the event is active.
  * `ms_playerleft` — Triggered when a player leaves; cancels pending drops and removes the player from the active list.
  * `islunarhailing` (world state) — Watching this state triggers `ToggleLunarHail` when the lunar hail event starts or ends.
  * `enterlimbo` (on spawned debris) — Handles cleanup when debris enters limbo.
  * `onremove` (on shadow prefab) — Cleans up the shadow when debris is removed.
- **Pushes:**
  * `startfalling` — Fired on debris when falling begins.
  * `stopfalling` — Fired on debris when it lands and stops bouncing.

