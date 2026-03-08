---
id: SGwx78_scanner
title: Sgwx78 Scanner
description: Manages the state machine and animations for the WX-78 scanner prefab during deployment, scanning, and removal operations.
tags: [ai, animation, state, scanner]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2c2c3feb
system_scope: entity
---

# Sgwx78 Scanner

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `wx78_scanner` stategraph controls the behavior and visual state of the WX-78 scanner prefab (used in the *Shipwrecked* DLC). It defines transitions between idle, scanning, turning on/off, and success states—orchestrating animations, sounds, and lifecycle events. It relies on the `entitytracker` and `locomotor` components to manage scanning targets and movement, and integrates with `commonstates` to support walkable movement with dynamic animation selection.

## Usage example
This stategraph is applied internally by the `wx78_scanner` prefab via `inst:AddStateGraph("wx78_scanner")`. Modders typically interact with it indirectly via events such as `turn_on_finished`, `on_landed`, or `on_no_longer_landed`, or by setting the `scantarget` entity via `entitytracker`.

```lua
-- Example: programmatically trigger scanner turn-on (simplified)
local scanner = SpawnPrefab("wx78_scanner")
scanner.sg:GoToState("turn_on")
```

## Dependencies & tags
**Components used:** `entitytracker`, `locomotor`  
**Tags:** `idle`, `busy`, `scanned` (used in state definitions)

## Properties
No public properties exposed; state memory is stored in `inst.sg.statemem` during state transitions.

## Main functions
### `return_to_idle(inst)`
*   **Description:** Internal callback that transitions the stategraph to the `idle` state. Called on animation completion in the `idle` state.
*   **Parameters:** `inst` (Entity) — the scanner entity instance.
*   **Returns:** Nothing.

### `targetinrange(inst)`
*   **Description:** Checks whether a scanned entity (registered under `"scantarget"` in `entitytracker`) is within `SCAN_DIST = 4` units.
*   **Parameters:** `inst` (Entity) — the scanner entity instance.
*   **Returns:** `boolean` — `true` if target exists and is within range, otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers transitions from animation-completed states (`idle`, `turn_on`, `turn_off`, `scan_success`)  
  - Custom events (`on_landed`, `on_no_longer_landed`) — pushed internally to manage floating/landing effects.

- **Pushes:**  
  - `turn_on_finished` — fired when `turn_on` animation completes.  
  - `on_landed`, `on_no_longer_landed` — fired at specific timeline events to controlFX behavior.  
  - `locomote` — implicitly via `LocoMotor:Stop()` in `onenter` handlers.