---
id: graveurn
title: Graveurn
description: A deployable graveurn item that, when used as a grave digger, saves gravestone data and spawns a linked gravestone upon deployment.
tags: [inventory, deployable, grave, wendy]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 04c23d61
system_scope: inventory
---

# Graveurn

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`graveurn` is an inventory item prefab that functions as a *grave digger* tool for Wendy. It can be used on an existing gravestone to record its state (e.g., stone variant, mound dig status, skin) into the `graveurn`'s internal `_grave_record`. When deployed (e.g., via the deployable action), it spawns a new gravestone with that saved state. It integrates with the `gravedigger`, `deployable`, `inspectable`, `inventoryitem`, and `placer` systems.

## Usage example
```lua
-- Adding the graveurn component to an entity (handled internally by the prefab)
local inst = Prefab("graveurn", fn, assets)

-- The graveurn is typically obtained and used via Wendy's build menu.
-- When a player uses it on a gravestone, it records data and changes image.
-- When deployed, it spawns a matching gravestone at the target location.
```

## Dependencies & tags
**Components used:** `gravedigger`, `deployable`, `inspectable`, `inventoryitem`, `placer`, `upgradeable`  
**Tags:** `graveplanter`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_grave_record` | table or `nil` | `nil` | Stores gravestone data (e.g., `skinname`, `data.stone_index`, `data.mounddata`) from a previously dug grave. |
| `_placer_netvars` | table | Table of network variables | Holds replicated values (`graveskin`, `graveid`, `ismounddug`) synced when the graveurn is placed as a builder. |
| `_mound` | Entity or `nil` | `nil` | Local non-networked mound entity used as visual sub-entity during placement (placer mode). |
| `funnyidletask` | Task or `nil` | `nil` | Task reference for periodic idle animations. |

## Main functions
### `DoFunnyIdle(inst)`
*   **Description:** Triggers one of three randomized idle animations on the graveurn’s animation state.
*   **Parameters:** `inst` (Entity) — the graveurn instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `SetPlacerNetVars(inst)`
*   **Description:** Copies saved gravestone state (skin, stone ID, mound dig status) into the placer network variables (`_placer_netvars`) for client-side placement preview.
*   **Parameters:** `inst` (Entity) — the graveurn instance.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `_grave_record` is `nil`.

### `SetGraveSaveData(inst, savedata)`
*   **Description:** Applies grave data (from `savedata`) to the graveurn, updates its image, removes the `gravedigger` component, adds the `deployable` component, and sets up sleep/wake callbacks.
*   **Parameters:**  
  - `inst` (Entity) — the graveurn instance.  
  - `savedata` (table) — gravestone record (e.g., output of `GetSaveRecord()` on a gravestone).  
*   **Returns:** Nothing.

### `OnDeployed(inst, pt, deployer)`
*   **Description:** Spawns a new gravestone with the saved record (or default `gravestone` prefab if none), places it at `pt`, and removes the graveurn.
*   **Parameters:**  
  - `inst` (Entity) — the graveurn instance.  
  - `pt` (Vector3) — deployment position.  
  - `deployer` (Entity or `nil`) — the entity placing the graveurn.  
*   **Returns:** Nothing.

### `OnGraveDiggerUsed(inst, user, target)`
*   **Description:** Called when the graveurn is used on a target gravestone. Records the gravestone’s data, and if the gravestone is upgraded, may drop petals (via luck roll).
*   **Parameters:**  
  - `inst` (Entity) — the graveurn instance.  
  - `user` (Entity) — the player using the graveurn.  
  - `target` (Entity) — the target gravestone.  
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns `"HAS_SPIRIT"` if `_grave_record` is non-`nil`, otherwise `nil`.
*   **Parameters:** `inst` (Entity) — the graveurn instance.
*   **Returns:** `"HAS_SPIRIT"` (string) or `nil`.

### `Placer_OnSetBuilder(inst)`
*   **Description:** For placer mode: applies skin, grave ID, and mound dig status from network variables to the newly placed gravestone preview entity.
*   **Parameters:** `inst` (Entity) — the *placed* gravestone instance (not the graveurn).
*   **Returns:** Nothing.

### `CreateMoundPlacer()`
*   **Description:** Creates a non-networked `mound` sub-entity used to visually represent a dug mound during placement preview.
*   **Parameters:** None.
*   **Returns:** Entity — mound entity with `"gravedirt"` animation and `"CLASSIFIED"`, `"NOCLICK"`, `"placer"` tags.

### `PlacerPostinit(inst)`
*   **Description:** Initializes the placer: hides the `"flower"` prop, assigns `onbuilderset`, and attaches the mound entity as a child.
*   **Parameters:** `inst` (Entity) — the *placer* graveurn instance (used as a build tool).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"exitlimbo"` — resumes idle animations (via `OnEntityWake`).  
  - `"enterlimbo"` — cancels idle animations and sets idle animation to `"idle_empty"` (via `OnEntitySleep`).  
- **Pushes:**  
  - None (uses callbacks like `inst.OnSave`, `inst.OnLoad`, and component hooks instead).