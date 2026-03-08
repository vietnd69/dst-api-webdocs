---
id: SGwarg
title: Sgwarg
description: Manages the state graph for the Warg entity, handling movement, combat (including flamethrower and stagger states), transformation into/instantly from statues, sleep, freeze, electrocute, and lunar rift mutation transitions.
tags: [warg, combat, stategraph, transformation, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 76cac423
system_scope: entity
---

# Sgwarg

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
SGwarg is a state graph component responsible for orchestrating the complete behavioral lifecycle of the Warg entity. It defines and transitions between states for idle, run, attack (including specialized Flamethrower and Gingerbread warg behaviors), stagger, chomp, howl, sleep, freeze, electrocute, death, and statue transformations. It integrates with common handler states (sleep, freeze, electrocute, death) via CommonHandlers, and supports dynamic visual and physical state changes such as eye flame FX, clay-specific sound variants, and physics-based statue mechanics. The component maintains internal state memory (`inst.sg.mem`) to queue events during busy states and manage transformation states like `statue`.

## Usage example
```lua
local warg = TheSim:FindFirstEntityWithTag("warg")
if warg and warg.warg then
    -- Force warg to howl
    warg:PushEvent("dohowl")
    
    -- Initiate flamethrower attack toward angle 45 degrees
    warg.warg:DoFlamethrowerAOE(45, {})
    
    -- Force stagger (e.g., after lightning strike)
    warg.warg:TryStagger()
    
    -- Transform into statue and back
    warg.warg:MakeStatue()
    warg.warg:MakeReanimated()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:**  
- `idle`  
- `hit`  
- `busy`  
- `invisible`  
- `noattack`  
- `temp_invincible`  
- `noelectrocute`  
- `staggered`  
- `nosleep`  
- `caninterrupt`  
- `chewing`  
- `howling`  
- `intro_state`  
- `statue`  
- `dead`  
- `attack`  
- `notarget`  
- `INLIMBO`, `flight`, `invisible`, `playerghost`, `lunar_aligned` (used in `AOE_TARGET_CANT_TAGS`)  
- `_combat` (used in `AOE_TARGET_TAGS`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.sg.mem.statue` | boolean | `false` | Tracks whether the warg is currently in statue form. |
| `inst.sg.mem.dohowl` | any | `nil` | Queued `dohowl` event when the warg is busy. |
| `inst._eyeflames` | any | `nil` | Reference to the eye flame FX controller. |
| `inst.build` | string | — | Warg type variant (e.g., "clay", "flamethrower", "gingerbread"). |
| `instAnimState` | AnimState | — | Controls visual overrides (e.g., mutation transitions). |
| `SoundEmitter` | SoundEmitter | — | Used for playing warg-specific sounds. |

## Main functions
### `ChooseAttack(inst, target)`
* **Description:** Determines and executes the appropriate attack state based on warg type and conditions. Checks for flamethrower availability, gingerbread warg goo ability, and defaults to standard attack.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `target`: Optional target entity (defaults to combat component’s current target).  
* **Returns:** `true` (always).  

### `TryStagger(inst)`
* **Description:** Forces the warg into the stagger state (`stagger_pre`).  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `true` (always).  

### `TryHowl(inst)`
* **Description:** Forces the warg into the howl state (`howl`).  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `true` (always).  

### `SpawnCloseEmberFX(inst, angle)`
* **Description:** Spawns or recycles a close-range ember effect at a specified angle relative to the warg’s facing. Checks passability before spawning; positions randomly near the calculated point.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `angle`: Rotation offset (degrees) from warg’s facing direction.  
* **Returns:** `nil`.  

### `SpawnBreathFX(inst, angle, dist, targets)`
* **Description:** Spawns or recycles flamethrower breath effect at a given angle and distance, scaling FX based on distance and applying target data.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `angle`: Angle offset (degrees).  
  - `dist`: Distance from warg center.  
  - `targets`: Table to accumulate hit targets.  
* **Returns:** `nil`.  

### `DoFlamethrowerAOE(inst, angle, targets)`
* **Description:** Performs area-of-effect flamethrower logic: finds valid entities within a cone/sector, applies damage and temperature reduction (cold fire effect). Handles multi-hit mitigation via tick-based cooldown. Respects `ignorehitrange` and `ignoredamagereflect` flags temporarily. Skips invalid, dead, or in-limbo entities.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `angle`: Center direction of AOE (degrees).  
  - `targets`: Table tracking per-entity hit data (especially tick + hit_tick).  
* **Returns:** `nil`.  

### `ShowEyeFX(inst)`
* **Description:** Sets eye flame FX visibility to on via `<inst._eyeflames>:set(true)>`.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.  

### `HideEyeFX(inst)`
* **Description:** Sets eye flame FX visibility to off via `<inst._eyeflames>:set(false)>`.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.  

### `PlayClayShakeSound(inst)`
* **Description:** Plays clay warg-specific stone-shake sound.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.  

### `PlayClayFootstep(inst)`
* **Description:** Plays clay warg-specific footstep sound.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.  

### `MakeStatue(inst)`
* **Description:** Transforms the warg into an immovable statue: stops physics, changes physics collider, adds `notarget` tag, makes invincible, snaps rotation, and calls `OnBecameStatue`. Idempotent. Only acts if `inst.sg.mem.statue` is not already set.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.  

### `MakeReanimated(inst)`
* **Description:** Reverses `MakeStatue`: restores character physics, removes `notarget` tag, makes vulnerable again, and calls `OnReanimated`. Idempotent. Only acts if `inst.sg.mem.statue` is set.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.  

### `mutate_onenter(inst)`
* **Description:** Executed when the mutate state is entered; sets up visual overrides and plays a sound for the mutation transition.  
* **Parameters:**  
  - `inst`: The entity instance entering the mutate state.  
* **Returns:** `nil`.  

## Events & listeners
**Listened events:**
- `attacked`: Triggers stagger or hit state upon taking damage, respecting stun timers and state flags; handles electrocute + stagger interaction for planar damage.
- `doattack`: Invokes `ChooseAttack` if not busy or dead; stores target for pending attack if busy.
- `dohowl`: Calls `TryHowl` if not busy/dead; otherwise queues via `inst.sg.mem.dohowl`.
- `heardwhistle`: Wakes up (and clears target) if sleeping; otherwise interruptible howl restart or target-clearing logic.
- `chomp`: Initiates chomp sequence (`chomp_pre`/`chomp_pre_from_loop`) if target provided and not dead.
- `becomestatue`: Initiates `transformstatue` if not busy/dead.
- `reanimate`: Transitions to `reanimatestatue`.
- `animover`: Various cleanup/exit behaviors (idle re-entry, state transitions).
- `timerdone`: `stagger` timer completion triggers `stagger_pst`.

**Pushed events:** None in this component (all handlers consume events; do not fire new ones).