---
id: toadstool
title: Toadstool
description: Manages the Toadstool boss entity, including its phase progression, ability usage (Spore Bomb, Mushroom Bomb, Mushroom Sprouts, and Ground Pound), movement, and loot behavior.
tags: [combat, ai, boss, phase]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f202fc1a
system_scope: combat
---

# Toadstool

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `toadstool` prefab implements the Toadstool boss, a large cave-dwelling entity with multiple combat phases and ability cycles. It uses components such as `combat`, `healthtrigger`, `groundpounder`, `timer`, `grouptargeter`, and `sleeper` to manage behavior. Phase transitions occur at specific health percentages, and the entity dynamically updates its stats (speed, damage, attack period, ability cooldowns) based on current level and phase. It also tracks linked Mushroom Sprouts to determine its upgrade level and tracks recent attackers and engaged players.

## Usage example
```lua
-- Create a standard Toadstool
local toadstool = SpawnPrefab("toadstool")
if toadstool ~= nil and TheWorld.ismastersim then
    toadstool.Transform:SetPosition(x, y, z)
    toadstool.components.health:SetMaxHealth(100) -- Example
end

-- Create a Dark Toadstool
local dark_toadstool = SpawnPrefab("toadstool_dark")
if dark_toadstool ~= nil and TheWorld.ismastersim then
    dark_toadstool.Transform:SetPosition(x, y, z)
    dark_toadstool.components.health:SetMaxHealth(120) -- Example
end
```

## Dependencies & tags
**Components used:**  
`inspectable`, `lootdropper`, `sleeper`, `locomotor`, `drownable`, `health`, `healthtrigger`, `combat`, `explosiveresist`, `sanityaura`, `epicscare`, `timer`, `grouptargeter`, `groundpounder`, `knownlocations`, `freezable`

**Tags added:** `epic`, `noepicmusic`, `monster`, `toadstool`, `hostile`, `scarytoprey`, `largecreature`, `cavedweller`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `dark` | boolean | `false` | Whether this is the Dark Toadstool variant. |
| `phase` | number | `1` | Current combat phase (1–4 for dark, 1–3 for normal). |
| `level` | number | `0` | Upgrade level (0–3) based on number of linked Mushroom Sprouts. |
| `_numlinks` | number | `0` | Count of active Mushroom Sprout links. |
| `_links` | table | `{}` | Map of linked sprout entities to removal callbacks. |
| `_recentattackers` | table | `{}` | Map of recent players who attacked, used for cooldown cleanup. |
| `engaged` | boolean | `false` | Whether the Toadstool has been engaged by a player. |
| `sporebomb_targets` | number | `TUNING.TOADSTOOL_SPOREBOMB_TARGETS_PHASE[1]` | Max number of targets for Spore Bomb ability. |
| `sporebomb_cd` | number | `TUNING.TOADSTOOL_SPOREBOMB_CD_PHASE[1]` | Current cooldown for Spore Bomb. |
| `mushroombomb_count` | number | `TUNING.TOADSTOOL_MUSHROOMBOMB_COUNT_PHASE[1]` | Number of Mushroom Bombs spawned per cycle. |
| `mushroombomb_variance` | number | `TUNING.TOADSTOOL_MUSHROOMBOMB_VAR_LVL[0]` | Random variance added to bomb count per cycle. |
| `mushroombomb_maxchain` | number | `TUNING.TOADSTOOL_MUSHROOMBOMB_CHAIN_LVL[0]` | Not directly used in this file. |
| `mushroombomb_cd` | number | `TUNING.TOADSTOOL_MUSHROOMBOMB_CD` | Cooldown between Mushroom Bomb cycles. |
| `mushroomsprout_cd` | number | `TUNING.TOADSTOOL_MUSHROOMSPROUT_CD` | Cooldown between Mushroom Sprout spawns. |
| `pound_cd` | number | `TUNING.TOADSTOOL_POUND_CD` | Cooldown between Ground Pound abilities. |
| `pound_speed` | number | `0` | Current speed of the Ground Pound animation. |
| `pound_rnd` | boolean | `false` | Whether to apply randomized Ground Pound speed. |
| `hit_recovery` | number | `TUNING.TOADSTOOL_HIT_RECOVERY_LVL[0]` | Duration of hit stun. |
| `_fade` | client/net variable | `0` | Tracks fade-in/fade-out progress for lighting. |
| `_playingmusic` | boolean | `false` | Whether current player is in range to trigger boss music. |
| `mushroombomb_prefab` | string | `"mushroombomb_projectile"` | Projectile prefab used for Mushroom Bomb. |
| `mushroomsprout_prefab` | string | `"mushroomsprout"` | Prefab used to spawn Mushroom Sprouts. |
| `_sleeptask` | task | `nil` | Cleanup task when entity sleeps. |
| `_fadetask` | periodic task | `nil` | Animation task for fading lighting. |

