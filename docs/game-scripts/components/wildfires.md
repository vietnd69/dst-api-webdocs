---
id: wildfires
title: Wildfires
description: Manages the logic for spontaneous wildfire ignition during summer days in hot, dry conditions, using active players as potential ignition sources.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: c0be1b7a
---

# Wildfires

## Overview
This component monitors environmental conditions (season, phase, temperature, and wetness) to determine when wildfires can spontaneously ignite. When active, it periodically attempts to start a fire at random valid locations near each active player. It only operates on the master simulation, enforcing server-side exclusivity.

## Dependencies & Tags
**Component Dependencies:**
- `TheWorld` (global world instance)
- `TheSim` (global simulation accessor)
- `AllPlayers` (global list of players)

**Tags Used for Filtering:**
- `_excludetags`: `"wildfireprotected"`, `"fire"`, `"burnt"`, `"player"`, `"companion"`, `"NOCLICK"`, `"INLIMBO"`

**Tags Checked During Validation:**
- `"fireimmune"`, `"wildfirepriority"`, `"shadecanopy"`, `"shadecanopysmall"`
- `Pickable` component: `IsWildfireStarter()` method
- `Witherable` component: `IsProtected()`, `IsWithered()` methods
- `Workable` component: `GetWorkAction() == ACTIONS.CHOP`

**Events Registered:**
- `"weathertick"`, `"seasontick"`, `"temperaturetick"`, `"phasechanged"`
- `"ms_lightwildfireforplayer"`, `"ms_playerjoined"`, `"ms_playerleft"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to (the world). |
| `_activeplayers` | `table` | `{}` | List of currently active player entities. |
| `_scheduledtasks` | `table` | `{}` | Maps player entities to their pending fire-ignition tasks. |
| `_issummer` | `boolean` | `false` | Whether the current season is Summer. |
| `_isday` | `boolean` | `true` | Whether the current world phase is "day". |
| `_iswet` | `boolean` | `false` | Whether current weather makes ignition difficult (wetness or snow > 0). |
| `_ishot` | `boolean` | `TUNING.STARTING_TEMP > TUNING.WILDFIRE_THRESHOLD` | Whether ambient temperature exceeds the wildfire ignition threshold. |
| `_chance` | `number` | `TUNING.WILDFIRE_CHANCE` | Base probability per tick for ignition (if conditions are met). |
| `_radius` | `number` | `25` | Radius around players within which to search for ignition targets. |
| `_updating` | `boolean` | `false` | Whether the component is actively scheduling ignition attempts. |
| `_excludetags` | `table` | `{ "wildfireprotected", "fire", "burnt", "player", "companion", "NOCLICK", "INLIMBO" }` | Tags that disqualify entities as fire starters. |

## Main Functions

### `CheckValidWildfireStarter(obj)`
* **Description:** Determines whether an entity is eligible to ignite a wildfire, based on tags, components, environmental protection, and temperature.
* **Parameters:**
  * `obj` (`Entity`): The entity to evaluate.

### `LightFireForPlayer(player, rescheduleFn)`
* **Description:** Attempts to ignite a wildfire for a specific player. It performs a luck roll, checks for sandstorm interference, finds candidate fire-starting entities nearby, and selects one to ignite.
* **Parameters:**
  * `player` (`Entity`): The player whose position is used as the origin for finding ignition targets.
  * `rescheduleFn` (`function`): Callback function used to reschedule the next ignition attempt for this player.

### `ScheduleSpawn(player)`
* **Description:** Schedules a fire-ignition task for a given player if no task is already pending.
* **Parameters:**
  * `player` (`Entity`): The player for whom to schedule an ignition attempt.

### `CancelSpawn(player)`
* **Description:** Cancels any pending fire-ignition task for a given player and clears its schedule entry.
* **Parameters:**
  * `player` (`Entity`): The player whose scheduled task should be cancelled.

### `ToggleUpdate()`
* **Description:** Enables or disables the wildfire engine based on current environmental conditions (summer, day, hot, dry). When activated, schedules ignition tasks for all active players; when deactivated, cancels all pending tasks.
* **Parameters:** None.

### `ForceWildfireForPlayer(inst, player)`
* **Description:** Immediately attempts to ignite a wildfire for a given player, bypassing the normal scheduling logic. Only proceeds if environmental conditions are currently favorable.
* **Parameters:**
  * `inst` (`Entity`): The world instance.
  * `player` (`Entity`): The player for whom to force a fire ignition.

### `GetDebugString()`
* **Description:** Returns a string indicating whether the wildfire system is currently active.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"weathertick"` → updates `_iswet` and calls `ToggleUpdate()`
  - `"seasontick"` → updates `_issummer` and calls `ToggleUpdate()`
  - `"temperaturetick"` → updates `_ishot` and calls `ToggleUpdate()`
  - `"phasechanged"` → updates `_isday` and calls `ToggleUpdate()`
  - `"ms_lightwildfireforplayer"` → triggers `ForceWildfireForPlayer()`
  - `"ms_playerjoined"` → adds the new player and schedules ignition if active
  - `"ms_playerleft"` → removes the player and cancels pending tasks
- **Emits (via `inst:PushEvent`):**
  - None directly. Uses internal state and external triggers.