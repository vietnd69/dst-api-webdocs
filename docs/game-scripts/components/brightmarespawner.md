---
id: brightmarespawner
title: Brightmarespawner
description: Tracks players in Lunacy Mode and periodically spawns Brightmare Gestalt entities based on player sanity levels and population rules.
tags: [spawn, boss, sanity, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 331c239b
system_scope: world
---

# Brightmarespawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`brightmarespawner` is a world-scoped component responsible for managing the spawning of Brightmare Gestalt entities in response to player sanity conditions. It listens for player join/leave events and sanity mode changes, tracking only players currently in Lunacy Mode. Using configurable tuning values, it calculates population levels and attempts spawns within defined distance and entity-density constraints. It does not exist on the client — only on the master simulation.

## Usage example
```lua
-- This component is automatically added to TheWorld upon world creation.
-- It does not require manual instantiation or configuration by modders.
-- Example access (master sim only):
if TheWorld.ismastersim then
    TheWorld.components.brightmarespawner:GetDebugString()
end
```

## Dependencies & tags
**Components used:** `health`, `sanity`, `shard_wagbossinfo`
**Tags:** Listens to events on players; checks tags `player`, `playerghost`, `brightmare`, `brightmare_gestalt`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component (typically `TheWorld`). |

## Main functions
### `FindBestPlayer(gestalt)`
*   **Description:** Finds the closest valid player who meets population and sanity criteria for a given Gestalt entity. Used by Gestalt to determine its primary tracking target.
*   **Parameters:** `gestalt` (Entity) — the Gestalt entity requesting the player. Must have `GetDistanceSqToPoint(x, y, z)` and `tracking_target` fields.
*   **Returns:**  
    - `closest_player` (Entity or `nil`) — the closest qualifying player,  
    - `closest_level` (number) — the sanity-based population level (1–3 or 0 if none).
*   **Error states:** Returns `nil, 0` if no players meet all conditions.

### `FindRelocatePoint(gestalt)`
*   **Description:** Computes a valid spawn offset relative to the Gestalt's tracking target for relocating the Gestalt.
*   **Parameters:** `gestalt` (Entity) — the Gestalt entity requesting a relocation point.
*   **Returns:** `offset` (table with `x`, `z` fields or `nil`) — world-space position offset for placement.
*   **Error states:** Returns `nil` if no tracking target exists or no valid spawn point is found within the search radius.

### `GetDebugString()`
*   **Description:** Returns a human-readable count of currently spawned Gestalt entities for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"3 Gestalts"`.

## Events & listeners
- **Listens to:**  
  - `sanitymodechanged` — on players in `_players`, to update tracking.  
  - `ms_playerjoined` — to add new players and start tracking if Lunacy Mode is active.  
  - `ms_playerleft` — to stop tracking when a player leaves.  
  - `onremove` — on each Gestalt entity to remove it from `_gestalts`.
- **Pushes:** No events. This component is passive — it only triggers spawns via internal logic.

## Notes
- Requires `TheWorld.ismastersim` — throws an assertion error if instantiated on client.
- Spawn frequency is dynamically adjusted via `UpdatePopulation`, which reschedules itself with randomized intervals based on total population levels.
- Spawn rates are multiplied by `TUNING.WAGBOSS_DEFEATED_GESTALT_SPAWN_FACTOR` if the current shard’s `shard_wagbossinfo` component reports Wagboss has been defeated.