## Main functions
### `FindSporeBombTargets(inst, preferredtargets)`
*   **Description:** Finds up to `sporebomb_targets` valid targets within range that can be debuffed. Prefers `preferredtargets` if provided, otherwise finds nearby players and entities with required tags. Skips dead, ghost, and already-debuffed entities.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `preferredtargets` (table or `nil`) — optional list of preferred targets to check first.
*   **Returns:** `targets` (table) — list of up to `sporebomb_targets` valid target entities.

### `DoSporeBomb(inst, targets)`
*   **Description:** Applies the `sporebomb` debuff to all valid targets returned by `FindSporeBombTargets`, ensuring only non-dead and debuffable players are affected.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `targets` (table or `nil`) — optional list of preferred targets to target first.
*   **Returns:** Nothing.

### `FindMushroomBombTargets(inst)`
*   **Description:** Calculates spawn positions for Mushroom Bomb projectiles in a ring around the Toadstool with randomized angles and distance. Adjusts max range dynamically if the Toadstool is mobbed by NPCs. Avoids hole terrain.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** `targets` (table) — list of world positions (tables `{x, y, z}`) for bomb spawns.

### `SpawnMushroomBombProjectile(inst, targets)`
*   **Description:** Spawns and launches a Mushroom Bomb projectile toward a target position. Uses easing to scale launch speed with distance. Recursively spawns additional projectiles for multiple bombs.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `targets` (table) — list of remaining target positions to launch projectiles toward.
*   **Returns:** Nothing.

### `DoMushroomBomb(inst)`
*   **Description:** Triggers a Mushroom Bomb sequence by finding target positions and launching projectiles after a short delay.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `FindMushroomSproutAngles(inst)`
*   **Description:** Generates evenly spaced angular offsets in a circle for Mushroom Sprout spawns, with randomized rotation.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** `angles` (table) — list of angle values in radians.

### `DoMushroomSprout(inst, angles)`
*   **Description:** Attempts to spawn a Mushroom Sprout at a valid location within the Toadstool’s radius. Destroys blocking workables (e.g., skeletons, diggables), picks and tosses flowers, and handles physics collisions on spawn. Limits attempts to 12 retries.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `angles` (table or `nil`) — list of remaining angle offsets to try. If empty, no sprout is spawned.
*   **Returns:** Nothing.

### `UpdateLevel(inst)`
*   **Description:** Calculates and updates the Toadstool’s upgrade level (0–3) based on linked Mushroom Sprouts (`_numlinks`). Adjusts walk speed, health absorption, damage, attack period, hit recovery, and Mushroom Bomb variance accordingly. Updates animation symbol if `level >= 1`.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `UpdatePlayerTargets(inst)`
*   **Description:** Syncs the `grouptargeter`’s target list with players near the spawnpoint location. Removes players outside aggro range and adds those newly in range.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Core retargeting logic called periodically. First updates player targets via `UpdatePlayerTargets`, then attempts to select a new target from valid players or creatures, preferring closer entities. Enforces deaggro distance from spawnpoint.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** `target` (Entity) and `force_switch` (boolean) — if a new target is selected, returns the target and `true`; otherwise returns nothing.

### `KeepTargetFn(inst, target)`
*   **Description:** Determines whether the current target remains valid. Requires target to be targetable by combat and within deaggro distance of the spawnpoint.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `target` (Entity) — the entity to validate.
*   **Returns:** `true` if the target remains valid, `false` otherwise.

### `OnNewTarget(inst, data)`
*   **Description:** Called when a new combat target is selected. Marks `engaged = true` and starts ability cooldown timers for Spore Bomb, Mushroom Bomb, Mushroom Sprout, and Ground Pound.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `data` (table) — event data containing `target`.
*   **Returns:** Nothing.

