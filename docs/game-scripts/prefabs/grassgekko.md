---
id: grassgekko
title: Grassgekko
description: Defines the Grassgekko entity, a small animal prefab that patrols, sleeps in short naps, and joins herds.
tags: [entity, animal, sleeper, herding]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b9031124
system_scope: entity
---

# Grassgekko

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grassgekko` is a prefab definition for the Grassgekko small creature. It creates the entity with core physics, animation, sound, and network components, then attaches behavior-affecting components such as `health`, `combat`, `lootdropper`, `playerprox`, `sleeper`, `locomotor`, and `herdmember`. The prefab integrates with DST’s ECS through component composition and custom sleep/wake tests that implement catnap-style behavior. It uses a custom brain (`grassgekkobrain`) and state graph (`SGgrassgekko`) to drive its AI.

## Usage example
```lua
-- Typically instantiated by the game engine via Prefab system.
-- Modders should not call `fn()` directly but can spawn instances with:
local inst = SpawnPrefab("grassgekko")
if inst and inst.components then
    inst.components.health:SetMaxHealth(50)
    inst.components.locomotor.walkspeed = 5
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `lootdropper`, `playerprox`, `herdmember`, `sleeper`, `locomotor`, `timer`, `inspectable`, `knownlocations`, `drownable`.

**Tags added:** `smallcreature`, `animal`, `grassgekko`, `herdmember`.

**Tags checked (at runtime):** `busy` (via state graph tag).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hasTail` | boolean | `true` | Tracks whether the grassgekko has a tail (initially true, hidden if `growTail` timer is active). |
| `last_sleep_time` | number or `nil` | `nil` | Timestamp of last sleep onset; used by `sleeper` to manage naps. |
| `last_wake_time` | number | `GetTime()` at spawn | Timestamp of last wake-up, initialized to current time. |
| `nap_interval` | number | `math.random(TUNING.MIN_CATNAP_INTERVAL, TUNING.MAX_CATNAP_INTERVAL)` | Minimum time (in seconds) between end of one nap and start of next. |
| `nap_length` | number | `math.random(TUNING.MIN_CATNAP_LENGTH, TUNING.MAX_CATNAP_LENGTH)` | Duration of current nap in seconds. |
| `tailGrowthPending` | boolean | `nil` | Set to `true` when `growTail` timer completes; indicates tail should be re-hidden on load if regrown later. |

## Main functions
### `GetRunAngle(inst, pt, hp)`
* **Description:** Computes a valid running angle away from a hazard point (`hp`) toward a target point (`pt`), attempting to avoid walls and water using `FindWalkableOffset`. Returns an angle in degrees.
* **Parameters:**  
  `inst` (Entity) — the grassgekko instance.  
  `pt` (Vector3) — target position to run toward.  
  `hp` (Vector3) — hazard point (e.g., fire, electric fence) to flee from.  
* **Returns:**  
  `number` — computed running angle in degrees (0–360), or `nil` if no valid direction found (rare).  
* **Error states:** Falls back to raw angle (+/- random offset) if all `FindWalkableOffset` attempts fail.

### `SleepTest(inst)`
* **Description:** Called periodically by the `sleeper` component to decide whether the grassgekko should fall asleep. Returns `true` to initiate sleep.
* **Parameters:**  
  `inst` (Entity) — the grassgekko instance.  
* **Returns:**  
  `true` — if it’s safe to sleep (no nearby players, no combat, not raining for rain-sensitive species), and enough time has passed since last wake-up.  
  `nil` — if conditions prevent sleep.  
* **Error states:** Early returns (`nil`) if leader exists, combat target exists, player is nearby (`playerprox`), or it is raining and `rainimmunity` is absent.

### `WakeTest(inst)`
* **Description:** Called periodically by the `sleeper` component to decide whether the grassgekko should wake from its nap. Returns `true` to wake up.
* **Parameters:**  
  `inst` (Entity) — the grassgekko instance.  
* **Returns:**  
  `true` — if nap duration has elapsed or it started raining and the entity lacks rain immunity.  
  `nil` — if still within nap duration and conditions are stable.  
* **Error states:** Resets `nap_interval` and `last_wake_time` only upon waking; no failures expected.

### `OnLoad(inst, data)`
* **Description:** Loads deferred state after the entity is fully restored from save. Specifically, checks for a pending `growTail` timer and hides the tail animation.
* **Parameters:**  
  `inst` (Entity) — the grassgekko instance.  
  `data` (table) — save data (unused except for timer check).  
* **Returns:** Nothing.  
* **Error states:** If `growTail` timer exists, sets `inst.tailGrowthPending = true` and hides the `tail` animation.

## Events & listeners
- **Listens to:**  
  `timerdone` — handled by `ontimerdone`, sets `inst.tailGrowthPending = true` when `growTail` timer completes.
- **Pushes:** None directly; events are handled by attached components (e.g., `sleeper` pushes `onwakeup`, `onsleep` internally).