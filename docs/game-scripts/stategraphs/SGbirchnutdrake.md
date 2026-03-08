---
id: SGbirchnutdrake
title: Sgbirchnutdrake
description: Defines the stategraph for the Birchnut Drake entity, governing its movement, combat, spawning, and subterranean behavior patterns.
tags: [ai, combat, animation, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d415a67e
system_scope: ai
---

# Sgbirchnutdrake

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbirchnutdrake` is the stategraph that controls the behavior of the Birchnut Drake, a DLC creature that spawns from the ground and engages in combat using leaping attacks. It defines transitions between idle, spawn, enter, exit, and attack states, and integrates with common state behaviors for combat, walking, sleep, freeze, and electrocute. The stategraph uses timeline events for synchronized sound and animation cues, and integrates with core components like `health`, `combat`, `burnable`, and `locomotor`.

## Usage example
This stategraph is automatically instantiated when the Birchnut Drake entity is created. It is not added manually by mods, but modders may extend its behavior using hooks or by overriding state handlers in prefabs.

```lua
-- Example: Inject custom logic on attack start via event listener in the prefab file
inst:ListenForEvent("doattack", function(inst, data)
    -- Custom behavior before attack
    inst.SoundEmitter:PlaySound("custom/drake_custom_charge")
end, TheFrontEnd)

-- Or patch the stategraph using CommonStates.AddCombatStates with additional timelines
```

## Dependencies & tags
**Components used:** `health`, `combat`, `burnable`, `locomotor`  
**Tags added/removed in states:**
- `idle`, `busy`, `hidden`, `invisible`, `noattack`, `noelectrocute`, `attack`, `canrotate`, `jumping`, `exit`

## Properties
No public properties defined. State data is stored in `inst.sg.statemem` (e.g., `target`) and `inst.sg.mem` (e.g., `exit`).

## Main functions
This is a stategraph definition file; it does not expose reusable functions. The primary output is a `StateGraph` object returned by `StateGraph(...)`.

### `StateGraph("birchnutdrake", states, events, "spawn", actionhandlers)`
*   **Description:** Creates and returns the stategraph instance for the Birchnut Drake. The initial state is `"spawn"`. Action handlers (e.g., `GOHOME`) map user commands to state transitions.
*   **Parameters:**
    - `"birchnutdrake"` (string): Unique identifier for the stategraph.
    - `states` (table): Array of state definitions, including `"idle"`, `"spawn"`, `"enter"`, `"exit"`, `"attack_leap"`, etc.
    - `events` (table): Event handlers for external triggers like `"exit"`, `"doattack"`, `"doattack"`, `"animover"`.
    - `"spawn"` (string): Initial state.
    - `actionhandlers` (table): Maps `ACTIONS` to handler functions (currently only `GOHOME` → `"action"`).

## Events & listeners
- **Listens to:**
  - `"exit"` → triggers `OnExit`
  - `"gotosleep"` → triggers `OnExit`
  - `"doattack"` → initiates `"attack"` or `"attack_leap"` depending on target proximity
  - `"animover"` → used in nearly every state to loop or transition
  - `"onfreeze"` / `"onelectrocute"` / `"onattacked"` / `"ondeath"` / `"locomote"` → via `CommonHandlers`
- **Pushes:**
  - `"locomote"` → via `locomotor:Stop()` when stopping movement
  - `"onextinguish"` → indirectly via `burnable:Extinguish()` if burning
  - Custom sound triggers and physics events (e.g., `"RemovePhysicsColliders"`) are invoked in timelines but are not events.