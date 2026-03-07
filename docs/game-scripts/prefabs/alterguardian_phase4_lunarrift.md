---
id: alterguardian_phase4_lunarrift
title: Alterguardian Phase4 Lunarrift
description: Manages the behavior, state transitions, combat mechanics, and environment interactions of the Phase 4 Lunar Rift boss in DST's Wagstaff finale.
tags: [combat, ai, boss, sanity, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 20985d2d
system_scope: entity
---

# Alterguardian Phase4 Lunarrift

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardian_phase4_lunarrift` prefab implements the final boss stage of the Wagstaff finale, a large, non-persistent entity that controls combat behavior, domain-based sanity effects, threat-based attack pacing, and environmental transitions (e.g., spawn vs.战斗 form). It coordinates multiple systems including health-triggered phase changes, group targeting with aggro distance scaling, sanity aura, camera focus, and music/mix management. The entity is non-persistent in the game world and relies on a custom state graph (`SGalterguardian_phase4_lunarrift`) and brain (`alterguardian_phase4_lunarriftbrain`) for animation and behavior sequencing.

## Usage example
```lua
-- This prefab is instantiated internally by the game and should not be manually created.
-- Modders may extend or override components attached during construction:
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("sanityaura")
-- ... other components as defined in the source
```

## Dependencies & tags
**Components used:** `colouraddersync`, `rainimmunity`, `health`, `combat`, `healthtrigger`, `planarentity`, `planardamage`, `explosiveresist`, `epicscare`, `dpstracker`, `timer`, `grouptargeter`, `sanityaura`, `locomotor`, `colouradder`, `lootdropper`, `teleportedoverride`, `inspectable`, `updatelooper`.

**Tags:** Adds `brightmareboss`, `epic`, `hostile`, `largecreature`, `monster`, `noepicmusic`, `scarytoprey`, `soulless`, `lunar_aligned`, `rainimmunity`. Checks `supernova`, `playerghost`, `dehydrated`, `hiding` via state graph or sanity component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `showdashfx` | `net_bool` | `false` | Controls visibility of the dash wave FX overlay (client-side). |
| `facings` | `net_tinybyte` | `0` | Controls animation facing mode (`0`=FourFaced, `1`=EightFaced, `2`=NoFaced, `3`=SixFaced). |
| `music` | `net_tinybyte` | `0` | Sets music level (values `0–7`) synced to clients. |
| `camerafocus` | `net_bool` | `false` | Enables/disables camera focus on this entity. |
| `threatlevel` | number | `1` | Current threat level (calculated from DPS), affects `combat` attack period. |
| `dashcount`, `dashcombo`, `slamcount`, `slamcombo` | number | varies | State variables tracking attack combo progression per phase. |
| `engaged` | boolean | `false` | Whether the boss is currently in combat (not idle/deaggroed). |
| `aggrodist` | number | varies | Current aggro radius in distance squared units. |

## Main functions
### `StartDashFx(inst)`
*   **Description:** Enables and spawns the dash FX overlay if not already active.
*   **Parameters:** `inst` (Entity) – the boss instance.
*   **Returns:** Nothing.

### `StopDashFx(inst)`
*   **Description:** Disables and removes the dash FX overlay if currently active.
*   **Parameters:** `inst` (Entity) – the boss instance.
*   **Returns:** Nothing.

### `StartDomainExpansion(inst)`
*   **Description:** Begins a periodic task (`0.5` seconds) that updates which players are in the boss’s lunar domain and enables/disables lunacy accordingly via `sanity:EnableLunacy`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StopDomainExpansion(inst, istempstop)`
*   **Description:** Cancels the domain expansion task and removes lunacy for all tracked players. If `istempstop` is `true`, player tracking is retained for later resumption.
*   **Parameters:** `inst` (Entity), `istempstop` (boolean).
*   **Returns:** Nothing.

### `SwitchToEightFaced(inst)`
*   **Description:** Forces the entity to use eight-faced animation mode and updates follow FX accordingly.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `SwitchToFourFaced(inst)`
*   **Description:** Forces four-faced animation mode; only changes state if current is not already four-faced (`0`) or six-faced (`3`).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `IsSlamNext(inst)`
*   **Description:** Returns `true` if the next attack in the current combo sequence is a slam (after a set number of dashes).
*   **Parameters:** `inst` (Entity).
*   **Returns:** boolean.

### `SetMusicLevel(inst, level, forced)`
*   **Description:** Sets the boss’s music level (`0–7`). If `forced` is `true`, forces a dirty update even if the value hasn’t changed. Triggers local client music event updates.
*   **Parameters:** `inst` (Entity), `level` (number), `forced` (boolean).
*   **Returns:** Nothing.

### `EnableCameraFocus(inst, enable)`
*   **Description:** Enables or disables camera focus tracking for this entity using `focalpoint` component.
*   **Parameters:** `inst` (Entity), `enable` (boolean).
*   **Returns:** Nothing.

### `ResetCombo(inst)`
*   **Description:** Resets `dashcount` and `slamcount` to `0` for the current combo cycles.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `SetEngaged(inst, engaged, delay)`
*   **Description:** Updates the `engaged` state, resets combos when entering combat, resets health to full and resets phase when disengaging, and schedules deferred state changes if `delay` is provided.
*   **Parameters:** `inst` (Entity), `engaged` (boolean), `delay` (number, optional).
*   **Returns:** Nothing.

### `SetThreatLevel(inst, level)`
*   **Description:** Sets the boss’s threat level, which directly modifies the `combat` component’s `attack_period` via `TUNING.ALTERGUARDIAN_PHASE4_LUNARRIFT_ATTACK_PERIOD`. A de-escalation task cancels the level over `DEESCALATE_TIME` seconds if a higher level is set.
*   **Parameters:** `inst` (Entity), `level` (number).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` – updates combat target if the attacker is valid and within range.  
- **Listens to:** `newcombattarget` – calls `SetEngaged(inst, true)` when a new target is acquired.  
- **Listens to:** `droppedtarget` – schedules a 10-second delay before disengaging.  
- **Listens to (client):** `facingsdirty`, `showdashfxdirty`, `musicdirty`, `camerafocusdirty` – local FX and UI updates.  
- **Listens to (master):** `animover` – removes FX entities after animations complete.  
- **Pushes:** `resetboss` – fired when disengaged and combat state resets.  
- **Pushes (client):** `triggeredevent` – music event (`{ name = "wagboss", level = level }`) during domain proximity.  
- **Pushes (master):** `ms_wagboss_alter_defeated` – triggered on removal if defeated in arena.