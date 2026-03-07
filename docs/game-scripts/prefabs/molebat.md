---
id: molebat
title: Molebat
description: A cave-dwelling bat prefab that engages in combat, shares targets with nearby allies, naps periodically, and manages a home burrow using multiple components.
tags: [combat, ai, boss, sleep, group_behavior]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 652664cf
system_scope: entity
---

# Molebat

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `molebat` prefab implements a hostile cave-dwelling bat with AI-driven behavior that includes combat engagement, ally summoning, periodic napping, and burrow-based navigation. It relies on multiple components (`combat`, `health`, `sleeper`, `locomotor`, `lootdropper`, `eater`, `entitytracker`, `timer`, `knownlocations`, and `inspectable`) to define its behavior, lifecycle, and interactions. The bat can summon other moles when attacked, shares combat targets with nearby allies, wakes up upon proximity to players, and uses a timer-based system to manage nap cooldowns and ally summoning windows. It persists state across saves and handles world events like quakes.

## Usage example
```lua
local molebat = SpawnPrefab("molebat")
molebat.Transform:SetPosition(x, y, z)
molebat.components.sleeper:AddSleepiness(2, 10) -- Force nap
molebat.components.combat:SetTarget(some_target)
molebat.components.locomotor.walkspeed = 6
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `entitytracker`, `health`, `knownlocations`, `locomotor`, `lootdropper`, `sleeper`, `timer`, `inspectable`

**Tags added:** `bat`, `cavedweller`, `hostile`, `monster`, `scarytoprey`, `lunar_aligned`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_can_summon_allies` | boolean | `false` | Whether the molebat is allowed to summon allies. |
| `_wants_to_nap` | boolean | `false` | Whether the molebat wants to nap (subject to state constraints). |
| `_quaking` | boolean or `nil` | `nil` | `true` during a quake event (prevents sleep). |
| `_nest_needs_cleaning` | boolean | `false` | Set to `true` after a period of wakefulness, likely triggers burrow cleanup. |
| `ShouldSummonAllies` | function | `should_summon_allies` | Returns `true` if no allies are present and summoning is allowed. |
| `SummonAlly` | function | `summon_ally` | Spawns and bonds a new molebat ally. |
| `WantsToNap` | function | `wants_to_nap` | Returns `true` if napping is desired and no quake is occurring. |
| `Nap` | function | `do_nap` | Triggers napping via `sleeper` component. |

## Main functions
### `should_summon_allies(inst)`
* **Description:** Checks whether the molebat is allowed to summon a new ally (`_can_summon_allies` is `true`) and no ally is currently tracked.
* **Parameters:** `inst` (Entity) — the molebat instance.
* **Returns:** `boolean` — `true` if allies may be summoned.
* **Error states:** Returns `false` if `entitytracker` component is missing.

### `summon_ally(inst)`
* **Description:** Spawns a new molebat, bonds it as an ally, assigns the same home location and burrow (if present), and positions it nearby using a walkable offset.
* **Parameters:** `inst` (Entity) — the spawning molebat.
* **Returns:** Nothing.
* **Error states:** Silently fails if a walkable spawn point cannot be found.

### `Retarget(inst)`
* **Description:** Finds the closest valid target in increasing priority: insect first, then any monster/character/smallcreature within `MOLEBAT_TARGET_DIST`.
* **Parameters:** `inst` (Entity) — the molebat instance.
* **Returns:** `Entity?` — closest valid target or `nil`.
* **Error states:** Skips invisible entities or ones with combat-forbidden tags.

### `KeepTarget(inst, target)`
* **Description:** Ensures the molebat stops chasing a target if it moves beyond the maximum chase distance from its home location.
* **Parameters:** 
  * `inst` (Entity) — the molebat.
  * `target` (Entity) — the current combat target.
* **Returns:** `boolean` — `true` if target should be kept; `false` if too far from home.

### `OnAttacked(inst, data)`
* **Description:** Sets the attacker as the current target and notifies nearby bat allies to join the fight.
* **Parameters:** 
  * `inst` (Entity) — the molebat.
  * `data` (table) — attack event data (must contain `attacker` field).
* **Returns:** Nothing.
* **Error states:** Ignores attacks by other bats.

### `OnWakeUp(inst)`
* **Description:** Resets nap cooldown, cancels distance-check tasks, and sets `_nest_needs_cleaning = true` if the molebat was awake; deletes burrow if woke while sleeping.
* **Parameters:** `inst` (Entity) — the molebat.
* **Returns:** Nothing.

### `do_nap(inst)`
* **Description:** Adds sleepiness to trigger the sleeper state and starts a periodic task to monitor distance to burrow.
* **Parameters:** `inst` (Entity) — the molebat.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Handles timed events: remember initial location, reset ally summon flag, enable napping, and set nest cleanup flag.
* **Parameters:** 
  * `inst` (Entity) — the molebat.
  * `data` (table) — timer event data with `name` field.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  * `attacked` — triggers `OnAttacked`.
  * `onwakeup` — triggers `OnWakeUp`.
  * `summon` — triggers `OnSummon`.
  * `timerdone` — triggers `OnTimerDone`.
  * `startquake` / `endquake` — triggers `OnQuakeBegin` / `OnQuakeEnd` via `TheWorld.net`.
- **Pushes:** Uses existing component events (`onwakeup` via `sleeper`) and internal events (`OnEntitySleep`, `OnEntityWake`).
