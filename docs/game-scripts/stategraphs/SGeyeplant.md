---
id: SGeyeplant
title: Sgeyeplant
description: Defines the state machine for the Eye Plant entity, governing its animations, actions, and transitions between states such as idle, alert, attack, and eat.
tags: [ai, stategraph, creature, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 7a985068
system_scope: entity
---

# Sgeyeplant

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGeyeplant` is the state graph that controls the behavior of the Eye Plant prefab. It defines the entity's state machine, including transitions triggered by animations, events, and timeouts. The Eye Plant cycles through idle, alert (when it has a target), hit (on receiving damage), and attack states. It also supports eating prey via dedicated eat-enter and eat-loop states, and integrates with common states for freeze and electrocute. The state graph depends on the `health`, `combat`, and `inventory` components for decision-making and reaction logic.

## Usage example
```lua
-- This state graph is not added manually; it is automatically used by the Eye Plant prefab.
-- The game engine loads this stategraph and assigns it to entities with matching tags.
-- Example prefab configuration (from prefabs/eyeplant.lua):
inst.stategraph = SGeyeplant
```

## Dependencies & tags
**Components used:** `combat`, `health`, `inventory`
**Tags:** No tags are added or removed directly; the state machine uses built-in state tags (`busy`, `idle`, `canrotate`, `attack`, `hit`) for logic and animation control.

## Properties
No public properties.

## Main functions
This file returns a `StateGraph` object and does not define any standalone functions. State behavior is implemented via:

### State handlers (`onenter`, `ontimeout`, `timeline`, `events`)
Each state defines custom behaviors through these hooks:

#### `onenter(inst, playanim)`
Called when entering a state. Used for:
- Stopping physics (`Physics:Stop()`)
- Playing animations (`AnimState:PlayAnimation(...)`)
- Emitting sounds (`SoundEmitter:PlaySound(...)`)
- Facing targets (`ForceFacePoint(...)`)
- Triggering actions (`PerformBufferedAction()`)

#### `ontimeout(inst)`
Used only in `eat_loop` state to reset the Eating timer and perform buffered action.

#### `timeline` entries
Lists time-based callbacks (in frames) for actions like attacks or biting:
- `TimeEvent(14*FRAMES, fn)` — fires at frame 14 of animation.
  - Triggers `combat:DoAttack()`, sound playback, and prey trapping.

#### `events` tables
Event handlers scoped to the state:

- `animover` / `animqueueover` — transitions when animations complete.
- `losttarget` — returns to `idle` when target is lost.
- `attacked` — triggers `hit` state or electrocute response.
- `electrocute` — drops inventory items during electrocution.

## Events & listeners
- **Listens to:**
  - `animover` — transitions from `spawn`, `action`, `eat_enter`, `walk_start` to `idle`.
  - `animqueueover` — in `attack`, re-engages if target in range, else switches to `alert`.
  - `losttarget` — returns to `idle` from `alert`.
  - `attacked` — triggers `hit` state unless dead or already attacking; handles electrocute fallback.
  - `electrocute` — drops inventory in `eat_loop` state.
- **Pushes:** This file itself does not push custom events; it responds to standard game events (`attacked`, `electrocute`, `animover`, etc.) and internally transitions states.