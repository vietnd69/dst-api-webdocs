---
id: SGcrabking_cannontower
title: Sgcrabking Cannontower
description: Controls the state machine and behavior of the Crab King's cannon tower, managing spawning, loading, shooting, and breach-related animations and logic.
tags: [ai, boss, combat, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 80f27d35
system_scope: world
---

# Sgcrabking Cannontower

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph manages the behavior of the Crab King's cannon tower, including animation sequencing, sound effects, and interactions with the boat it is placed on. It defines transitions between states such as `idle`, `load`, `shoot`, `spawn`, and several `breach`-related states that handle tower structural failure and spawning of the Crab King mob. It relies on the `health`, `lootdropper`, and `floater` components for core functionality.

## Usage example
This stategraph is assigned automatically when the `crabking_cannontower` prefab is created and does not require manual instantiation. However, external systems may trigger state transitions by pushing the following events:

```lua
-- Trigger cannon tower to load
inst:PushEvent("ck_loadcannon")

-- Trigger cannon tower to shoot
inst:PushEvent("ck_shootcannon")

-- Trigger breach sequence (e.g., during boat collision)
inst:PushEvent("ck_breach")

-- Trigger initial spawn animation
inst:PushEvent("ck_spawn")
```

## Dependencies & tags
**Components used:** `health`, `lootdropper`, `floater`
**Tags:** Adds state tags: `idle`, `empty`, `loaded`, `busy`, `hit`, `breach`. The stategraph also checks for tags `breach` and `loaded` during state transitions.

## Properties
No public properties are defined in this stategraph. State memory is stored locally in `inst.sg.statemem` (e.g., `inst.sg.statemem.loaded`), and internal animation/sound states are handled via `inst.AnimState` and `inst.SoundEmitter`.

## Main functions
This stategraph is a pure state definition — it does not expose public functions directly. All logic resides in `State` objects with `onenter`, `ontimeout`, `onupdate`, `timeline`, and `onexit` callbacks.

### `onenter` callbacks (state-specific)
Each state defines its own `onenter` logic. For example:

#### `idle` `onenter`
*   **Description:** Initializes the idle state. Sets `loaded`/`empty` tag, plays appropriate idle animation, schedules timeout, and triggers reload test if unloaded.
*   **Parameters:** `loaded` (boolean) — indicates if the cannon is loaded.
*   **Returns:** Nothing.

#### `death` `onenter`
*   **Description:** Executes the death sequence: plays break animation, drops loot, stops floating, removes physics, spawns visual FX and the `crabking_mob`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `ck_loadcannon` — transitions to `load` state (if not dead).
  - `ck_shootcannon` — transitions to `shoot` state (if not dead).
  - `ck_spawn` — transitions to `spawn` state (if not dead).
  - `ck_breach` — transitions to `breach_pre` state (if not dead).
  - `attacked` — transitions to `hit` state (if not dead and not `busy`), or `breach_pst` if already in `breach`.
  - `death` — transitions to `death` or `breach_pst` depending on breach state.

- **Pushes:** None — this stategraph does not fire custom events. It reacts to external events and orchestrates internal transitions and FX.
