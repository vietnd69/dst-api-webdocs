---
id: hermitcrab_relocation_manager
title: Hermitcrab Relocation Manager
description: Manages the placement, orientation, and teleportation of hermitcrab-related entities during monkeyisland set-piece initialization in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d9f1d9c6
---

# Hermitcrab Relocation Manager

## Overview
This component orchestrates the precise positioning and movement of hermitcrab-related entities—including houses, markers, and the hermitcrab itself—when the Monkey Island set-piece is loaded. It calculates world-space rotation based on relative positions of `monkeyqueen` and `monkeyportal`, applies transformations to static layout data, and handles the teleportation sequence of all registered pearl entities (including the hermitcrab) to their final positions in the set-piece arena.

## Dependencies & Tags
- **Dependencies**:
  - `TheWorld` (must be `ismastersim`)
  - `TheWorld.Map` (for tile center calculations)
- **Tags**: None explicitly added or removed on `inst`.
- **Events Listened For**:
  - `ms_register_hermitcrab`
  - `ms_register_pearl_entity`
  - `ms_register_monkeyisland_portal`
  - `ms_register_monkeyqueen`
  - `ms_hermitcrab_wants_to_teleport`
- **Events Pushed**:
  - `teleported` (on each entity after teleport completes)
  - `teleport_move` (on entity just before teleport)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PEARLSETPIECE_MONKEYISLAND` | `table` | (shared constant) | Predefined static layout mapping prefabs to relative x, z, rot coordinates for Monkey Island. |
| `pearlsentities` | `table` | `{}` | Map of registered pearl entities (keys = entities, values = `true`). |
| `hermitcrab` | `Entity` | `nil` | Reference to the hermitcrab entity (if present in world). |
| `monkeyqueen` | `Entity` | `nil` | Reference to the `monkeyqueen` entity used for rotation calculation. |
| `monkeyportal` | `Entity` | `nil` | Reference to the `monkeyportal` entity used for rotation calculation. |
| `storedangle_monkey` | `number` | `nil` | Calculated rotation angle (in degrees) of Monkey Island relative to world north. |
| `storedx_monkey`, `storedz_monkey` | `number` | `nil` | Tile-centered world coordinates used as the set-piece origin for placement. |
| `pearlmovingdata` | `table` | `nil` (or `{}` during move) | Maps each teleporting entity to its movement data (`x`, `z`, `rot`, `delay`, `fxprefab`, `isinlimbo`). |
| `appliedrotationtransformation` | `boolean` | `false` | Flag indicating whether rotation transformation has been applied to layout data. |
| `initiatedpearlmove` | `boolean` | `false` | Flag indicating whether a teleport sequence has been started. |
| `failed` | `boolean` | `false` | Flag indicating failure due to missing or duplicate key entities (e.g., multiple monkeyqueens). |

## Main Functions

### `:TryToApplyRotationTransformation()`
* **Description:** Determines the world-space rotation of Monkey Island using `monkeyqueen` and `monkeyportal`, applies the computed transformation to the static layout data, and returns success/failure. Ensures rotation is computed only once and layout data is transformed in-place.
* **Parameters:** None.

### `:ApplyAllRotationTransformations()`
* **Description:** Applies the stored rotation transformation to every entry in `PEARLSETPIECE_MONKEYISLAND` using `:ApplyRotationTransformation_Monkey`. Cleans up event listeners after completion.
* **Parameters:** None.

### `:ApplyRotationTransformation_Monkey(data)`
* **Description:** Mutates the `data` table (array of `{x, z, rot}`) in-place to account for the stored rotation angle (`self.storedangle_monkey`). Applies discrete rotations/flips based on angle ranges (±180° intervals in 45° steps).
* **Parameters:**  
  - `data`: Table of `{x, z, rot}` triplets to transform.

### `:SetSetupTeleportingPearlToSetPieceData(setpiecedata, centerx, centerz)`
* **Description:** Sets up teleportation data for all pearl entities (houses, markers, hermitcrab, etc.) using the transformed set-piece layout. Initiates teleport sequence after caching movement data.
* **Parameters:**  
  - `setpiecedata`: Layout data (e.g., `PEARLSETPIECE_MONKEYISLAND`).  
  - `centerx`, `centerz`: World-space origin for placement (tile-centered).  

### `:InitiatePearlTeleport()`
* **Description:** Starts the teleport sequence for all entities in `pearlmovingdata`. Uses step-wise tasks (`Disappear → Teleport → Appear → Arrive`) to smoothly transition entities, including visual FX. Fires `ms_hermitcrab_relocated` when complete.
* **Parameters:** None.

### `:CanPearlMove()`
* **Description:** Checks whether a teleport sequence is already in progress (i.e., `pearlmovingdata` is non-`nil`).
* **Parameters:** None.  
* **Returns:** `true` if no teleport is in progress; `false` otherwise.

### `:SetupMovingPearlToMonkeyIsland()`
* **Description:** Convenience wrapper calling `:SetupTeleportingPearlToSetPieceData(...)` with the default Monkey Island layout and stored origin.
* **Parameters:** None.

### `:GetPearl()`, `:GetPearlsHouse()`, `:GetPearlsFishingMarkers()`
* **Description:** Getter helpers to retrieve key entities:
  - `:GetPearl()` → returns `hermitcrab` entity.
  - `:GetPearlsHouse()` → returns first found house (prefabs: `"hermithouse2"`, `"hermithouse"`, `"hermithouse_construction3"`, etc.).
  - `:GetPearlsFishingMarkers()` → returns list of `"hermitcrab_marker_fishing"` entities.

## Events & Listeners

- **Listens For**:
  - `"ms_register_hermitcrab"` → `:RegisterHermitCrab(ent)`
  - `"ms_register_pearl_entity"` → `:RegisterPearlEntity(ent)`
  - `"ms_register_monkeyisland_portal"` → `:RegisterMonkeyPortal(ent)`
  - `"ms_register_monkeyqueen"` → `:RegisterMonkeyQueen(ent)`
  - `"ms_hermitcrab_wants_to_teleport"` → conditionally calls `:InitiatePearlTeleport()`
  - `"onremove"` (on `monkeyqueen`, `monkeyportal`, and each `pearlentity`) → clears references.

- **Pushes**:
  - `"teleported"` → on entity after teleport finishes.
  - `"teleport_move"` → on entity just before moving.
  - `"ms_hermitcrab_relocated"` → on `TheWorld` when all teleport steps are complete.