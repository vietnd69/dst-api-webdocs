---
id: bat
title: Bat
description: A flying hostile monster that can form teams and adapt its behavior and abilities when infused with acid.
tags: [combat, ai, boss, flying, team]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8211ccc8
system_scope: entity
---

# Bat

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bat` prefab represents a flying, hostile creature found in cave environments. It uses a custom brain (`SGbat` stategraph) and integrates with multiple components to handle locomotion, combat, teaming, sleep, and acid resistance. The bat can switch between solo and team-based aggression, share targets with nearby bats, and adapt its drop table, attack speed, speed, and damage output when infused with acid via the `acidinfusible` component.

## Usage example
```lua
local bat = SpawnPrefab("bat")
bat.Transform:SetPosition(x, y, z)
bat.components.combat:SetTarget(target)
bat.components.locomotor.walkspeed = TUNING.BAT_WALK_SPEED * 1.5
```

## Dependencies & tags
**Components used:** `locomotor`, `sleeper`, `combat`, `health`, `lootdropper`, `inventory`, `periodicspawner`, `inspectable`, `knownlocations`, `teamattacker`, `acidinfusible`, `eater`, `burnable`, `freezeable`, `hauntable`, `childspawner`, `homeseeker`

**Tags added:** `cavedweller`, `monster`, `hostile`, `bat`, `scarytoprey`, `flying`, `ignorewalkableplatformdrowning`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_scale` | number | `0.75` | Scale used for the scrapbook icon. |
| `_hometask` | ScheduledTask or nil | `nil` | Task scheduled to send the bat home when it sleeps (daytime). |
| `teamattacker.inteam` | boolean | `false` | Whether the bat is currently in a team. |
| `teamattacker.teamleader` | Entity (via `components.teamleader`) or nil | `nil` | Reference to the bat's team leader. |

## Main functions
### `Retarget(inst)`
*   **Description:** Finds a new valid target for the bat using distance and tag filters. If no target is in combat mode and the bat is not yet in a team, attempts to form a team with the new target.
*   **Parameters:** `inst` (Entity) — the bat instance.
*   **Returns:** `newtarget` (Entity or nil) — the newly selected target, if any.
*   **Error states:** Does not error; returns `nil` if no target is found or if the bat is in a team with a non-attacking leader.

### `KeepTarget(inst, target)`
*   **Description:** Determines whether the bat should retain its current target (e.g., during team-based coordination).
*   **Parameters:** `inst` (Entity), `target` (Entity or nil).
*   **Returns:** `true` if the bat should keep the target (when in a team but leader is not attacking, or when orders are `ORDERS.ATTACK`); otherwise `false`.

### `OnInfuse(inst)`
*   **Description:** Activated when the bat is infused with acid. Modifies visual appearance (eye color/light), updates loot table, increases retarget frequency, enables nitre eating, and adds the `thief` component.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnUninfuse(inst)`
*   **Description:** Reverses the effects of acid infusion: resets visuals and loot table, slows retargeting, disables nitre eating, and removes the `thief` component.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Handles the bat being attacked. Attempts to form a team or alert existing teammates for support.
*   **Parameters:**  
    - `inst` (Entity) — the bat instance.  
    - `data` (table) — event data, must contain `attacker`.  
*   **Returns:** Nothing.
*   **Error states:** Early return if `data.attacker` is `nil`.

### `OnIsDay(inst, isday)`
*   **Description:** Schedules or cancels a task to return home when it becomes day (bat sleep behavior).
*   **Parameters:** `inst` (Entity), `isday` (boolean) — current world time state.
*   **Returns:** Nothing.

### `BatSleepTest(inst, ...)`
*   **Description:** Custom sleep test that prevents sleeping while acid-infused.
*   **Parameters:** `inst` (Entity), plus additional arguments passed by `sleeper`.
*   **Returns:** `false` if infused; otherwise calls `NocturnalSleepTest(inst, ...)`.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to prompt teaming and sharing of targets.
- **Listens to:** `enterlimbo` and `exitlimbo` — managed via `OnEntitySleep` and `OnEntityWake` to start/stop day-watching.

## Notes
- The bat periodically spawns `guano` via `periodicspawner` (default intervals: 120–240 seconds).
- Acid infusion modifies core combat behavior and adds utility (e.g., nitre eating, stealing). The `thief` component is dynamically added/removed during infuse/uninfuse events.
- Team coordination is supported via `teamattacker` and `teamleader` components; teams are shared across bats within `SHARE_TARGET_DIST` (40 units), up to `MAX_TARGET_SHARES` (5).