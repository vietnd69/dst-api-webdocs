---
id: SGdaywalker2_buried
title: Sgdaywalker2 Buried
description: Defines the state graph for Daywalker 2 when it is buried underground, handling idle waiting, struggle animations, emergence attempts, and electrocution interactions.
tags: [ai, boss, stategraph, electrocution]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 7baf44b7
system_scope: entity
---

# Sgdaywalker2 Buried

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGdaywalker2_buried` is a state graph for the Daywalker 2 boss entity when it is in its buried state. It manages transitions between idle waiting, struggle animations, emergence attempts, and cancellation of emergence. It integrates with the `entitytracker` component to trigger effects on associated junk entities and uses the `talker` component to emit contextual dialogue when near players. The graph also supports electrocution states, which vary based on the buried level (`inst.sg.mem.level`), using shared utilities from `commonstates`.

## Usage example
This state graph is typically assigned to the Daywalker 2 entity during buried transitions by the game's AI system and is not added directly by modders.

```lua
-- Inside a prefab or stategraph handler:
inst.sg = StateGraph("daywalker2_buried", states, events, "idle")
-- The SG is initialized automatically by DST's stategraph system when the entity enters the buried state
```

## Dependencies & tags
**Components used:** `entitytracker`, `talker`
**Tags:** The `tryemerge` state includes the tag `"noelectrocute"` to prevent accidental electrocution during emergence.

## Properties
No public properties are defined or used in this state graph. All state-specific data is stored in `inst.sg.mem` (e.g., `level`, `lasttalk`).

## Main functions
### `GetLevelAnim(inst, anim)`
* **Description:** Appends a suffix to an animation name based on the buried level (`inst.sg.mem.level`). Level 2 uses `_small`, otherwise `_full`.
* **Parameters:**  
  - `inst` (entity instance) – the entity whose animation state is being controlled.  
  - `anim` (string) – base animation name (e.g., `"buried"`).  
* **Returns:** (string) the full animation name with level-specific suffix.

### `PlayAnimation(inst, anim, loop)`
* **Description:** Plays an animation on the main entity and all associated `junkfx` entities. The animation name is resolved using `GetLevelAnim`.
* **Parameters:**  
  - `inst` (entity instance) – the entity playing the animation.  
  - `anim` (string) – base animation name.  
  - `loop` (boolean) – whether the animation should loop.  
* **Returns:** Nothing.

### `PushAnimation(inst, anim, loop)`
* **Description:** Pushes an animation onto the queue for the main entity and all `junkfx` entities, using level-specific suffix resolution.
* **Parameters:**  
  - `inst` (entity instance) – the entity pushing the animation.  
  - `anim` (string) – base animation name.  
  - `loop` (boolean) – whether the animation should loop.  
* **Returns:** Nothing.

### `TryElectrocuteShakeJunk(inst)`
* **Description:** Shakes the associated `junk` entity (retrieved via `entitytracker`) upon electrocution frame events.
* **Parameters:**  
  - `inst` (entity instance) – the buried entity.  
* **Returns:** Nothing.

### `TryElectrocuteShakeJunk2(inst)`
* **Description:** Calls `TryElectrocuteShakeJunk` only if the buried level is 2. Used to conditionally trigger effects in higher-level electrocution states.
* **Parameters:**  
  - `inst` (entity instance) – the buried entity.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` (in `struggle`, `cancelemerge` states) – transitions back to `"idle"` when animation completes.  
  - `OnElectrocute` events (via `CommonStates.AddElectrocuteStates`) – handled in shared electrocution logic, triggers junk shaking based on level.

- **Pushes:**  
  - `"shake"` event to the `junk` entity (via `inst.components.entitytracker:GetEntity("junk")`) during `struggle` timeline (frame 26) and electrocution events.

(None of the above are user-facing event handlers; all are internal state machine transitions or callbacks.)