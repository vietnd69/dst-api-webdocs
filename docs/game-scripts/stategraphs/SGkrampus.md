---
id: SGkrampus
title: Sgkrampus
description: Manages the state machine for the Krampus character, handling idle, attack, hit, taunt, steal, hammer, death, and exit behaviors using animation, sound, and combat systems.
tags: [ai, combat, boss, animation, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 737f4621
system_scope: entity
---

# Sgkrampus

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGkrampus` defines the full state graph for the Krampus entity in DST. It coordinates animations, sound effects, combat interactions (via the `combat` component), movement (via `locomotor`), and health state (via `health`) to drive Krampus’s behavior—ranging from idle and aggressive states to death and a special exit sequence. The state graph integrates common state utilities (`commonstates`) for sleep, running, freezing, electrocution, and corpse handling, and implements custom state transitions for Krampus-specific actions like stealing and hammering.

## Usage example
This state graph is not used directly by modders but is attached to the Krampus prefab via the engine’s state graph system. It is invoked automatically when the entity’s brain uses `SGkrampus` as its state graph. No manual instantiation is required.

```lua
-- This file is not used directly; it is referenced by the Krampus prefab definition.
-- Internally, the state graph is constructed and returned by:
-- return StateGraph("krampus", states, events, "init", actionhandlers)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`
**Tags:** Adds state-specific tags such as `idle`, `canrotate`, `attack`, `busy`, `hit`, `taunt`, `death`, `steal`, `hammer`, and `exit`. The `exit` state explicitly sets `nointerrupt`, `nosleep`, `nofreeze`, `noattack`, and `noelectrocute` tags. Common utilities (`commonstates`) contribute additional state tags for sleep, run, frozen, electrocute, and corpse states.

## Properties
No public properties are initialized or exposed. This is a state graph definition, not a component with mutable instance data.

## Main functions
### `StateGraph("krampus", states, events, "init", actionhandlers)`
*   **Description:** Constructs and returns a fully configured state graph instance for Krampus. This is the entry point for the system; it defines the state set (`states`), event handlers (`events`), the initial state (`"init"`), and custom action handlers (`actionhandlers`).
*   **Parameters:** 
    * `states` (table) — Array of state definitions (e.g., `idle`, `attack`, `death`, `steal`, `hammer`, `exit`, etc.).
    * `events` (table) — Array of event handlers (including `attacked`, `doattack`, sleep/wake, freeze, electrocute, death, and corpse events).
    * `"init"` (string) — Name of the initial state.
    * `actionhandlers` (table) — Map of actions (`PICKUP`, `HAMMER`) to custom state names (`"steal"`, `"hammer"`).
*   **Returns:** A fully initialized `StateGraph` instance.

State-specific methods are not called directly—transitions and actions are triggered via events and internal state logic. Key internal callbacks documented in `onenter`, `timeline`, and `events` include:
- `inst.Physics:Stop()` — to halt movement during states.
- `inst.components.combat:StartAttack()` / `DoAttack()` — to coordinate attack timing and combat interaction.
- `inst.components.health:SetInvincible(true/false)` — to toggle invincibility (e.g., during `exit`).
- `inst.components.locomotor:StopMoving()` — to prevent locomotion.
- `inst.AnimState:PlayAnimation(...)` and animation queueing for visual feedback.
- `inst.SoundEmitter:PlaySound(...)` — for audio triggers.
- `inst:PerformBufferedAction()` — to execute pending actions (e.g., looting) at precise animation frames.
- `RemovePhysicsColliders(inst)` — disables collision in `death` and `exit` states.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers `hit` state on non-dead entities (unless in `nointerrupt` or `attack` tag).
  - `doattack` — transitions to `attack` state if conditions permit (not dead, not busy, or in hit state without electrocute).
  - `animover`, `animqueueover`, `animDone` — drive transitions between states based on animation completion.
  - `OnSleepEx()`, `OnWakeEx()` — from `commonstates` (sleep/wake states).
  - `OnLocomote(true,false)` — from `commonstates` (handles movement state).
  - `OnFreeze()`, `OnElectrocute()` — from `commonstates`.
  - `OnDeath()`, `OnCorpseChomped()`, `OnCorpseDeathAnimOver()` — from `commonstates` (corpse states).
- **Pushes:**
  - `invincibletoggle` — via `health:SetInvincible()` (e.g., during `exit` enter/exit).
  - Internal `SGkrampus_exit` events via `inst:StopBrain()` and `inst:RestartBrain()` during `exit` transitions.