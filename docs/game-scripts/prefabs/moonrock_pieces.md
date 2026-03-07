---
id: moonrock_pieces
title: Moonrock Pieces
description: Represents a destructible rock fragment that spawns when breaking moon rock structures and destroys itself upon completion of the mine action.
tags: [world, environment, destructible]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ea309e18
system_scope: environment
---

# Moonrock Pieces

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonrock_pieces` is a simple world object prefab representing scattered fragments of moon rock. It is created when larger moon rock structures (e.g., `moonrock`) are mined. The prefab uses the `workable` component to define its mineability, sets its animation to a randomly selected piece variant, and self-destroys after the mining operation finishes, spawning a particle effect (`rock_break_fx`) in its place. It does not function as a standalone entity but exists solely as a temporary byproduct of environment destruction.

## Usage example
This prefab is not manually instantiated by modders. It is spawned internally by the game when breaking moon rock structures, as seen in the `onworkfinished` callback of the parent structure's workable component.

## Dependencies & tags
**Components used:** `workable`, `inspectable`, `hauntable` (via `MakeHauntableWork`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `piece` | number or `nil` | `nil` | Identifier for the variant of the rock piece (1–`NUM_MOONROCK_PIECES`). Set on first load or random assignment. |

## Main functions
### `setpiecetype(inst, piece)`
*   **Description:** Assigns a random or specified variant number to `inst.piece` and plays the corresponding animation (`"s" .. piece`). Only updates if `inst.piece` is `nil` or a new `piece` is explicitly provided and differs.
*   **Parameters:** 
    * `inst` (Entity) — The entity instance.
    * `piece` (number or `nil`) — Optional explicit piece ID. If `nil`, defaults to a random integer in `[1, NUM_MOONROCK_PIECES]`.
*   **Returns:** Nothing.

### `onworkfinished(inst)`
*   **Description:** Final callback invoked when the `workable` component completes a mine action. Spawns the `rock_break_fx` prefab at the piece’s world position and immediately removes the `moonrock_pieces` entity.
*   **Parameters:** 
    * `inst` (Entity) — The entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.