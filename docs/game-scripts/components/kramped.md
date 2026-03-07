---
id: kramped
title: Kramped
description: Manages the Krampus spawning system by tracking player naughtiness and spawning Krampus entities when thresholds are exceeded.
tags: [combat, boss, world, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7d9939fc
system_scope: world
---

# Kramped

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Kramped` is a master-side world component responsible for monitoring player naughtiness and triggering Krampus spawns when specific thresholds are exceeded. It tracks per-player naughtiness metrics (actions count and decay timers), handles both natural naughtiness accumulation (via `killed` events) and forced spawns (via `ms_forcenaughtiness` events), and ensures Krampus entities are spawned at appropriate distances from players. It interacts with the `combat` component to assign targets to spawned Krampus and with the `werebeast` component to avoid penalizing players for killing Werebeasts in WereState.

## Usage example
```lua
-- The component is automatically added to the world entity and managed by the game.
-- Modders typically interact with it by triggering forced spawns:
TheWorld:PushEvent("ms_forcenaughtiness", { player = player, numspawns = 3 })

-- Or for debugging:
print(TheWorld.components.kramped:GetDebugString())
```

## Dependencies & tags
**Components used:** `combat`, `werebeast`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | — | The entity instance that owns this component (the world). |

## Main functions
### `DoWarningSound(player)`
*   **Description:** Triggers a delayed warning sound effect ( Krampus warning prefab) based on the player's current naughtiness level. Spawns `krampuswarning_lvl1`, `lvl2`, or `lvl3` depending on remaining actions until threshold.
*   **Parameters:** `player` (GPlayer) - The player to check and warn for.
*   **Returns:** Nothing.
*   **Error states:** No effect if the player is not tracked in `_activeplayers`.

### `OnUpdate(dt)`
*   **Description:** Called periodically to decay player naughtiness actions over time. Reduces the `actions` counter by 1 when `timetodecay` expires, resetting the decay timer.
*   **Parameters:** `dt` (number) - Delta time in seconds since last update.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a multiline debug string summarizing naughtiness data for all tracked players.
*   **Parameters:** None.
*   **Returns:** `string` - A formatted string such as `"Player wilba - Actions: 5 / 20, decay in 12.34"` for each active player.

## Events & listeners
- **Listens to:**  
  - `killed` (on each player) — triggers naughtiness checks when a victim is killed.  
  - `ms_playerjoined` — initializes tracking data for newly joined players.  
  - `ms_playerleft` — cleans up tracking data when a player leaves.  
  - `ms_forcenaughtiness` — manually triggers Krampus spawns and resets naughtiness tracking.

- **Pushes:** None.
