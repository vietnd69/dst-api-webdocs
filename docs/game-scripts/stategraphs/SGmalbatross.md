---
id: SGmalbatross
title: Sgmalbatross
description: State graph for the Malbatross boss, managing its flight, combat, swimming, and death behaviors via state transitions and event-driven logic.
tags: [combat, ai, boss, locomotion, physics]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: cdd9a51b
system_scope: ai
---

# Sgmalbatross

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGmalbatross` state graph defines the behavior and transitions for the Malbatross boss entity. It orchestrates a wide range of actions including idle hovering, swooping attacks, diving for fish, water-based combat (wavesplash), taunting, departure, and death states on land or ocean. The state graph integrates closely with components like `combat`, `locomotor`, `health`, `freezable`, `sleeper`, and `boatphysics`, and uses common state helpers (`CommonHandlers`, `CommonStates`) to handle freezing, electrocution, sleep, and corpse transitions. Event handlers respond to game events (e.g., `"doswoop"`, `"death"`) to trigger state changes conditionally based on entity state and environment (e.g., whether Malbatross is on ocean or land).

## Usage example
The state graph is automatically assigned to the Malbatross prefab (via `StateGraph("malbatross", ...)` at the end of the file) and does not need to be instantiated manually. A typical modder would listen for events it pushes or customize behavior by overriding state handlers (e.g., `"swoop_loop"` collision or `"attack"` timing).

```lua
-- Example: Listen for Malbatross’s attack event in a mod
inst:ListenForEvent("doattack", function(inst, data)
    -- Trigger swoop only if not busy
    if not inst.sg:HasStateTag("busy") then
        inst.sg:GoToState("swoop_pre", data.target)
    end
end)
```

## Dependencies & tags
**Components used:** `boatphysics`, `childspawner`, `combat`, `entitytracker`, `freezable`, `health`, `hullhealth`, `knownlocations`, `locomotor`, `sleeper`, `timer`, `health`  
**Tags:** Adds `"scarytooceanprey"`, `"flying"`; checks `"INLIMBO"`, `"fx"`, `"malbatross"`, `"boat"`, `"boatbumper"`, `"tree"`, `"mast"`, `"_health"`; modifies `"busy"`, `"idle"`, `"noattack"`, `"nosleep"`, `"canrotate"`, `"swoop"`, `"flight"`, `"noelectrocute"`, `"alert"` via `sg:HasStateTag`, `sg:AddStateTag`, `sg:RemoveStateTag`.

## Properties
No public properties are defined in the constructor. The component relies on local constants (`SWOOP_LOOP_TARGET_CANT_TAGS`, `SHAKE_DIST`, `ATTACK_WAVE_SPEED`, `ANGLE_OFFSET`, etc.) and runtime state stored in `inst.sg.statemem` (e.g., `target`, `stopsteering`, `collisiontime`) and `inst.sg.mem` (e.g., `ate_all_the_fish`).

## Main functions
### `SpawnMalbatrossAttackWaves(inst)`
*   **Description:** Spawns two or three attack waves (or a platform push + splash if platform is present) centered on the Malbatross position. Used in `"wavesplash"` and `"attack"` states.
*   **Parameters:** `inst` (Entity) — the Malbatross instance.
*   **Returns:** Nothing.
*   **Error states:** If platform is not present and point is water, it spawns `splash_green` or `splash_green_large` via `spawnsplash`, then calls `SpawnAttackWave` for 1–3 offset vectors.

### `ShouldUseLandState(inst)`
*   **Description:** Determines whether Malbatross should use land-based states (e.g., `"death"` vs `"death_ocean"`).
*   **Parameters:** `inst` (Entity) — the Malbatross instance.
*   **Returns:** Boolean — `true` if on visual ground, on a platform, or not on ocean; otherwise `false`.

### `Spawnripple(inst)`
*   **Description:** Plays a ripple sound and spawns `"boss_ripple_fx"` at current position if not on visual ground.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `spawnsplash(inst, size, pos)`
*   **Description:** Spawns `"splash_green"` or `"splash_green_large"` at given or current position if on water (not on visual ground or platform).
*   **Parameters:**  
  `inst` (Entity) — the Malbatross instance.  
  `size` (string, optional) — `"med"` or anything else (defaults to `"large"`).  
  `pos` (Vector3, optional) — custom position; defaults to current position.
*   **Returns:** Nothing.

### `spawnwave(inst, time)`
*   **Description:** Calls `inst.spawnwaves` to generate a circular wave pattern.
*   **Parameters:**  
  `inst` (Entity).  
  `time` (number, optional) — passed as time argument.
*   **Returns:** Nothing.

### `swoop_over_shoal(inst)`
*   **Description:** If `"feedingshoal"` tracker entity exists, goes to `"swoop_pre"` toward it; otherwise goes to `"idle"`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `"depart"`, `"dosplash"`, `"doswoop"`, `"death"`, `"doattack"`, `"animover"`, `CommonHandlers` events (`OnLocomote`, `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnCorpseChomped`, `OnCorpseDeathAnimOver`)  
- **Pushes:** None explicitly in this file (events are handled, not fired by SG itself; however, it relies on `inst:PushEvent` calls within state `onenter`/`ontimeline` callbacks, such as `"healthdelta"` from `health:DoDelta`, and `entity:PushEvent("locomote")` from `locomotor:Stop`).

