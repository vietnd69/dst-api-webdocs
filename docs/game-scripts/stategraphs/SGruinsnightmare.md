---
id: SGruinsnightmare
title: Sgruinsnightmare
description: Manages the state transitions, animations, and behavior logic for the Ruins Nightmare creature, including movement, attack phases, invisibility cycles, and despawn mechanics.
tags: [ai, combat, boss, physics, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f6749325
system_scope: ai
---

# Sgruinsnightmare

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGruinsnightmare` is a stategraph that defines the full behavioral lifecycle of the Ruins Nightmare entity—a boss-like creature in DST's Ruins. It orchestrates state transitions between idle, movement, attack, hit, horn_attack, taunt, appearance, disappearance, and death states. It integrates with the `combat`, `health`, `locomotor`, and `lootdropper` components to manage targeting, motion, combat actions, and loot generation. Specialized logic handles temporary invisibility, teleportation on hit, mirror-reflected attacks, and a multi-frame dash attack with directional tracking (`was_moving` and `dash` flags).

## Usage example
```lua
-- The stategraph is instantiated automatically by the engine for the Ruins Nightmare prefab.
-- No direct instantiation by mods; instead, modify behavior via:
TheWorld.StateGraph:GetState("attack").onenter = function(inst, target)
    -- Custom pre-attack logic
    inst.components.combat:DoAttack(target)
    -- ...your additions...
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `planarentity`
**Tags:** Adds `"NOCLICK"` during death/disappear states; checks `"idle"`, `"canrotate"`, `"attack"`, `"busy"`, `"hit"`, `"invisible"`, `"noattack"`, `"moving"`, `"dead"` via `HasAnyStateTag`, `HasStateTag`, or internal tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.sg.statemem.was_moving` | boolean | `nil` | Tracks whether the creature was moving before entering the current state (used in `attack` for animation/dash selection). |
| `inst.sg.statemem.target` | entity | `nil` | Stores the current attack target during `attack` and `horn_attack` states. |
| `inst.sg.statemem.dash` | boolean | `nil` | Set to `true` if `planarentity` component exists (enables dash logic in `attack`). |
| `inst.sg.statemem.attackreflected` | boolean | `nil` | Set by `OnAttackReflected` when attack is reflected during `attack`. |
| `inst.sg.statemem.readytoremove` | boolean | `nil` | Indicates when sound cache is empty and entity can be safely removed (used in death/disappear). |
| `inst.sg.mem.soundcache` | table | `{}` | Stores active sound IDs; used to defer entity removal until all extended sounds finish. |
| `inst.sg.mem.soundid` | number | `0` | Incrementing counter for generating unique sound identifiers. |

## Main functions
### `OnAttackReflected(inst)`
* **Description:** Called when the creature’s attack is reflected (e.g., by a mirror shield). Marks that the attack was reflected and triggers a `hit` state transition after the frame event.
* **Parameters:** `inst` (entity) — the Ruins Nightmare instance.
* **Returns:** Nothing.
* **Error states:** None.

### `FinishExtendedSound(inst, soundid)`
* **Description:** Removes a sound ID from the `soundcache` and kills the associated sound; if the cache becomes empty and `readytoremove` is true, triggers `inst:Remove()`.
* **Parameters:** 
  * `inst` (entity)
  * `soundid` (number) — the ID of the sound to finish.
* **Returns:** Nothing.
* **Error states:** None.

### `PlayExtendedSound(inst, soundname)`
* **Description:** Plays a non-looping ambient sound (e.g., `attack_grunt`, `die`) and registers a delayed task (`5` seconds) to remove it from the sound cache.
* **Parameters:** `inst` (entity), `soundname` (string) — path segment for sound (e.g., `"attack"`).
* **Returns:** Nothing.
* **Error states:** Initializes `inst.sg.mem.soundcache` and `inst.sg.mem.soundid` on first call.

### `OnAnimOverRemoveAfterSounds(inst)`
* **Description:** Called when an animation ends. If no extended sounds remain in the cache, removes the entity; otherwise hides it and sets `readytoremove` to wait for sounds.
* **Parameters:** `inst` (entity)
* **Returns:** Nothing.
* **Error states:** Requires `inst.sg.mem.soundcache` to exist.

### `TryDropTarget(inst)`
* **Description:** Checks whether the creature should drop its current combat target. If `ShouldKeepTarget` returns false for the target, calls `combat:DropTarget()` and returns `true`.
* **Parameters:** `inst` (entity)
* **Returns:** `true` if target was dropped; `nil` otherwise.

### `TryDespawn(inst)`
* **Description:** Checks if the creature should transition to `"disappear"` due to forced or voluntary despawn. If conditions match, calls `GoToState("disappear")`.
* **Parameters:** `inst` (entity)
* **Returns:** `true` if despawn state was entered; `nil` otherwise.

### `TryReappearingTeleport(inst)`
* **Description:** Attempts up to 12 random positions within a 15-radius ring to teleport the creature (used when reappearing after `"hit"` or `"horn_attack"`).
* **Parameters:** `inst` (entity)
* **Returns:** Nothing.
* **Error states:** Only teleports if `TheWorld.Map:IsPassableAtPoint` returns `true`; otherwise, no movement occurs.

### `SpawnDoubleHornAttack(inst, target)`
* **Description:** Spawns two `ruinsnightmare_horn_attack` prefabs and initializes them with the creature and target.
* **Parameters:** `inst` (entity), `target` (entity or `nil`)
* **Returns:** Nothing.
* **Error states:** Does not check `target:IsValid()` here; callers must ensure validity.

### `WasMovingFrameEventWrap(time, fn)`
* **Description:** Returns a `FrameEvent` that executes `fn(inst)` only if `was_moving` was true at state entry.
* **Parameters:** `time` (number), `fn` (function)
* **Returns:** function — a frame event callback.
* **Error states:** None.

### `WasNotMovingAndDashFrameEventWrap(time, fn)`
* **Description:** Returns a `FrameEvent` that executes `fn(inst)` only if `was_moving` was false and `dash` was true.
* **Parameters:** `time` (number), `fn` (function)
* **Returns:** function — a frame event callback.
* **Error states:** None.

### `SetEightFaced(inst)` and `SetFourFaced(inst)`
* **Description:** Utility functions to switch between 8-directional and 4-directional facing modes via `Transform:SetEightFaced()` / `SetFourFaced()`.
* **Parameters:** `inst` (entity)
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `"attacked"` — triggers `"horn_attack"` or `"hit"` depending on chance; blocks attack if `busy`, `hit`, `noattack`, or dead.
  - `"doattack"` — enters `"attack"` if not `busy` or dead; passes target.
  - `"reappear"` — shows and enters `"appear"` if invisible and alive.
  - `"animover"` — various handlers for idle, remove-after-sounds, etc.
  - `"attacked"` — again inside `attack` state to detect reflected attacks.
- **Pushes:** None directly (uses standard stategraph transitions and component events).