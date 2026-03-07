---
id: stalker
title: Stalker
description: Manages the lifecycle, combat behavior, and unique abilities of the Stalker boss entity across three distinct environments (cave, forest, and atrium).
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4a30ec1b
system_scope: entity
---

# Stalker

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `stalker` prefab defines the behavior and functionality of the Stalker boss entity, supporting three variants: cave, forest, and atrium. It coordinates core combat systems—including target tracking, ability cooldowns, and summoning mechanics—with environment-specific logic such as bloom generation, music triggers, and Atrium-specific health management. It relies heavily on the `combat`, `grouptargeter`, `timer`, `commander`, and `health` components to manage boss phases, ability usage, minions, and channelers.

## Usage example
```lua
-- Create a cave Stalker instance
local stalker = SpawnPrefab("stalker")
stalker.Transform:SetPosition(x, y, z)

-- Start blooming (forest variant only)
if stalker.foreststalker then
    stalker.components.stalker.StartBlooming()
end

-- Trigger mind control ability (atrium variant)
if stalker.atriumstalker then
    stalker.MindControl(stalker)
end

-- Check if the Stalker is shielded (atrium)
if stalker._hasshield:value() then
    print("Stalker is shielded")
end
```

## Dependencies & tags
**Components used:**  
`combat`, `grouptargeter`, `timer`, `health`, `healthtrigger`, `locomotor`, `lootdropper`, `sanityaura`, `inspectable`, `drownable`, `explosiveresist`, `epicscare`, `talker`, `focalpoint`, `entitytracker`, `commander`, `charliecutscene`

**Tags added:**  
-通用: `epic`, `monster`, `hostile`, `scarytoprey`, `largecreature`, `stalker`, `fossil`, `shadow_aligned`  
- Atrium-specific: `noepicmusic`  
- Forest-specific: `smallepic`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `atriumstalker` | boolean | `false` | Indicates if the instance is the Atrium variant. |
| `foreststalker` | boolean | `false` | Indicates if the instance is the Forest variant. |
| `canfight` | boolean | `true` | Whether the Stalker can engage in combat (applies only to cave/atrium variants). |
| `engaged` | boolean or nil | `nil` | Tracks whether the Stalker is currently using snare ability. |
| `hasshield` | boolean | `false` | Indicates if the Atrium Stalker currently has a shield (active when channelers exist). |
| `_camerafocus` | net_bool | `nil` | Networked flag for camera focus behavior in Atrium variant. |
| `_music` | net_tinybyte | `1` | Current music level (1=ambient, 2=alert, 3=attack). |
| `_playingmusic` | boolean | `false` | Local client-side flag indicating if music is currently playing. |
| `_blooming` | boolean | `false` | For forest variant: whether bloom generation is active. |
| `recentlycharged` | table | `{}` | Tracks entities recently damaged by the Stalker’s charge. |

## Main functions
### `RetargetFn(inst)`
*   **Description:** Determines the new combat target. Prefers players within aggro range but excludes those near a shadow lure unless forced. Also checks for hostile creatures with valid combat state. Cave Stalker uses a more aggressive retarget strategy.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `{target: Entity?, force: true}` — a target entity or `nil`, always with `force=true`.
*   **Error states:** Returns `nil` when no valid targets are within range.

### `AtriumRetargetFn(inst)`
*   **Description:** Atrium-specific retarget logic. Prioritizes players near the stargate (`GATE_RANGE = 7`) and ignores shadow lures (`ignorelure=true`).
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `{target: Entity?, force: true}` — same signature as `RetargetFn`.
*   **Error states:** Returns `nil` if no targets are near the gate and within range.

### `KeepTargetFn(inst, target)`
*   **Description:** Verifies if the current target should remain the focus. A player loses priority if near a shadow lure and hasn’t attacked recently (ignored for Atrium).
*   **Parameters:**  
    - `inst` (Entity) - the Stalker instance.  
    - `target` (Entity) - the proposed target.  
*   **Returns:** `true` if the target is still valid, `false` otherwise.

### `AtriumKeepTargetFn(inst, target)`
*   **Description:** Atrium-specific target validation. A target is valid only if it is in the Atrium arena (or the Stalker is out of the Atrium).
*   **Parameters:**  
    - `inst` (Entity) - the Stalker instance.  
    - `target` (Entity) - the proposed target.  
*   **Returns:** `true` if the target is in valid range (Atrium), `false` otherwise.

