---
id: hermitcrab_shell
title: Hermitcrab Shell
description: A consumable horn item that enables teleportation to the Hermit's house and has a secondary use for tending plants.
tags: [inventory, tool, teleport, consumable, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: edf108a9
system_scope: inventory
---

# Hermitcrab Shell

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hermitcrab_shell` is a consumable item prefab functioning as both a musical instrument and teleportation device. When played by a character, it attempts to teleport them to the Hermit's house if valid conditions are met. If teleportation fails (e.g., no valid link or invalid position), it records the failure for later feedback. It also supports a secondary interaction: `tend` plants via the `farmplanttendable` component when heard. The item has a finite number of uses and consumes one use per successful teleport or plant tend action.

## Usage example
```lua
local shell = SpawnPrefab("hermitcrab_shell")
-- The prefab automatically adds required components and tags.
-- To play the shell:
local musician = GetPlayer()
shell:PushEvent("played", { musician = musician })
-- To listen for interactions, attach to the instrument component:
shell.components.instrument:SetOnPlayedFn(my_custom_play_fn)
```

## Dependencies & tags
**Components used:** `instrument`, `tool`, `finiteuses`, `inventoryitem`, `inspectable`, `farmplanttendable`, `health`, `locomotor`, `moisture`, `talker`, `inventory`, `hermitcrab_relocation_manager`

**Tags:** Adds `horn`, `tool` (via direct `AddTag`)

## Properties
No public properties.

## Main functions
### `OnPlayed(inst, musician)`
*   **Description:** Called when the shell is played. Attempts to teleport the `musician` to the Hermit's house. Validates destination using `FindWalkableOffset` and environment checks; spawns visual effects before initiating teleport sequence.
*   **Parameters:** `musician` (Entity) — the entity playing the shell.
*   **Returns:** Nothing.
*   **Error states:** If teleportation is impossible (e.g., `noteleport` tag present, no Pearl's House, or unsafe destination point), sets `inst.hermitcrab_shell_badteleportpoint = true` and `inst.hermitcrab_shell_shouldfiniteuses_use = false`.

### `StartTeleport(musician, x, y, z)`
*   **Description:** Initiates the teleport sequence for the `musician` to coordinates `x, y, z`. Halts motion, hides entity (for non-players), makes them invincible, and schedules a delayed move.
*   **Parameters:** `musician` (Entity), `x`, `y`, `z` (numbers) — destination world position.
*   **Returns:** Nothing.

### `ContinueTeleport(musician, x, y, z)`
*   **Description:** Executes the teleport move: snaps physics, spawns FX, adjusts moisture based on waterproofness, and handles player ghost or NPC state transitions.
*   **Parameters:** `musician` (Entity), `x`, `y`, `z` (numbers) — destination world position.
*   **Returns:** Nothing.

### `OnHeard(inst, musician, instrument)`
*   **Description:** Triggered when the shell sound is heard. Calls `TendTo` on the `farmplanttendable` component if present, indicating an attempt to tend a plant.
*   **Parameters:** `inst` (Entity), `musician` (Entity), `instrument` (Entity) — the instrument object itself.
*   **Returns:** Nothing.
*   **Error states:** No-op if `farmplanttendable` component is absent.

### `UseModifier(uses, action, doer, target, item)`
*   **Description:** Modifies use consumption for the `finiteuses` component. Prevents default consumption on failed teleports, but ensures consumption on successful actions.
*   **Parameters:** `uses` (number), `action` (string), `doer` (Entity), `target` (Entity), `item` (Entity — the shell).
*   **Returns:** `uses` if action succeeded (non-zero consumption); `0` otherwise (no consumption on failure).

## Events & listeners
- **Pushes:** None directly (events are handled via component callbacks, e.g., `instrument` events).
- **Listens to:** Not applicable — this file defines callbacks for `instrument`, `finiteuses`, and event handlers; no internal `ListenForEvent` calls are present.