### `OnNewState(inst)`
*   **Description:** Pauses/resumes the Mushroom Sprout cooldown timer based on state tags (`sleeping`, `frozen`, `thawing`).
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `ClearRecentAttacker(inst, attacker)`
*   **Description:** Removes the cooldown cleanup task for a given attacker and clears the attacker from `_recentattackers`.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `attacker` (Entity) — the attacker to clear.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Registers a recent attacker if they are a player, scheduling a cleanup task to remove them from `_recentattackers` after 120 seconds.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `data` (table) — event data containing `attacker`.
*   **Returns:** Nothing.

### `AnnounceWarning(inst, player)`
*   **Description:** Checks if a player is valid, visible, alive, not a ghost, and not in a no-attack state, then broadcasts a warning string via the `talker` component.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `player` (Entity) — the player to announce to.
*   **Returns:** Nothing.

### `OnFleeWarning(inst)`
*   **Description:** Called during flee warning state. Announces Toadstool’s impending escape to all players in range who have recently attacked.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `OnEscaped(inst)`
*   **Description:** Called when Toadstool flees. Announces escape to nearby players and removes the Toadstool entity.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Schedules removal of the Toadstool after 10 seconds of sleep if not already dead.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Cancels the removal task scheduled during sleep.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `SetPhaseLevel(inst, phase)`
*   **Description:** Configures phase-specific behavior (e.g., Spore Bomb target count, ability cooldowns, Ground Pound timer state). Ensures phases are capped at `3` for normal and `4` for dark Toadstool.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `phase` (number) — desired phase (1–4).
*   **Returns:** Nothing.

### `EnterPhase2Trigger(inst)`
*   **Description:** Transitions to Phase 2 if `phase < 2`. Drops Shroom Skin loot if health is above Phase 3 threshold and triggers the `roar` event.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `EnterPhase3Trigger(inst)`
*   **Description:** Transitions to Phase 3 if `phase < 3`. Drops Shroom Skin loot if alive and triggers the `roar` event.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `EnterPhase3TriggerDark(inst)`
*   **Description:** Dark variant of `EnterPhase3Trigger`. Transitions to Phase 3 and drops Shroom Skin if above Phase 4 health threshold.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `EnterPhase4TriggerDark(inst)`
*   **Description:** Transitions to Phase 4 (Dark Toadstool only) if `phase < 4`. Drops Shroom Skin loot if alive and triggers `roar`.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves phase, engaged state, and Ground Pound speed to save data.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `data` (table) — table to populate with save data.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores phase and related settings from save data. If no save data is present, calculates phase from current health percentage and whether the entity is dark.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `data` (table or `nil`) — saved data or `nil`.
*   **Returns:** Nothing.

### `DestroyOther(inst, other)`
*   **Description:** Destroys a workable entity (e.g., trees, boulders) with collision damage, bypassing NETs. Drops collapse FX and clears loot for trees/boulders. Prevents double-destruction via `recentlycharged` cooldown.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `other` (Entity) — the entity to destroy.
*   **Returns:** Nothing.

### `OnCollide(inst, other)`
*   **Description:** Collision callback for destroying workables. Delays destruction by `2*FRAMES` to allow collision resolution.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.  
    `other` (Entity) — the entity collided with.
*   **Returns:** Nothing.

### `PushMusic(inst)`
*   **Description:** Periodic task to trigger boss music when a player is within range. Uses global `ThePlayer` to avoid dedicated server conflicts.
*   **Parameters:**  
    `inst` (Entity) — the Toadstool instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `linkmushroomsprout` — triggers `OnLinkMushroomSprout`.  
  - `unlinkmushroomsprout` — triggers `OnUnlinkMushroomSprout`.  
  - `newcombattarget` — triggers `OnNewTarget`.  
  - `newstate` — triggers `OnNewState`.  
  - `attacked` — triggers `OnAttacked`.  
  - `fleewarning` — triggers `OnFleeWarning`.  
  - `fadedirty` (client-only) — triggers `OnFadeDirty`.  

- **Pushes:**  
  - `picked` — via `pickable` component (e.g., on sprout collision).  
  - `toadstoollevel` — after `UpdateLevel` changes the level.  
  - `roar` — during phase transitions.  
  - `triggeredevent` (client) — with `name = "toadstool"` to start boss music.  
  - `collapsesoil` — on sprout spawn when destroying dirt/soil entities.