### `OnAttacked(inst, data)`
*   **Description:** Reacts to incoming attacks. Immediately switches aggro to the attacker if the current target is out of attack range or the attacker is a player who hasn’t attacked recently.
*   **Parameters:**  
    - `inst` (Entity) - the Stalker instance.  
    - `data` (table) - event data containing `attacker`.  

### `SpawnSnares(inst, targets)`
*   **Description:** Deploys a snare of fossil spikes around target locations, trying up to three passes with decreasing radii to avoid overlap. Resets snare cooldown upon success.
*   **Parameters:**  
    - `inst` (Entity) - the Stalker instance.  
    - `targets` (table) - list of target entities.  
*   **Returns:** `nil` — ability effect is immediate.
*   **Error states:** Early exit when `SNARE_MAX_TARGETS` is reached or overlap persists.

### `SpawnChannelers(inst)`
*   **Description:** Spawns shadow channelers in a circular pattern around the stargate, adding them as soldiers to the Stalker’s command group. Resets channeler cooldown.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

### `DespawnChannelers(inst)`
*   **Description:** Cancels active spawning, and kills all channelers immediately.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

### `OnSoldiersChanged(inst)`
*   **Description:** Updates the shield state based on soldier count. When channelers drop to zero, `hasshield` is set to `false` and the channeler cooldown timer starts.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

### `SpawnMinions(inst, count)`
*   **Description:** Spawns stalker minions in a ring formation around the stargate. Can be called with a specific count for respawn/rejoin logic.
*   **Parameters:**  
    - `inst` (Entity) - the Stalker instance.  
    - `count` (number?) - number of minions to spawn (`nil` uses default from tuning).  
*   **Returns:** `nil`.

### `EatMinions(inst)`
*   **Description:** Consumes up to three nearby minions, healing the Stalker by `TUNING.STALKER_FEAST_HEALING` per minion.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `number` — the number of minions consumed.

### `SpawnSpikes(inst)`
*   **Description:** Atrium ability that spawns a spiraling set of fossil spikes (`fossilspike2`) with synchronized flame sounds.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

### `MindControl(inst)`
*   **Description:** Atrium ability that applies the `mindcontroller` debuff to sane players within range whose sanity is below threshold.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `number` — count of players affected.

### `AtriumLootFn(lootdropper)`
*   **Description:** Dynamically configures loot table based on whether the Atrium Stalker decayed due to leaving the arena.
*   **Parameters:** `lootdropper` (LootDropper) — the component reference.
*   **Returns:** `nil`.

### `CheckAtriumDecay(inst)`
*   **Description:** Determines if the Stalker died outside the Atrium arena (triggering decay state).
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `boolean` — `true` if decayed, `false` otherwise.

### `StartBlooming(inst)`
*   **Description (forest variant):** Begins periodic bloom generation and trail effects.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

### `StopBlooming(inst)`
*   **Description (forest variant):** Stops bloom and trail effects and cancels related tasks.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

### `OnIsNight(inst, isnight)`
*   **Description (forest variant):** Schedules or cancels decay based on day/night cycle.
*   **Parameters:**  
    - `inst` (Entity) - the Stalker instance.  
    - `isnight` (boolean) - current world night state.  
*   **Returns:** `nil`.

### `OnDecay(inst)`
*   **Description (forest variant):** Initiates death and sets special loot (shadowheart only) if the Stalker decays due to daylight.
*   **Parameters:** `inst` (Entity) - the Stalker instance.
*   **Returns:** `nil`.

## Events & listeners
- **Listens to:**  
  - `ontalk` → triggers ambient talking sounds.  
  - `donetalking` → stops talking sound and cancels talk task.  
  - `attacked` → handles aggro switching and player hit tracking.  
  - `newcombattarget` → engages snare cooldown and Roar (atrium only).  
  - `soldierschanged` → updates shield state (atrium).  
  - `miniondeath` → resets minion cooldown (atrium).  
  - `death` → handles Atrium death logic and tracking attackers (atrium).  
  - `onremove`, `onEntitySleep`, `onEntityWake` → manages timers and blooming state (atrium/forest).  
  - `musicdirty`, `camerafocusdirty` → updates camera/music state on client (atrium).

- **Pushes:**  
  - `roar` — fired when engaging snare (atrium variant).  
  - `healthdelta` — via health component when damage is applied.  
  - `snared` — fired on player hit by snare.  
  - `triggeredevent` — music and event triggers (e.g., `"stalker"` level change).