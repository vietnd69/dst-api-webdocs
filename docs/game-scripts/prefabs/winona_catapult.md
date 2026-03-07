---
id: winona_catapult
title: Winona Catapult
description: Manages the combat, power, and state behavior of Winona's catapult structure, including targeting logic, skill tree upgrades, active/inactive states, and circuit connectivity.
tags: [combat, ai, power, engineering, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a54773cb
system_scope: entity
---

# Winona Catapult

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winona_catapult` prefab implements the core behavior of Winona's catapult, a powered engineering structure used for area denial and defense. It integrates multiple systems: combat targeting with dynamic range constraints, circuit-based power sourcing from engineering batteries, state management (sleep/active modes), and skill tree bonuses for speed and AOE radius. The catapult acts as a persistent structure with health, power consumption, and fire resistance properties, and supports multiplayer sync via replicated properties (`_ispowered`, `_poweralignment`, `_element`). It is tightly integrated with Winona's skill tree and can be upgraded via engineer-specific perks.

## Usage example
```lua
-- Typical usage for a modder to detect catapult power state
local catapult = SpawnPrefab("winona_catapult")
catapult:AddComponent("powerload")
catapult.components.powerload:SetLoad(10) -- set load manually if needed

-- Check if powered and active
if catapult.components.winona_catapult and catapult.IsPowered(catapult) then
    print("Catapult is powered")
    if catapult.IsActiveMode(catapult) then
        print("Catapult is actively targeting")
    end
end
```

## Dependencies & tags
**Components used:** `activatable`, `burnable`, `circuitnode`, `colouradder`, `combat`, `deployable`, `deployhelper`, `fueled`, `hauntable`, `health`, `inspectable`, `inventory`, `lootdropper`, `placer`, `portablestructure`, `powerload`, `savedrotation`, `skilltreeupdater`, `timer`, `updatelooper`, `workable`, `planardamage`, `damagetypebonus`.

**Tags added:** `companion`, `noauradamage`, `engineering`, `engineeringbatterypowered`, `catapult`, `structure`, `electricdamageimmune`, `notarget` (on burnout).  
**Tags checked:** `player`, `handyperson`, `_combat`, `INLIMBO`, `engineering`, `eyeturret`, `burnt`, `rangedlighter`, `extinguisher`, `battery`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_speed` | number | `0` | Skill tree speed tier (`1`–`3`, or `0`). Affects attack period. |
| `_aoe` | number | `0` | Skill tree AOE tier (`1`–`3`, or `0`). Scales AOE radius. |
| `_engineerid` | string? | `nil` | `userid` of the engineer who built it; used for ownership and indirect usage. |
| `_poweralignment` | net_tinybyte | `0` | Networked power alignment: `0`=none, `1`=shadow, `2`=lunar, `3`=hybrid. |
| `_ispowered` | net_bool | `false` | Networked power state (`true` if currently receiving power). |
| `_element` | net_tinybyte | `0` | Networked elemental projectile type (`1`=shadow, `2`=lunar). |
| `_wired` | boolean? | `nil` | `true` when successfully connected to a circuit/battery. |
| `_powertask` | task? | `nil` | Task scheduled to power off the catapult after battery exhaustion. |
| `AOE_RADIUS` | number | `TUNING.WINONA_CATAPULT_AOE_RADIUS` | Computed AOE radius based on `_aoe` skill tier. |

## Main functions
### `ConfigureSkillTreeUpgrades(inst, builder)`
* **Description:** Queries the builder's skill tree to determine current `_speed` and `_aoe` tiers. Updates the catapult's properties and returns `true` if any upgrade changed.
* **Parameters:** `builder` (Entity?) — the entity that built or interacted with the catapult.
* **Returns:** `boolean` — `true` if `_speed` or `_aoe` values changed; `false` otherwise.

### `SetActiveMode(inst, active)`
* **Description:** Toggles the catapult between active (targeting) and inactive (sleep/idle) states. Manages power load, LED status, brain assignment, and timer behavior. Requires `active` and `_powertask` to be non-`nil` for activation.
* **Parameters:** `active` (boolean) — whether the catapult should enter active state.
* **Returns:** Nothing.

### `AddBatteryPower(inst, power)`
* **Description:** Extends the catapult's powered runtime by `power` seconds. If the catapult was previously unpowered, it creates the `activatable` component and schedules the `PowerOff` callback.
* **Parameters:** `power` (number) — time in seconds to add to the power duration.
* **Returns:** Nothing.

### `RetargetFn(inst)`
* **Description:** Custom retarget logic for the catapult. Prioritizes players or mobs already fighting the catapult. Filters targets based on distance constraints (`WINONA_CATAPULT_MIN_RANGE`–`WINONA_CATAPULT_MAX_RANGE`).
* **Parameters:** `inst` (Entity) — the catapult instance.
* **Returns:** Entity? — a valid target, or `nil` if none available.

### `OnActivate(inst, doer)`
* **Description:** Activates the catapult when triggered manually (e.g., via remote or proximity). Handles skill tree reconfiguration, LED feedback, and mode transition. Prevents reactivation for 1 second after activation via `OnAllowReactivate`.
* **Parameters:** `doer` (Entity?) — the entity triggering activation.
* **Returns:** `true` — always succeeds.

### `OnWorked(inst, worker, workleft, numworks)`
* **Description:** Handles hammering damage. Delegates actual damage to the combat component using tuned damage values.
* **Parameters:** `worker` (Entity), `workleft` (number), `numworks` (number).
* **Returns:** Nothing.

### `OnBurnt(inst)`
* **Description:** Transforms the burnt catapult into a non-functional object with removed combat/health components and a modified work callback (`OnWorkedBurnt`). Applies `burnt` tag and removes networked components.
* **Parameters:** `inst` (Entity) — the burnt catapult.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — initializes the catapult after building (calls `DoBuiltOrDeployed`).  
- **Listens to:** `attacked` — redirects aggression to the attacker (if in range), triggers sharing with nearby allies.  
- **Listens to:** `death` — handles cleanup (disconnects circuit, stops regen, drops loot, transitions to death state).  
- **Listens to:** `healthdelta` — starts/stops health regen based on damage state.  
- **Listens to:** `engineeringcircuitchanged` — updates `_poweralignment` based on connected battery elements.  
- **Listens to:** `activewakeup` — wakes and reactivates the catapult via `OnActiveWakeup`.  
- **Listens to:** `catapultspeedboost` — applies temporary attack speed increase.  
- **Listens to:** `winona_catapultskillchanged` — re-applies skill bonuses when the engineer upgrades relevant skills.  
- **Listens to:** `timerdone` — deactivates when `active_time` timer expires; refreshes attack period on `boost` timer.

- **Pushes:** `togglepower` — with `{ ison = bool }`, fired when power state changes (active ↔ inactive).  
- **Pushes:** `engineeringcircuitchanged` — forwarded to connected circuit nodes to notify of element changes.