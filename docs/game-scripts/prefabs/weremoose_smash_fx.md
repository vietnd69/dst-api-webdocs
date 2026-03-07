---
id: weremoose_smash_fx
title: Weremoose Smash Fx
description: Spawns client-side visual effects (front and back animations) for the Weremoose's slam attack.
tags: [fx, visual, attack]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cec55286
system_scope: fx
---

# Weremoose Smash Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`weremoose_smash_fx` is a lightweight prefab that visualizes the Weremoose's slam attack. It creates a two-part FX entity: a front animation (master/authoritative) and a back animation (spawned locally on clients). The component handles client-side prediction logic to prevent duplication when the owner is locally simulated and cleans up the entity once its animation finishes. It is non-persistent and only used for rendering, not game logic.

## Usage example
This prefab is automatically instantiated by the Weremoose's attack logic and is not meant to be manually added. However, its usage in context would look like:
```lua
-- The Weremoose prefab or related combat logic would spawn this FX:
inst:PushEvent("smash_fx")
-- Internally, this triggers the spawning of the weremoose_smash_fx prefab
-- via SpawnPrefab("weremoose_smash_fx") with appropriate parent/position setup.
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX`; checks for `ThePlayer` and `TheNet:IsDedicated()` to determine FX behavior.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_owner` | `net_entity` | `nil` (set via constructor) | Networked reference to the Weremoose owner entity; used for prediction logic. |

## Main functions
### `AddBackFX(parent)`
*   **Description:** Creates and returns a secondary FX entity showing the back-swing animation, parented to the provided `parent` (typically the main FX instance). Runs on the client during initial setup.
*   **Parameters:** `parent` (Entity) — the main FX entity that owns this back effect.
*   **Returns:** Entity — the newly created back FX entity.
*   **Error states:** None.

### `OnOwnerDirty(inst)`
*   **Description:** Client-side event handler that hides the FX if the owner switches to the local player (local prediction case).
*   **Parameters:** `inst` (Entity) — the FX entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ownerdirty` — triggered when the network owner changes, used to avoid duplicate FX during prediction.
- **Listens to:** `animover` — fired when the front animation completes, triggers `inst.Remove`.
- **Pushes:** None.