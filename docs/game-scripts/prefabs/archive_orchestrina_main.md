---
id: archive_orchestrina_main
title: Archive Orchestrina Main
description: Manages the state, validation, and completion logic for the Archive Orchestrina puzzle, coordinating lockboxes and resonator sockets.
tags: [puzzle, audio, validation, environment, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 32779288
system_scope: environment
---

# Archive Orchestrina Main

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`archive_orchestrina_main` is a puzzle control entity for the Archive Orchestrina mechanic in DST's Grotto content. It coordinates a sequence-based puzzle where players must place resonators in eight sockets in the correct order, verified against a hidden lockbox. The component manages state transitions (idle/on), sound playback, animation triggers, and completion logic (including success and failure states). It relies on the `archivemanager` world component for power state and puzzle control, and uses `pointofinterest` for UI display (client-only). It interacts closely with `archive_orchestrina_small` (sockets) and `archive_lockbox` (puzzle data).

## Usage example
```lua
-- The component is instantiated as a prefab and attached automatically via Prefab().
-- Typical usage involves placing the main entity in the world alongside sockets and a lockbox.
-- The component runs periodic checks every 0.10 seconds to validate puzzle progress.

-- Example of external triggering (e.g., in another component):
local main = SpawnPrefab("archive_orchestrina_main")
main.components.pointofinterest:SetHeight(220) -- client-only
main:testforlockbox() -- Manually re-evaluate lockbox presence and state
```

## Dependencies & tags
**Components used:** `archivemanager`, `pointofinterest`, `inventoryitem`
**Tags added:** `archive_orchestrina_main`, `NOCLICK`, `DECOR`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `status` | string | `"off"` | Current puzzle state: `"off"` (idle) or `"on"` (active). |
| `failed` | boolean | `nil` | Set to `true` on puzzle failure; prevents further input until reset. |
| `rollback` | boolean | `nil` | Set during partial rollback on incomplete sequence correction. |
| `busy` | boolean | `nil` | Set `true` during the final success animation; blocks further input. |
| `numcount` | number | `nil` | Tracks the number of sockets currently set in the sequence. |
| `oldlockboxes` | number | `nil` | Stores the previous lockbox count for transition detection. |

## Main functions
### `testforlockbox(inst)`
*   **Description:** Evaluates the presence and validity of nearby lockboxes within a 3-unit radius. Enables or disables the main unit based on lockbox count (must be exactly 1, unowned), and handles state transitions (on/off animations/sounds). Resets socket states when powered off.
*   **Parameters:** `inst` (Entity) — the orchestrina main entity instance.
*   **Returns:** Nothing.
*   **Error states:** Assumes at most one valid lockbox exists; skips logic if no lockbox or if already `failed`.

### `testforcompletion(inst)`
*   **Description:** Validates the current sequence entered by the player. Compares socket orders (1–8) against the hidden puzzle from the lockbox. Handles success (full sequence), partial success (partial play), and failure (incorrect sequence or rollback).
*   **Parameters:** `inst` (Entity) — the orchestrina main entity instance.
*   **Returns:** Nothing.
*   **Error states:** 
    *   Returns early if no lockbox present or puzzle data missing.
    *   Does not re-trigger success if animation already playing (`pass` is set to `false` after success trigger).

### `smallOff(inst, fail)`
*   **Description:** Resets a socket's visual state to idle after activation or error. Used on individual `archive_orchestrina_small` instances to revert animations and state (`set`, `order`).
*   **Parameters:** 
    *   `inst` (Entity) — the socket entity.
    *   `fail` (boolean) — if `true`, triggers an error animation (`small_error`).
*   **Returns:** Nothing.

### `testforplayers(inst)`
*   **Description:** Checks if the player is near a socket and the main unit is ready for input. Assigns sequential `order` values (1–8) to the socket, plays activation animations/sounds, and calls `testforcompletion` to verify progress.
*   **Parameters:** `inst` (Entity) — the `archive_orchestrina_small` (socket) instance.
*   **Returns:** Nothing.
*   **Error states:** 
    *   Ignores input if main unit is `busy`, `failed`, socket is already `set`, or lockbox is missing.

## Events & listeners
- **Listens to:** None explicitly.
- **Pushes:** 
    * `onteach` — fired on the lockbox when the full 8-sequence puzzle succeeds (via `PushEvent` inside `testforcompletion` after delay).

## Notes
- The puzzle runs only when `archivemanager:GetPowerSetting()` returns `false` or `archivemanager` is absent.
- The `mastermind` function is defined locally but unused in this script.
- Socket ordering relies on `TheSim:FindEntities` + `GUID` sorting to ensure consistent sequence indexing.
- `scrapbook_specialinfo = "ORCHESTRINA"` enables special scrapbook section and animation.
- The component is server-authoritative (`TheWorld.ismastersim` guards all logic and state updates).