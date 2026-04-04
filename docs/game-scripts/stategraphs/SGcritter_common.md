---
id: SGcritter_common
title: Sgcritter Common
description: Provides reusable state and event definitions for critter entity stategraphs.
tags: [stategraph, critter, ai, animation]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: stategraphs
source_hash: 95996f44
system_scope: brain
---

# Sgcritter Common

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`SGcritter_common` is a utility module that provides reusable state and event definitions for building critter entity stategraphs. It contains helper functions in the `SGCritterStates` and `SGCritterEvents` tables that modders can use to add common critter behaviors like idling, eating, emotes, combat avoidance, playful interactions, and walking. This module integrates with the `locomotor`, `crittertraits`, and `follower` components to manage critter movement and trait-based behavior.

## Usage example
```lua
local states = {}
local events = {}
local actionhandlers = {}

-- Add common critter states
SGCritterStates.AddIdle(states, 3, nil, nil)
SGCritterStates.AddEat(states, nil, nil)
SGCritterStates.AddHungry(states, nil)
SGCritterStates.AddWalkStates(states, nil, false)

-- Add common critter events
table.insert(events, SGCritterEvents.OnEat())
table.insert(events, SGCritterEvents.OnAvoidCombat())

return StateGraph("SGCritter", states, events, "idle", actionhandlers)
```

## Dependencies & tags
**Components used:** `locomotor`, `crittertraits`, `follower`
**Tags:** Adds `idle`, `canrotate`, `busy`, `moving`, `softstop`, `playful` (varies by state)

## Properties
No public properties. This is a utility module with helper functions, not a class with instance properties.

## Main functions
### `SGCritterEvents.OnEat()`
*   **Description:** Returns an event handler that transitions the critter to the `eat` state when the `oneat` event fires.
*   **Parameters:** None.
*   **Returns:** `EventHandler` object for the `oneat` event.

### `SGCritterEvents.OnAvoidCombat()`
*   **Description:** Returns an event handler that sets the `avoidingcombat` memory flag when the `critter_avoidcombat` event fires.
*   **Parameters:** None.
*   **Returns:** `EventHandler` object for the `critter_avoidcombat` event.

### `SGCritterEvents.OnTraitChanged()`
*   **Description:** Returns an event handler that transitions to the `emote_cute` state when the `crittertraitchanged` event fires, or queues the transition if the critter is currently busy.
*   **Parameters:** None.
*   **Returns:** `EventHandler` object for the `crittertraitchanged` event.

### `SGCritterStates.AddIdle(states, num_emotes, timeline, idle_anim_fn)`
*   **Description:** Adds an `idle` state to the states table with logic for random emotes, trait-based behavior, and queued actions.
*   **Parameters:** `states` (table) - the states table to insert into. `num_emotes` (number) - number of emote variations. `timeline` (table) - optional timeline data. `idle_anim_fn` (function) - optional function receiving `inst` and returning idle animation name.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddEat(states, timeline, fns)`
*   **Description:** Adds an `eat` state with pre, loop, and post eat animations.
*   **Parameters:** `states` (table) - the states table to insert into. `timeline` (table) - optional timeline data. `fns` (table) - optional table with `onenter` and `onexit` callbacks.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddHungry(states, timeline)`
*   **Description:** Adds a `hungry` state that plays a distress animation.
*   **Parameters:** `states` (table) - the states table to insert into. `timeline` (table) - optional timeline data.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddNuzzle(states, actionhandlers, timeline, fns)`
*   **Description:** Adds a `nuzzle` state and registers the `NUZZLE` action handler.
*   **Parameters:** `states` (table) - the states table to insert into. `actionhandlers` (table) - the actionhandlers table to insert into. `timeline` (table) - optional timeline data. `fns` (table) - optional table with `onenter` and `onexit` callbacks.
*   **Returns:** Nothing. Modifies the `states` and `actionhandlers` tables in place.

### `SGCritterStates.AddRandomEmotes(states, emotes)`
*   **Description:** Adds multiple emote states based on the provided emotes table configuration. States are named `emote_1`, `emote_2`, etc., corresponding to the index in the `emotes` array.
*   **Parameters:** `states` (table) - the states table to insert into. `emotes` (table) - array of emote configurations with `tags`, `anim`, `timeline`, `fns`, and `ignorestandardonenter` fields. `fns` can contain `onenter`, `animover`, and `onexit` callbacks. `ignorestandardonenter` (boolean) - if true, skips default locomotor stop and animation play.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddEmote(states, name, timeline)`
*   **Description:** Adds a single named emote state.
*   **Parameters:** `states` (table) - the states table to insert into. `name` (string) - the emote name suffix. `timeline` (table) - optional timeline data.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddPetEmote(states, timeline, onexit)`
*   **Description:** Adds an `emote_pet` state that pushes the `critter_onpet` event on completion.
*   **Parameters:** `states` (table) - the states table to insert into. `timeline` (table) - optional timeline data. `onexit` (function) - optional exit callback.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddCombatEmote(states, timelines)`
*   **Description:** Adds three combat-related states: `combat_pre`, `combat_loop`, and `combat_pst`.
*   **Parameters:** `states` (table) - the states table to insert into. `timelines` (table) - optional table with `pre`, `loop`, and `pst` timeline data.
*   **Returns:** Nothing. Modifies the `states` table in place.

### `SGCritterStates.AddPlayWithOtherCritter(states, events, timeline, onexit)`
*   **Description:** Adds playful interaction states (`playful`, `playful2`) and event handlers for critter-to-critter play.
*   **Parameters:** `states` (table) - the states table to insert into. `events` (table) - the events table to insert into. `timeline` (table) - optional table with `active` and `passive` timeline data. `onexit` (table) - optional table with `active` and `inactive` exit callbacks.
*   **Returns:** Nothing. Modifies the `states` and `events` tables in place.

### `SGCritterStates.AddWalkStates(states, timelines, softstop)`
*   **Description:** Adds three walking states: `walk_start`, `walk`, and `walk_stop` with optional soft stopping behavior.
*   **Parameters:** `states` (table) - the states table to insert into. `timelines` (table) - optional table with `starttimeline`, `walktimeline`, and `endtimeline` data. `softstop` (boolean or function) - enables gradual speed reduction on stop. If function, receives `inst` as argument.
*   **Returns:** Nothing. Modifies the `states` table in place.

## Events & listeners
- **Listens to:** `oneat`, `critter_avoidcombat`, `crittertraitchanged`, `animover`, `animqueueover`, `start_playwithplaymate`, `critterplaywithme`
- **Pushes:** `critter_doemote` (to leader), `critter_onnuzzle`, `critter_onpet`, `oncritterplaying`