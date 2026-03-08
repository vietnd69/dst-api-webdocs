---
id: SGcritter_common
title: Sgcritter Common
description: Provides reusable stategraph states and event handlers for critter AI, including idle behavior, eating, emotes, walking, and combat/playful interactions.
tags: [ai, stategraph, critter, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f2d637d6
system_scope: ai
---

# Sgcritter Common

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_common` is a utility module that defines reusable stategraph states and event handlers for critter entities in DST. It centralizes common behaviors like idle animation selection, eating animations, emotional/emote sequences, walking states, and interactive states such as nuzzling or playing with other critters. This module is intended to be included and extended by specific critter stategraphs (e.g., beefalo, rabbit) via `SGCritterStates.Add*` functions. It integrates with the `locomotor`, `crittertraits`, and `follower` components to manage movement, dominant traits, and leader tracking.

## Usage example
```lua
local states = {}
local events = {}

SGCritterStates.AddIdle(states, 3, { 0.5, 1.5 }, function() return "idle_loop" end)
SGCritterStates.AddEat(states, { 0.2, 1.0 }, { onenter = function(inst) ... end })
SGCritterStates.AddRandomEmotes(states, {
    { anim = "emote_cute", timeline = { 0.2 } },
    { anim = "emote_wiggle", timeline = { 0.3 }, fns = { onexit = ... } }
})
SGCritterStates.AddWalkStates(states, { starttimeline = { 0.1 }, walktimeline = { 0.5, 1.0 }, endtimeline = { 0.2 } }, true)

return StateGraph("critter_common_sg", states, events)
```

## Dependencies & tags
**Components used:** `locomotor`, `crittertraits`, `follower`  
**Tags:** States may include `idle`, `busy`, `canrotate`, `moving`, `softstop`, `playful`. The `SGCritterEvents.OnTraitChanged` listener responds to `crittertraitchanged` events.

## Properties
No public properties — this module exports only helper functions (`SGCritterStates.Add*`, `SGCritterEvents.*`) for composition into stategraphs.

## Main functions
### `SGCritterEvents.OnEat()`
*   **Description:** Creates an event handler that transitions the stategraph to the `"eat"` state when the `"oneat"` event is fired.
*   **Parameters:** None.
*   **Returns:** `EventHandler` instance.

### `SGCritterEvents.OnAvoidCombat()`
*   **Description:** Creates an event handler that updates the stategraph’s `mem.avoidingcombat` flag when the `"critter_avoidcombat"` event fires.
*   **Parameters:** None.
*   **Returns:** `EventHandler` instance.

### `SGCritterEvents.OnTraitChanged()`
*   **Description:** Creates an event handler that triggers an emote (`"emote_cute"` or `"combat_pre"`) when the `"crittertraitchanged"` event fires. If the critter is currently in a `"busy"` state, it queues the emote for after exit.
*   **Parameters:** None.
*   **Returns:** `EventHandler` instance.

### `SGCritterStates.AddIdle(states, num_emotes, timeline, idle_anim_fn)`
*   **Description:** Adds an `"idle"` state that chooses animations or transitions based on hunger, dominant traits (e.g., combat, playful), queued emotes, or random chance. It stops movement, handles emote delays, and reacts to queued dominant trait emotes.
*   **Parameters:**  
    - `states` (table) — the state table to which the new state is appended.  
    - `num_emotes` (number) — number of standard emote variants available (e.g., 3 for emote_1, emote_2, emote_3).  
    - `timeline` (table?) — optional timeline definition for the state.  
    - `idle_anim_fn` (function?) — optional function `inst → anim_name` to customize the idle animation; otherwise defaults to `"idle_loop"`.  
*   **Returns:** Nothing — mutates the `states` table.

### `SGCritterStates.AddEat(states, timeline, fns)`
*   **Description:** Adds an `"eat"` state with pre/loop/post animation sequence. On exit, it either goes to `"emote_cute"` (if `"queuethankyou"` is set) or `"idle"`.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `timeline` (table?) — optional timeline definition.  
    - `fns` (table?) — optional table with `onenter` and `onexit` callback functions.  
*   **Returns:** Nothing.

### `SGCritterStates.AddHungry(states, timeline)`
*   **Description:** Adds a `"hungry"` state that plays a `"distress"` animation and returns to `"idle"` on animover.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `timeline` (table?) — optional timeline definition.  
*   **Returns:** Nothing.

### `SGCritterStates.AddNuzzle(states, actionhandlers, timeline, fns)`
*   **Description:** Adds a `"nuzzle"` state that plays the `"emote_nuzzle"` animation, fires `"critter_onnuzzle"` on completion, and handles action buffering. Registers `ACTIONS.NUZZLE` action handler.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `actionhandlers` (table) — table to which the action handler is appended.  
    - `timeline` (table?) — optional timeline definition.  
    - `fns` (table?) — optional `onenter`/`onexit` callbacks.  
*   **Returns:** Nothing.

### `SGCritterStates.AddRandomEmotes(states, emotes)`
*   **Description:** Adds a series of `"emote_{i}"` states (one per entry in `emotes`) with custom animations, timelines, and callbacks.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `emotes` (table) — array of emote entries; each entry is a table with keys:  
        - `anim` (string) — animation name  
        - `timeline` (table?) — optional timeline  
        - `fns` (table?) — optional `onenter`/`onexit` callbacks  
*   **Returns:** Nothing.

### `SGCritterStates.AddEmote(states, name, timeline)`
*   **Description:** Adds a generic `"emote_{name}"` state (e.g., `"emote_pet"` for `name="pet"`).
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `name` (string) — suffix for the state name.  
    - `timeline` (table?) — optional timeline definition.  
*   **Returns:** Nothing.

### `SGCritterStates.AddPetEmote(states, timeline, onexit)`
*   **Description:** Adds an `"emote_pet"` state with `"critter_onpet"` event fire on completion.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `timeline` (table?) — optional timeline definition.  
    - `onexit` (function?) — optional onexit callback.  
*   **Returns:** Nothing.

### `SGCritterStates.AddCombatEmote(states, timelines)`
*   **Description:** Adds three states: `"combat_pre"`, `"combat_loop"`, and `"combat_pst"` to manage combat/emotional displays. Loop duration and continuation are influenced by dominant traits and movement state.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `timelines` (table?) — optional table with keys: `pre`, `loop`, `pst`, each containing a timeline definition.  
*   **Returns:** Nothing.

### `SGCritterStates.AddPlayWithOtherCritter(states, events, timeline, onexit)`
*   **Description:** Adds `"playful"` and `"playful2"` states to coordinate two-way play animations. Handles event-based initiation (`start_playwithplaymate`, `critterplaywithme`) and delay checks.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `events` (table) — event table to which play-related event handlers are appended.  
    - `timeline` (table?) — optional table with `active` and `passive` timeline entries.  
    - `onexit` (table?) — optional table with `active` and `inative` (likely a typo for `inactive`) exit callbacks.  
*   **Returns:** Nothing.

### `SGCritterStates.AddWalkStates(states, timelines, softstop)`
*   **Description:** Adds `"walk_start"`, `"walk"`, and `"walk_stop"` states to handle forward movement animations and speed control. Supports soft stopping via `locomotor:SetExternalSpeedMultiplier`.
*   **Parameters:**  
    - `states` (table) — state table to modify.  
    - `timelines` (table?) — optional table with `starttimeline`, `walktimeline`, `endtimeline` entries.  
    - `softstop` (boolean or function) — if `true` or a function returning `true`, uses deceleration logic; otherwise, abrupt stop.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to (via `SGCritterEvents`):**  
  - `"oneat"` — triggers `"eat"` state.  
  - `"critter_avoidcombat"` — updates `sg.mem.avoidingcombat`.  
  - `"crittertraitchanged"` — queues or triggers dominant trait emotes.  
  - `"start_playwithplaymate"` and `"critterplaywithme"` — handled inside `AddPlayWithOtherCritter`.  
- **Pushes (events fired by states):**  
  - `"critter_onnuzzle"` — on `"nuzzle"` state exit.  
  - `"critter_onpet"` — on `"emote_pet"` state exit.  
  - `"critter_doemote"` — pushed to the leader on some emote transitions.  
  - `"oncritterplaying"` — on `"playful"` state entry.