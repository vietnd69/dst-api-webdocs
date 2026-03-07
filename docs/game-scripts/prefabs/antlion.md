---
id: antlion
title: Antlion
description: Manages the behavior and state transitions of the Antlion boss, including desert camouflage, tribute acceptance, rage cycles, and combat activation.
tags: [boss, combat, world, ai, event]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0c14f766
system_scope: world
---

# Antlion

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `antlion` prefab represents the Antlion boss, a large desert-dwelling entity that cycles between dormant (desert-camouflaged) and aggressive (combat) states. It interacts with sandstorm conditions, tribute-giving players, and time-based rage mechanics. The prefab dynamically adds/removes combat, health, and sanity components upon state transition, while integrating with the `worldsettingstimer`, `sinkholespawner`, `trader`, and `sleeper` components to orchestrate its complex behavior.

## Usage example
```lua
-- Spawn the antlion boss prefab (typically done via worldgen or event)
local antlion = SpawnPrefab("antlion")

-- To manually trigger combat (e.g., in custom event code):
if antlion ~= nil then
    antlion.StartCombat(antlion, ThePlayer, "burn")
end

-- To manually stop combat and return to dormant state:
if antlion ~= nil and antlion.StopCombat ~= nil then
    antlion.StopCombat(antlion)
end
```

## Dependencies & tags
**Components used:**  
`burnable`, `combat`, `freezable`, `health`, `inspectable`, `lootdropper`, `sandstorms`, `sanityaura`, `sinkholespawner`, `sleeper`, `talker`, `tradable`, `trader`, `worldsettingstimer`  

**Tags added:** `epic`, `noepicmusic`, `antlion`, `largecreature`, `antlion_sinkhole_blocker`, `trader`, `hostile`, `scarytoprey`  

**Tags conditionally added/removed:** `hostile`, `scarytoprey`, `__health`, `__combat`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxragetime` | number | `TUNING.ANTLION_RAGE_TIME_INITIAL` | Current maximum rage duration (s), updated on tribute or failure. |
| `pendingrewarditem` | string \| table | `nil` | The reward item(s) to spawn upon tribute acceptance. |
| `tributer` | EntityReference | `nil` | Reference to the player who gave the tribute. |
| `_isfighting` | net_bool | `false` | Networked boolean indicating if the Antlion is currently in combat. |
| `_playingmusic` | boolean | `false` | Internal flag tracking whether boss music is active. |
| `_musictask` | Task | `nil` | Periodic task responsible for boss music triggering. |
| `inittask` | Task | `nil` | One-time initialization task. |
| `sleeptask` | Task | `nil` | Periodic healing task active only while asleep. |
| `timesincelasttalker` | number | `-TUNING.ANTLION_TRIBUTER_TALKER_TIME` | Timestamp of last tribute giver talk trigger. |

## Main functions
### `StartCombat(target, trigger)`
*   **Description:** Activates the combat state: adds health, combat, sanity aura, and burnable components; switches to `SGantlion_angry` state graph; enables sinkhole attacks. If `trigger` is `"freeze"` or `"burn"`, applies status effect andBattle Cry.
*   **Parameters:** `target` (Entity or nil) – initial combat target; `trigger` (string or nil) – `"freeze"` or `"burn"` to trigger instant response.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `inst.persists` is `false` or combat components already exist.

### `StopCombat()`
*   **Description:** Deactivates combat state: removes health, combat, sanity aura, burnable components; switches back to `SGantlion` state graph; resets rage timer and re-enables trader.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `inst.persists` is `false` or no combat components exist.

### `AcceptTest(item)`
*   **Description:** Validates whether an item is an acceptable tribute. Must be a rock with `rocktribute > 0`, and the Antlion must not already have a pending reward or be in a combat-want state.
*   **Parameters:** `item` (Entity) – the item to evaluate.
*   **Returns:** `true` if tribute is acceptable; `false` otherwise.

### `OnGivenItem(giver, item)`
*   **Description:** Processes accepted tribute: sets pending reward, extends rage timer, and may trigger freeze/burn effects. Notifies giver if cooldown elapsed.
*   **Parameters:** `giver` (Entity or nil) – player who gave the tribute; `item` (Entity) – the tribute item.
*   **Returns:** Nothing.
*   **Error states:** No direct errors; early exit if `currentTempRange` is `nil`.

### `GiveReward()`
*   **Description:** Spawns the reward item(s) toward the tribute giver (or the Antlion if giver is invalid). Resets reward state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetRageLevel()`
*   **Description:** Returns a numeric rage level (1 = VeryHappy, 2 = Neutral, 3 = Unhappy) based on remaining rage timer percentage.
*   **Parameters:** None.
*   **Returns:** number – rage level (1, 2, or 3).

### `HasRewardToGive()`
*   **Description:** Checks if a pending reward exists.
*   **Parameters:** None.
*   **Returns:** `true` if `pendingrewarditem` is non-`nil`; `false` otherwise.

## Events & listeners
- **Listens to:**  
  - `ms_stormchanged` (on TheWorld) – despawns Antlion when sandstorm ends.  
  - `attacked` – sets attacker as combat target if within range and recent combat activity is absent.  
  - `timerdone` – starts sinkhole attacks when rage timer completes.  
  - `isfightingdirty` – toggles boss music task (client-only).  
  - `death` – internal (via burnable) to stop burning effects.  

- **Pushes:**  
  - `antlion_leaveworld` – when despawning due to sandstorm.  
  - `onacceptfighttribute` – when frozen or burned tribute accepted.  
  - `onaccepttribute` – after tribute accepted and rage timer updated.  
  - `onrefusetribute` – when tribute rejected.  
  - `healthdelta` – via health component (standard).  
  - `onignite` – via burnable component (standard).