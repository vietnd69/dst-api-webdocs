---
id: SGgnarwail
title: Sggnarwail
description: State machine for the Gnarwail creature, handling movement, attacks, feeding, and status effects like freezing and sleep.
tags: [ai, locomotion, combat, boss, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6089a6f8
system_scope: ai
---

# Sggnarwail

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGgnarwail` is a state graph defining the behavioral states and transitions for the Gnarwail NPC. It orchestrates movement (walking, running, diving), specialized attacks (boat attack, body slam), eating, and reactions to environmental status effects (freezing, electrocution, sleep). The state graph integrates tightly with the `combat`, `health`, `locomotor`, and `follower` components to drive the Gnarwail's AI behavior.

## Usage example
This state graph is applied automatically when the `gnarwail` prefab is instantiated. Modders typically do not invoke it directly but may extend or override behavior by modifying state definitions or responding to events it fires (e.g., `doattack`).

```lua
-- Example: Listen for a custom event from the Gnarwail's state graph
inst:ListenForEvent("doattack", function(inst, data)
    -- Custom logic when Gnarwail initiates an attack
    if data.target and data.target:HasTag("player") then
        -- Log or modify behavior
    end
end)
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `health`, `hull`, `locomotor`

**Tags added/removed by states:**
- State tags: `idle`, `busy`, `attack`, `moving`, `running`, `idle`, `eating`, `diving`, `jumping`, `longattack`, `noattack`, `noelectrocute`, `canrotate`, `hit`, `frozen`, `sleeping`
- Entity tags: `scarytocookiecutters` (removed during body slam attack, added on exit)

## Properties
No public properties are defined in this state graph. Configuration is done via `TUNING.GNARWAIL.*` constants.

## Main functions
This state graph returns a `StateGraph` instance; it does not expose standalone functions. State handlers and callbacks are internal.

### `return_to_idle(inst)`
*   **Description:** Helper function to transition to the `idle` state.
*   **Parameters:** `inst` (Entity) - the Gnarwail instance.
*   **Returns:** Nothing.

### `return_to_emerge(inst)`
*   **Description:** Helper function to transition to the `emerge` state.
*   **Parameters:** `inst` (Entity) - the Gnarwail instance.
*   **Returns:** Nothing.

### `body_slam_attack(inst)`
*   **Description:** Performs a combat attack on the current target if valid.
*   **Parameters:** `inst` (Entity) - the Gnarwail instance.
*   **Returns:** Nothing.

### `spawn_body_slam_waves(inst)`
*   **Description:** Spawns visual water wave effects at the Gnarwail's position.
*   **Parameters:** `inst` (Entity) - the Gnarwail instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onattacked` (from `CommonHandlers`)
  - `onfreezeex` (from `CommonHandlers`)
  - `onelectrocute` (from `CommonHandlers`)
  - `ondeath` (from `CommonHandlers`)
  - `onsleepex` (from `CommonHandlers`)
  - `onwakeex` (from `CommonHandlers`)
  - `onfedbyplayer` – triggers `eat` state
  - `doattack` – initiates boat or body slam attacks based on target and distance
  - `locomote` – triggered by `locomotor` to respond to movement intent (start/stop walk/run, dive for body slam)
  - `animover` / `animqueueover` – signal animation completion for transitions
  - `corpsechomped` (from `CommonHandlers`)

- **Pushes:**
  - `healthdelta` (via `health:DoDelta`)
  - `locomote` (via `locomotor:Stop`)
  - Events from substates (e.g., `animover`, `onattack`) via state transitions
