---
id: SGdaywalker_common
title: Sgdaywalker Common
description: Provides shared animation and behavior utilities for daywalker-type entities, including camera shakes, chatter scheduling, and walk/run state definitions.
tags: [locomotion, ai, audio, camera]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 87ee1d9f
system_scope: entity
---

# Sgdaywalker Common

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGDaywalkerCommon` is a shared utility module for defining common stategraph behaviors used by daywalker-style entities (e.g., daytime variants of certain bosses or creatures). It encapsulates camera shake logic, randomized chatter scheduling, and standardized walk/run state definitions—including footstep sound timing and stalking behavior integration. It depends on the `talker` component for dialogue and integrates with the `combat` component to support stalking logic during locomotion. The module does not define a class or component; instead, it exports a table of reusable functions intended to be consumed by stategraph definitions (e.g., in `SGdaywalker.lua`).

## Usage example
```lua
local SGDaywalkerCommon = require("stategraphs/SGdaywalker_common")
local MYSTATEGRAPH = {}

SGDaywalkerCommon.AddWalkStates(MYSTATEGRAPH.states)
SGDaywalkerCommon.AddRunStates(MYSTATEGRAPH.states)

-- In a state's onenter:
-- SGDaywalkerCommon.TryChatter(inst, MyDelays, "CHATTER_GROWL", 1)
```

## Dependencies & tags
**Components used:** `talker`, `combat`  
**Tags:** Checks for `combat.target` during walking to determine stalking status; adds `stalking` and `walk` state tags accordingly.

## Properties
No public properties. This module exports only functions.

## Main functions
### `DoRoarShake(inst)`
*   **Description:** Triggers a full-screen camera shake for a roar sound/visual effect.
*   **Parameters:** `inst` (Entity) — the entity centering the shake.
*   **Returns:** Nothing.

### `DoPounceShake(inst)`
*   **Description:** Triggers a full-screen camera shake for a pounce action (shorter duration than roar).
*   **Parameters:** `inst` (Entity) — the entity centering the shake.
*   **Returns:** Nothing.

### `DoDefeatShake(inst)`
*   **Description:** Triggers a vertical-only camera shake for a defeat or collapse animation.
*   **Parameters:** `inst` (Entity) — the entity centering the shake.
*   **Returns:** Nothing.

### `DoSleepShake(inst)`
*   **Description:** Triggers a vertical-only camera shake for a sleeping/idle transition.
*   **Parameters:** `inst` (Entity) — the entity centering the shake.
*   **Returns:** Nothing.

### `TryChatter(inst, delaytbl, strtblname, index, ignoredelay, prioritylevel)`
*   **Description:** Conditionally plays a chatter sound based on cooldowns, if `talker` is present and the world is mastersim. Updates the `lastchatter` memory timestamp on success.
*   **Parameters:**
  * `inst` (Entity) — entity with `talker` component.
  * `delaytbl` (table) — map of `strtblname` keys to `{delay=number, len=number}` entries.
  * `strtblname` (string) — name of the strings table (e.g., `"CHATTER_ROAR"`).
  * `index` (number, optional) — specific index within the strings table; if omitted, selects a random index.
  * `ignoredelay` (boolean, optional) — if true, skips cooldown check.
  * `prioritylevel` (number, optional) — chat priority (uses `CHATPRIORITIES` constants).
*   **Returns:** Nothing.
*   **Error states:** No-op if `talker` component is absent or world is not mastersim.

### `AddWalkStates(states, override_timelines, override_fns)`
*   **Description:** Adds walk-related states to a stategraph using `CommonStates.AddWalkStates`, preconfigured with footstep sound timing, stalking integration, and optional override hooks.
*   **Parameters:**
  * `states` (table) — the target stategraph states table to populate.
  * `override_timelines` (table, optional) — table to shallow-copy internal timelines into (allows modder customization).
  * `override_fns` (table, optional) — table to shallow-copy internal state hooks into.
*   **Returns:** Nothing.
*   **Effects:** Adds `walkonenter`, `endonenter`, `startonenter` event handlers; adds `walk` and `stalking` state tags via `OnEnterWalkingStates`.

### `AddRunStates(states, override_timelines, override_fns)`
*   **Description:** Adds run-related states to a stategraph using `CommonStates.AddRunStates`, with run-speed footstep timing, stalk-disabling on start, and cooling-down check for exit footsteps.
*   **Parameters:**
  * `states` (table) — the target stategraph states table to populate.
  * `override_timelines` (table, optional) — table to shallow-copy internal timelines into.
  * `override_fns` (table, optional) — table to shallow-copy internal state hooks into.
*   **Returns:** Nothing.
*   **Effects:** Sets `endonenter` to disable stalking; integrates footstep logic aligned with faster movement.

## Events & listeners
- **Listens to:** None (module functions are invoked directly; they do not register event listeners).
- **Pushes:** None.