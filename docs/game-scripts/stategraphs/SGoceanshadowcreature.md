---
id: SGoceanshadowcreature
title: Sgoceanshadowcreature
description: State machine controller for the Ocean Shadow Creature entity, managing movement, teleportation, combat states, and despawning behavior.
tags: [ai, stategraph, combat, teleportation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8624188b
system_scope: ai
---

# Sgoceanshadowcreature

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This StateGraph defines the behavioral state machine for the Ocean Shadow Creature entity — a boss-like entity in DST that patrols oceans and can teleport between platforms (boats) and land. It handles transitions through idle, attack, taunt, teleport (both to/from boats and land), and death states. The state machine integrates closely with the `combat`, `health`, `locomotor`, `lootdropper`, and `walkableplatform` components to coordinate behavior based on game state and entity presence.

## Usage example
This StateGraph is automatically assigned to the Ocean Shadow Creature prefab and does not require manual instantiation by modders. It is referenced internally by the engine as `"oceanshadowcreature"`.

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `walkableplatform`
**Tags:** Adds `NOCLICK` during death/despawn states; checks `busy`, `idle`, `attack`, `teleporting`, `noattack`, `appearing`, `canrotate`.

## Properties
No public properties are defined in this file. State memory is stored in `inst.sg.mem` and `inst.sg.statemem`, but these are internal implementation details.

## Main functions
### `canteleport(inst)`
*   **Description:** Determines whether the creature is currently in a valid state to perform a teleport.
*   **Parameters:** `inst` (Entity) — the creature instance.
*   **Returns:** Boolean — `true` if the instance is not currently attacking, being hit, teleporting, disabled for attacks, or dead.
*   **Error states:** Returns `false` if any of the state tags `attack`, `hit`, `teleporting`, `noattack` are present or if `health:IsDead()` is `true`.

### `canattack(inst)`
*   **Description:** Checks whether the creature can initiate an attack.
*   **Parameters:** `inst` (Entity) — the creature instance.
*   **Returns:** Boolean — `true` if not currently in a `busy` state and not dead.
*   **Error states:** Returns `false` if `busy` state tag is active or `health:IsDead()` is `true`.

### `PlayExtendedSound(inst, soundname)`
*   **Description:** Plays a sound effect and registers it for delayed cleanup after the animation completes. Prevents premature removal of the entity before ambient or post-animation sounds finish.
*   **Parameters:** `inst` (Entity), `soundname` (string) — key into `inst.sounds`.
*   **Returns:** Nothing.
*   **Error states:** May create a new `soundcache` table if none exists. Sound is scheduled for removal via a 5-second delay task.

### `FinishExtendedSound(inst, soundid)`
*   **Description:** Removes a registered sound effect and checks if all sounds have completed to permit entity removal.
*   **Parameters:** `inst` (Entity), `soundid` (number) — identifier used when queuing the sound.
*   **Returns:** Nothing.

### `OnAnimOverRemoveAfterSounds(inst)`
*   **Description:** Conditionally removes the entity after animation ends only if no extended sounds remain.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `SetRippleScale(inst, scale)`
*   **Description:** Adjusts the scale of the visual ripple effect to prevent UI hover interference.
*   **Parameters:** `inst` (Entity), `scale` (number) — target scale; clamped to a minimum of `0.01`.
*   **Returns:** Nothing.

### `TryDropTarget(inst)`
*   **Description:** Checks if the current combat target should be dropped (e.g., due to invalidity or distance), drops it if so, and returns whether the drop occurred.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Boolean — `true` if target was dropped.
*   **Error states:** Only drops target if `ShouldKeepTarget(target)` returns `false`.

### `TryDespawn(inst)`
*   **Description:** Initiates despawn transition if forced or desired and no target is present.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Boolean — `true` if a transition to the `disappear` state was triggered.

## Events & listeners
- **Listens to:**  
  - `boatteleport` — triggers `boatteleport` state.  
  - `death` — triggers `death` state.  
  - `doattack` — triggers `attack` state.  
  - `teleport_to_land` — triggers `teleport_to_land` state.  
  - Standard locomotion events (`OnLocomote`) — configured to pause movement and update state.  
- **Pushes:** None directly — rely on `GoToState` side effects and internal event handlers (e.g., `animover`, `animqueueover`).