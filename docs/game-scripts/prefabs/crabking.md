---
id: crabking
title: Crabking
description: Manages the Crab King boss entity, including spellcasting, gem socketing, arena generation, and combat behavior.
tags: [combat, boss, ai, arena, spellcasting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5bf18c19
system_scope: entity
---

# Crabking

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`crabking.lua` defines the `CrabKing` entity, a large ocean boss with intricate mechanics including gem socketing, dynamic arena generation (ice rings, towers, claws), and multiple spellcasting phases (geyser waves and freezing attacks). It uses the Entity Component System (ECS) and integrates with components like `health`, `combat`, `lootdropper`, `timer`, `sleeper`, `freezable`, `burnable`, `trader`, and `childspawner`. The entity coordinates complex behavior through StateGraph (`SGcrabking`), a custom brain (`crabkingbrain`), and internal helper functions that spawn and manage minions, ice walls, and cannons. It also handles save/load for persistence and entity sleep transitions.

## Usage example
```lua
local crabking = SpawnPrefab("crabking")
crabking.Transform:SetPosition(x, y, z)

-- Socket a blue gem to increase freeze duration
local gem = SpawnPrefab("bluegem")
crabking.components.trader:AcceptItem(gem)

-- Trigger a spell (e.g., geyser wave)
crabking.sg:GoToState("cast_spell")
```

## Dependencies & tags
**Components used:**  
`age`, `boatphysics`, `burnable`, `childspawner`, `combat`, `complexprojectile`, `freezable`, `health`, `hull`, `hullhealth`, `inspectable`, `inventory`, `locomotor`, `lootdropper`, `messagebottlemanager`, `moisture`, `oceanfishable`, `oceanicemanager`, `sleeper`, `temperature`, `timer`, `trader`, `weighable`, `workable`

**Tags added:**  
`birdblocker`, `crabking`, `gemsocket`, `largecreature`, `crabking_ally`, `lunar_aligned`, `whip_crack_imune`, `ignorewalkableplatforms`, `NOCLICK`, `fx`, `crabking_spellgenerator`, `waterplant`, `boat`, `flying`, `shadow`, `ghost`, `playerghost`, `player`, `epic`, `NPC_workable`, `oceanfish`, `frozen`, `boat_repaired_patch`, `boatleak`, `_combat`, `hostile`, `wall`, `INLIMBO`, `seastack`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `socketlist` | table | `{1,2,3,4,6,7,8,9}` | List of available socket slots (5 omitted intentionally). |
| `nondamagedsymbollist` | table | `{1,2,3,4,5,6,7,8,9,10}` | Tracks non-damaged visual symbols for art state. |
| `damagedsymbollist` | table | `{}` | Tracks damaged visual symbols for art state. |
| `socketed` | table | `{}` | List of socketed gem data `{slot, itemprefab}`. |
| `tasks` | table | `{}` | Tracks active tasks for cleanup and management. |
| `gemcount` | table | `{red=0, blue=0, purple=0, orange=0, yellow=0, green=0, opal=0, pearl=0}` | Counts of each gem color socketed (modified by opal/pearl). |
| `damagetotal` | number | `0` | Accumulated damage taken, used for ice stage triggers. |
| `keystones` | table | `nil` | List of `crabking_icewall` entities during ice arena phase. |
| `arms` | table | `nil` | List of active claw arms. |
| `cannontowers` | table | `{}` | List of active cannon towers. |
| `geysers` | table | `{}` | List of active geyser spawners. |

## Main functions
### `SocketItem(item, socketnum, load)`
*   **Description:** Inserts a gem into a socket, updates visual symbols and gem counts, and may activate the boss if all 9 sockets are filled.
*   **Parameters:**  
    `item` (Entity) - The gem entity to socket.  
    `socketnum` (number or `nil`) - Specific slot index or `nil` to pick randomly from available slots.  
    `load` (boolean) - If `true`, skip sound effects and events for loading state.
*   **Returns:** Nothing.
*   **Error states:** Removes `irreplaceable` tag from item and destroys it after insertion.

### `EndCastSpell(lastwasfreeze)`
*   **Description:** Finalizes spell casting by spawning an ice arena with keystone walls, projectiles, minions, and geysers. Clears current state and sets up timers.
*   **Parameters:** `lastwasfreeze` (boolean, unused) — legacy parameter.
*   **Returns:** Nothing.
*   **Error states:** Cancels pending wave tasks and clears geysers.

### `SpawnCannons()`
*   **Description:** Spawns cannon towers on Sea Stacks and in open ocean, updating the `cannontowers` array and attaching emergency brakes to boats if anchored.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Towers may be assigned `false` if positioning fails.

### `DoSpawnArm(armpos, fx)`
*   **Description:** Periodically attempts to spawn a new claw arm at the specified position index using `TrySpawningArm` until successful.
*   **Parameters:**  
    `armpos` (number) - Index into the `arms` array.  
    `fx` (Entity, unused) — legacy parameter.
*   **Returns:** Nothing.
*   **Error states:** Does not spawn if `inst.arms == nil` (e.g., during entity sleep).

### `LaunchCrabMob(prefab)`
*   **Description:** Launches a crab mob projectile (e.g., `crabking_mob` or `crabking_mob_knight`) at a random valid position above water.
*   **Parameters:** `prefab` (string) - Prefab name of the mob to launch.
*   **Returns:** Nothing.
*   **Error states:** Launches only one mob per call, even if multiple valid positions exist.

### `RemoveIceArena(instant)`
*   **Description:** Destroys the ice arena (ice tiles, keystone walls) and cancels associated tasks. Used during spell cooldown or boss death.
*   **Parameters:** `instant` (boolean) — If `true`, removes entities immediately; otherwise queues delayed removal.
*   **Returns:** Nothing.

### `OnHealthChange(inst, data)`
*   **Description:** Manages visual damage art (symbol overwrites) based on health percentage and regenerates repaired symbols as health recovers.
*   **Parameters:**  
    `inst` (Entity) — the Crab King instance.  
    `data` (table) — Contains `oldpercent`, `newpercent`, and optionally `instant`, `amount`.
*   **Returns:** Nothing.
*   **Error states:** Uses `data.instant` to skip visual FX when loading saved state.

### `OnEntitySleep(inst)`
*   **Description:** Called when the entity enters entity sleep (e.g., far from players). Cleans up arena and spells, resets health, and removes active tags/components to revert to inert state.
*   **Parameters:** `inst` (Entity) — the Crab King instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `attacked` — triggers `OnAttacked` (spawns debris FX).  
    `death` — triggers `OnDeath` (calls `CleanUpArena`).  
    `healthdelta` — triggers `OnHealthChange` (manages damage art).  
    `freeze` — triggers `OnFreeze` (clears spell generators).  
    `icefloebreak` — triggers `onicetilebreak` (detects when nearby ice breaks).  
    `onremove` (on keystones/towers/claws) — triggers cleanup handlers (`OnKeyStoneRemoved`, `OnCannonTowerRemoved`, `OnArmRemoved`).  
    `endspell` (on spell generators) — triggers `endfreeze` or `endgeyser`.

- **Pushes:**  
    `socket` — fired when a gem is inserted.  
    `activate` — fired when max sockets are filled.  
    `hit_ground` — fired when a launched mob lands.  
    `ck_taunt` — fired when spawning an ice arena.