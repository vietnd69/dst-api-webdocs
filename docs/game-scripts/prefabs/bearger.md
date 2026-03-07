---
id: bearger
title: Bearger
description: Implements the logic and behavior of the Bearger boss and its mutated variant, including hibernation, shedding, target stealing, and special combat mechanics.
tags: [boss, combat, ai, seasonal, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 515f88fe
system_scope: entity
---

# Bearger

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bearger.lua` defines the prefabs for the `bearger` and `mutatedbearger` entities — large, seasonal bosses in DST. It handles core behaviors such as hibernation during winter/spring, shedding `furtuft`, ground pounding with destruction effects, target stealing from players, sanity aura, and mutations-specific systems like planar damage, gestalt flames, and butt-recovery phases. It leverages multiple components (e.g., `combat`, `sleeper`, `shedder`, `lootdropper`, `locomotor`) and integrates with world state (seasons, players, lunar rift mutations). The prefabs are created via `normalfn()` and `mutatedfn()`, both building on a shared `commonfn()` foundation.

## Usage example
```lua
-- Create a normal Bearger
local bearger = Prefab("bearger", "prefabs/bearger")
local entity = bearger()

-- Set up Behaviors (not shown here — AI state graph is handled internally)
entity.components.combat:SetDefaultDamage(15)
entity.components.health:SetMaxHealth(1200)

-- Mutated Bearger
local mutated_bearger = Prefab("mutatedbearger", "prefabs/bearger")
local m_entity = mutated_bearger()
m_entity.components.planardamage:SetBaseDamage(12)
m_entity.components.health:SetMaxHealth(1600)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `shedder`, `lootdropper`, `inspectable`, `knownlocations`, `groundpounder`, `drownable`, `locomotor`, `sleeper`, `sanityaura`, `eater`, `thief`, `inventory`, `explosiveresist`, `planardamage`, `planarentity`.

**Tags added:**
- `epic`, `monster`, `hostile`, `bearger`, `scarytoprey`, `largecreature` (shared)
- `hibernation`, `asleep` (conditional, via sleeper and season logic)
- `lunar_aligned`, `gestaltmutant`, `bearger_blocker`, `noepicmusic`, `soulless` (mutated only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `seenbase` | `any` | `nil` | Tracks whether the base Bearger has been seen (used by brain). |
| `num_food_cherrypicked` | `number` | `0` | Counter for stolen food from target; triggers aggression when threshold met. |
| `recentlycharged` | `table` | `{}` | Tracks recently destroyed workables to prevent duplicate destruction on collision. |
| `_activeplayers` | `table` | `{}` | List of players currently tracking and potentially interfering with the Bearger. |
| `StandState` | `string` | `"quad"` | Current stance mode (`"quad"` or `"bi"`); used for animation state switching. |
| `temp8faced` | `net_bool` | `nil` | (Mutated only) Networked boolean flag for 8-faced animation mode. |
| `recovery_starthp` | `number?` | `nil` | (Mutated only) HP percentage at start of butt-recovery phase. |
| `recovery_norunningbutt` | `boolean?` | `nil` | (Mutated only) Whether `runningbutt` should be disabled during recovery. |

## Main functions
### `commonfn(build, commonfn)`
*   **Description:** Core prefab initializer used by both normal and mutated Bearger prefabs. Sets up transforms, animations, physics, common components, and global event listeners (e.g., `attacked`, `onhitother`). Calls an optional `commonfn(inst)` hook for shared extension logic.
*   **Parameters:** 
    - `build` (string) – Animation build bank (e.g., `"bearger_build"`, `"bearger_yule"`, `"bearger_mutated"`).
    - `commonfn` (function?) – Optional additional initialization function (e.g., `mutatedcommonfn`).
*   **Returns:** `Entity` – A fully initialized but not yet fully configured Bearger entity.
*   **Error states:** Returns early on the client if `TheWorld.ismastersim` is false (no server-side setup performed).

### `normalfn()`
*   **Description:** Constructor for the standard Bearger prefab. Adds `thief`, `inventory`, `eater`, and `sleeper` components, sets stats and retarget logic for normal behavior, and registers player interaction hooks (e.g., stealing targets via `performaction`).
*   **Parameters:** None.
*   **Returns:** `Entity` – Fully configured normal Bearger instance.
*   **Error states:** None; depends on Tuning constants and world season.

### `mutatedfn()`
*   **Description:** Constructor for the Mutated Bearger prefab. Extends `commonfn` with mutation-specific logic: planar damage, gestalt flames (FX), networked `temp8faced` flag, butt-recovery logic, and loot behavior contingent on `wagboss_tracker`. Handles 4/8-faced switching and music triggers.
*   **Parameters:** None.
*   **Returns:** `Entity` – Fully configured Mutated Bearger instance.

### `Mutated_SwitchToEightFaced(inst)`
*   **Description:** Switches the Mutated Bearger to eight-faced mode (activates gestalt eyes/flames). Also updates networked `temp8faced` state.
*   **Parameters:** `inst` (Entity) – The Mutated Bearger instance.
*   **Returns:** Nothing.

### `Mutated_SwitchToFourFaced(inst)`
*   **Description:** Reverts the Mutated Bearger to four-faced mode.
*   **Parameters:** `inst` (Entity) – The Mutated Bearger instance.
*   **Returns:** Nothing.

### `ShouldSleep(inst)`
*   **Description:** Determines whether Bearger should enter hibernation based on season (`winter` or `spring`), lack of combat target, and not being on fire. Stops shedding, adds `hibernation` and `asleep` tags, and overrides head animation.
*   **Parameters:** `inst` (Entity) – The Bearger instance.
*   **Returns:** `boolean` – `true` if hibernation should begin; otherwise `false`.

### `ShouldWake(inst)`
*   **Description:** Determines whether Bearger should wake from hibernation based on season (non-hibernation season). Restores shedding and clears hibernation state.
*   **Parameters:** `inst` (Entity) – The Bearger instance.
*   **Returns:** `boolean` – `true` if waking should proceed; otherwise `false`.

### `OnPlayerAction(inst, player, data)`
*   **Description:** Handles player interference while Bearger is targeting the same food source. Increases `num_food_cherrypicked`; if threshold exceeded (`TUNING.BEARGER_STOLEN_TARGETS_FOR_AGRO`), aggroes the player.
*   **Parameters:** 
    - `inst` (Entity) – The Bearger instance.
    - `player` (Entity) – The player performing the action.
    - `data` (table) – Action event data.
*   **Returns:** Nothing.

### `LaunchItem(inst, target, item)`
*   **Description:** Launches a dropped item toward the Bearger’s target, used when Bearger steals equipment (e.g., via swipe attack).
*   **Parameters:** 
    - `inst` (Entity) – The Bearger instance.
    - `target` (Entity) – The item's original owner/target.
    - `item` (Entity) – The item to launch.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` (`OnAttacked`) – Sets combat target to attacker.
  - `onhitother` (`OnHitOther`) – Handles equipment theft and item launch; skips if `redirected`.
  - `killed` (`OnKilledOther`) – Drops target and removes `dropitem` listener on victim.
  - `newcombattarget` (`OnCombatTarget`) – Manages food-cherry-pick state and `dropitem` listeners on new target.
  - `droppedtarget` (`OnDroppedTarget`) – Cleans up `dropitem` listeners on old target.
  - `onwakeup` (`OnWakeUp`) – Remembers Bearger spawn position for reference.
  - `death` (`OnDead` / `Mutated_OnDead`) – Handles achievements and mutation tracking.
  - `onremove` (`OnRemove`) – Broadcasts removal event.
  - `ms_playerjoined` / `ms_playerleft` – Tracks active players and registers `performaction` listening.
  - `performaction` (`OnPlayerAction`) – Processes player’s interaction with Bearger’s current target.
  - `season` (`OnSeasonChange`) – Adds/removes `hibernation` tag based on season.
  - `healthdelta` (`Mutated_OnRecoveryHealthDelta`) – Tracks HP during butt-recovery in mutated variant.
  - `temp8faceddirty` (`Mutated_OnTemp8Faced`) – Syncs 8-faced state for FX in multiplayer.

- **Pushes:**
  - `beargerkilled` – Fired upon Bearger death.
  - `beargerremoved` – Fired on Bearger removal from world.
  - `triggeredevent` (`name = "gestaltmutant"`) – Informs client of mutation event music.
