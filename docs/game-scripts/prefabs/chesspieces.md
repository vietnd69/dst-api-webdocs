---
id: chesspieces
title: Chesspieces
description: Generates chesspiece prefabs with dynamic behavior based on moon phases, material variants, and interaction with other entities during moon events.
tags: [world, event, boss, crafting, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 673f68b2
system_scope: world
---

# Chesspieces

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`chesspieces.lua` is a prefabs script that dynamically generates all playable chesspiece entities (e.g., pawn, rook, knight, dragonfly, deerclops) and their material variants (marble, stone, moonglass). Each chesspiece functions as a heavy obstacle in the world with unique behaviors triggered by moon phase states (`isfullmoon`/`isnewmoon`). When hammered during a moon event and not made of moonglass, it spawns a corresponding shadow creature and triggers连锁 collapse effects on adjacent chesspieces. The script also defines a lightweight builder entity used during construction to spawn the final chesspiece.

## Usage example
```lua
-- Spawns a marble pawn chesspiece at the origin
local pawn = SpawnPrefab("chesspiece_pawn")
pawn.Transform:SetPosition(0, 0, 0)

-- Spawns a stone moosegoose chesspiece
local moose = SpawnPrefab("chesspiece_moosegoose_stone")
moose.Transform:SetPosition(10, 0, 10)

-- Spawns a builder for a rook (used internally during construction)
local rook_builder = SpawnPrefab("chesspiece_rook_builder")
```

## Dependencies & tags
**Components used:** `heavyobstaclephysics`, `inspectable`, `lootdropper`, `inventoryitem`, `equippable`, `workable`, `submersible`, `symbolswapdata`, `hauntable`

**Tags:** Adds `heavy`, `chess_moonevent`, `event_trigger`, `CLASSIFIED`. Checks tags `INLIMBO` and `chess_moonevent` for event logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pieceid` | number | `nil` | Index into the `PIECES` table identifying the piece type. Set during prefab instantiation. |
| `materialid` | number | `nil` | Index into the `MATERIALS` table identifying the material variant. Set via `SetMaterial`. |
| `forcebreak` | string or nil | `nil` | Indicates forced breakage cause (`"shadow"` or `"auto"`), triggers immediate destruction on struggle. |
| `_task` | Task or nil | `nil` | Periodic task reference for the struggle animation loop. |
| `_altname` | net_bool or nil | `nil` | Networked boolean used by moosegoose to toggle alternate name display. |
| `gymweight` | number | `PIECES[pieceid].gymweight` | Weight value used for grouping or sorting in the Gym mechanic. |

## Main functions
### `SetMaterial(inst, materialid)`
* **Description:** Applies a material variant to a chesspiece (e.g., marble, stone, moonglass), updating visuals, loot, and symbols accordingly.
* **Parameters:** `inst` (Entity) — the chesspiece instance; `materialid` (number) — index into `MATERIALS`.
* **Returns:** Nothing.
* **Error states:** None; always sets material and overrides build/symbols.

### `CheckMorph(inst)`
* **Description:** Determines if the chesspiece should begin struggling due to moon phase (full moon or new moon). Only applies if `PIECES[pieceid].moonevent` is `true` and not moonglass.
* **Parameters:** `inst` (Entity) — the chesspiece instance.
* **Returns:** Nothing.
* **Error states:** Removes active struggle task when conditions are no longer met.

### `DoStruggle(inst, count)`
* **Description:** Plays the struggle animation and sound, and either destroys the piece immediately (if `forcebreak` is set) or schedules repeated struggle tasks.
* **Parameters:** `inst` (Entity); `count` (number) — remaining attempt count.
* **Returns:** Nothing.
* **Error states:** Immediately destroys the piece if `forcebreak` is truthy.

### `onworkfinished(inst)`
* **Description:** Called when the chesspiece is successfully hammered. Spawns a shadow creature (if applicable), drops loot, triggers collapse FX, and removes the piece. Handles both regular and rook-sized collapses.
* **Parameters:** `inst` (Entity) — the chesspiece instance.
* **Returns:** Nothing.
* **Error states:** Moonglass pieces do *not* trigger creature spawning or连锁 collapse.

### `StartStruggle(inst)`
* **Description:** Initiates the struggle task loop if not already running.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Skips if `inst._task` is already non-nil.

### `StopStruggle(inst)`
* **Description:** Cancels the current struggle task if present and not forced-break.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnShadowChessRoar(inst, forcebreak)`
* **Description:** Forces the chesspiece into a `shadow` break state and starts struggle. Called in response to a `shadowchessroar` event.
* **Parameters:** `inst` (Entity); `forcebreak` (string).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `shadowchessroar` — triggers `OnShadowChessRoar`.
- **Pushes:** None directly.
- **Observes world state changes:** `isfullmoon`, `isnewmoon` — triggers `CheckMorph`.
- **Callbacks:** `OnSave` → stores `materialid`; `OnLoad` → restores material, disables moonevent logic for moonglass.