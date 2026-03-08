---
id: SGfruitfly
title: Sgfruitfly
description: Defines the state machine for fruitfly entities, handling movement, idle animation, combat attacks, flight, and reproductive behaviors.
tags: [ai, stategraph, flying, combat, reproduction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: cec783ca
system_scope: entity
---

# Sgfruitfly

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfruitfly` is a state graph that controls the behavior of fruitfly entities, including both the player-sized "Lord Fruit Fly" and smaller minions. It manages flight animations, idle spins, plant attack sequences, landing mechanics, and a unique reproductive action (`buzz`) that spawns new fruitfly minions. The graph integrates standard common states (combat, walk, sleep, frozen, electrocute) and uses action handlers to route user and system actions (e.g., `ATTACKPLANT`, `INTERACT_WITH`) to appropriate states.

## Usage example
```lua
local inst = CreateEntity()
-- (Prefab setup for fruitfly would occur here)
inst:AddStateGraph("fruitfly", "stategraphs/SGfruitfly")
-- The stategraph is automatically applied via `SpawnPrefab("fruitfly")`
-- No manual stategraph assignment is required by modders.
```

## Dependencies & tags
**Components used:** `combat`, `follower`
**Tags:** Checks `lordfruitfly` to differentiate behavior between Lord and minion variants. States use tags: `idle`, `busy`, `flight`, `noelectrocute`.

## Properties
No public properties. Stategraph logic is encapsulated entirely within the `states`, `events`, and `actionhandlers` tables.

## Main functions
### `StartFlap(inst)`
*   **Description:** Ensures the fruitfly’s flap sound loop plays while it is airborne or animating.
*   **Parameters:** `inst` (Entity instance) — the fruitfly entity.
*   **Returns:** Nothing.

### `StopFlap(inst)`
*   **Description:** Stops the flap sound loop.
*   **Parameters:** `inst` (Entity instance) — the fruitfly entity.
*   **Returns:** Nothing.

### `SpawnFruitFly(inst)`
*   **Description:** Spawns `inst:NumFruitFliesToSpawn()` new fruitfly minions near the caller's position, assigns the caller as their leader via `follower:SetLeader`, and lands them in the `"land"` state.
*   **Parameters:** `inst` (Entity instance) — typically the "Lord Fruit Fly" calling this during the `"buzz"` state.
*   **Returns:** Nothing.
*   **Error states:** No-op if `TheWorld.components.hounded` is `nil`.

## Events & listeners
- **Listens to:** Standard events provided via `CommonHandlers` and custom `EventHandler`s:
  - `animover`, `animqueueover`, `onremove`, `onhitother`, `onfreeze`, `onelectrocute`, `onattack`, `onattacked`, `ondeath`, `onlocomote`.
- **Pushes:** Events fired via `inst:PushEvent` are not present in this stategraph. Event callbacks are handled internally via `EventHandler`.
