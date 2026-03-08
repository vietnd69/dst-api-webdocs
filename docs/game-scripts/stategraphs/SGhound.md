---
id: SGhound
title: Sghound
description: Manages the complete state machine for hound-type entities, handling movement, combat, eating, howl-based spawning, transformations (clay/statue), and special states (frozen, electrocuted, moonbase mining).
tags: [ai, combat, animation, transformation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: df3737a3
system_scope: ai
---

# Sghound

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGhound` defines the stategraph for hound-type entities (e.g., regular hounds, moon hounds, clay hounds, mutated hounds). It orchestrates behavior by transitioning between states for idle, movement, attack, eating, howling, sleeping, death, and transformation. It integrates with the ECS by using multiple components—such as `combat`, `health`, `locomotor`, `sleeper`, `sanityaura`, and `freezable`—and reuses common state handlers from `commonstates.lua`. The stategraph also supports special variants (clay, moon, mutated) via conditional state transitions and dynamic behavior hooks.

## Usage example
```lua
-- Standard usage: Attach the hound stategraph to a prefab
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("locomotor")
inst:AddComponent("sleeper")
inst:AddComponent("sanityaura")
inst:AddComponent("amphibiouscreature")

inst.stategraph = StateGraph("hound")
inst.sg = inst.stategraph
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:**  
`health`, `combat`, `locomotor`, `sleeper`, `sanityaura`, `amphibiouscreature`, `freezable`, `follower`, `workable`, `hounded`

**Tags added by states:**  
`idle`, `canrotate`, `attack`, `busy`, `chewing`, `caninterrupt`, `eat`, `hit`, `startled`, `howling`, `sleeping`, `working`, `statue`, `noattack`, `mutated`, `surprise_spawn`

**Tags removed/checked:**  
`notarget`, `swimming`, `clay`, `player`, `mutated_hound`

## Properties
No public properties initialized in the constructor (stategraph is defined as a return value with states/events/actions as closures).

## Main functions
This file returns a fully configured `StateGraph` instance via `StateGraph("hound", states, events, "init", actionhandlers)`; no standalone public functions are exported. The following internal helpers are used across states:

### `SpawnHound(inst)`
*   **Description:** Summons new hounds when the entity howls, using the `hounded` world component. spawned hounds are set to follow this entity via `follower:SetLeader`.
*   **Parameters:** `inst` (Entity) — the hound instance triggering spawn.
*   **Returns:** Nothing.
*   **Error states:** Early return if `TheWorld.components.hounded` is missing or spawn count is exhausted.

### `PlayClayShakeSound(inst)`
*   **Description:** Plays the clay hound’s stone-shake sound effect.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `PlayClayFootstep(inst)`
*   **Description:** Plays the clay hound’s stone-footstep sound.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StartAura(inst)`
*   **Description:** Sets the sanity aura to reduce sanity by `TUNING.SANITYAURA_MED`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StopAura(inst)`
*   **Description:** Clears the sanity aura (value = `0`).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeStatue(inst)`
*   **Description:** Transforms a clay hound into an immobile statue: physics obstacle, invincible, adds `notarget` tag, sets 6-faced transform, stops physics.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeReanimated(inst)`
*   **Description:** Reverts a clay hound from statue back to mobile form: restores character physics, removes `notarget` tag, sets 4-faced transform, removes invincibility.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ShowEyeFX(inst)` / `HideEyeFX(inst)`
*   **Description:** Toggles eye flame visual effect (`inst._eyeflames:set(true/false)`) for clay hound statue states.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `hit` state (unless dead or electrocute)  
  `death` — transitions to `death` or `corpse` state depending on cause  
  `doattack` — initiates attack if not busy/hit-stunned  
  `dohowl` — triggers howl if not dead/busy  
  `startle` — wakes up and enters `startle` state if not frozen/statue  
  `heardwhistle` — exits howl or sets target to null; triggers howl response  
  `chomp` — starts eating (pre/timeline/loop states)  
  `workmoonbase` — begins moonbase mining  
  `becomestatue` — transitions to `transformstatue`  
  `reanimate` — initiates statue-to-hound reanimation  
  `animover`, `animqueueover`, `animdone`, `onwakeup` — generic animation completion hooks  
  `locomote`, `sleep`, `hop`, `freeze`, `electrocute` — via `CommonHandlers`

- **Pushes:**  
  `invincibletoggle` (via `health:SetInvincible`)  
  `leaderchanged` (via `follower:SetLeader` internally)  
  `chomped` (target receives this when chomped successfully)  
  Standard commonstate handlers may push events like `onenterfreezestate`, `onelectrocute`, etc.

(No custom events are directly pushed by `SGhound` beyond those inherited from component hooks and commonstate integrations.)