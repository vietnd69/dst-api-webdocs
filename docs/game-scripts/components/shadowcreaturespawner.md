---
id: shadowcreaturespawner
title: Shadowcreaturespawner
description: Manages the spawning, tracking, and population control of shadow creatures (e.g., Crawling Horrors, Ocean Horrors, Terrorbeaks) for players based on sanity levels and game mode.
tags: [sanity, spawning, environment, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 43493884
system_scope: environment
---

# Shadowcreaturespawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shadowcreaturespawner` is a server-side-only component responsible for dynamically managing shadow creature populations in response to player sanity and game state. It spawns creatures when a player enters or approaches low-sanity thresholds and adjusts population size continuously based on sanity degradation, induced lunacy modes, and terrain constraints. It interacts closely with the `sanity` component to determine appropriate spawn behavior and with `walkableplatform` (for boats) to ensure valid spawn locations.

## Usage example
This component is automatically added to the world entity (not player entities) during world initialization and requires no manual instantiation. Its behavior is triggered through internal event listeners.

```lua
-- Example: Observing debug output for current shadow creature count
-- (Only possible if you have access to the world's shadowcreaturespawner component)
if TheWorld.components.shadowcreaturespawner then
    print(TheWorld.components.shadowcreaturespawner:GetDebugString())
end
```

## Dependencies & tags
**Components used:** `sanity`, `walkableplatform`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component (the world). |

## Main functions
### `SpawnShadowCreature(player, params)`
* **Description:** Spawns a single shadow creature near the specified player, choosing between land (`crawlinghorror` / `terrorbeak`) or ocean (`oceanhorror`) variants based on proximity to a boat, sanity level, and terrain validity. Updates internal tracking tables and registers cleanup listeners on the spawned entity.
* **Parameters:** 
  - `player` (`Entity`) — The player for whom to spawn the creature.
  - `params` (`table?`) — Optional player-specific tracking table. If omitted, looks up `_players[player]`.
* **Returns:** `nil`.
* **Error states:** No explicit error handling — invalid spawn positions or missing components (e.g., `walkableplatform` on a boat) are gracefully ignored or fall back to alternate behavior.

### `GetDebugString()`
* **Description:** Returns a human-readable string indicating the total number of active shadow creatures spawned for all players.
* **Parameters:** None.
* **Returns:** `string` — `"1 shadowcreature"` or `"<N> shadowcreatures"` if creatures exist; empty string otherwise.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` — Registers new players to begin tracking.
  - `ms_playerleft` — Stops tracking and cleans up for exiting players.
  - `inducedinsanity` — Resets player-specific spawner timers when induced insanity begins or ends.
  - `sanitymodechanged` — Re-initializes population tracking when sanity mode changes.
  - `ms_exchangeshadowcreature` — Re-tracks a creature after exchange (e.g., via Abigail’s ability).
  - `onremove` (on spawned creatures and players) — Removes creatures from tracking and marks them for deserialization.
  - `entitysleep` (on spawned creatures) — Immediately removes creatures when player sleeps.

- **Pushes:** None identified.
