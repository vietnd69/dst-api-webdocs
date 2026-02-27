---
id: skeletonsweeper
title: Skeletonsweeper
description: Manages a collection of player-placed skeletons and automatically removes the oldest ones when the count exceeds the configured maximum.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 52d704d6
---

# Skeletonsweeper

## Overview
This component tracks player-placed skeletons on the master simulation, maintains them in age-descending order, and enforces a maximum cap (`TUNING.MAX_PLAYER_SKELETONS`) by removing or decaying the oldest skeletons when the threshold is exceeded. It responds to skeleton spawn events, enables/disables itself dynamically, and performs cleanup during post-initialization.

## Dependencies & Tags
- `TheWorld.ismastersim` — Enforces exclusive existence on the master simulation (clients cannot instantiate this component).
- Listens to events:
  - `ms_skeletonspawn` — Broadcast when a new skeleton is placed.
  - `ms_enableskeletonsweeper` — Broadcast to toggle sweeping behavior.
- Removes event callbacks for `onremove` on skeleton entities it has previously tracked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *N/A* | Reference to the owning entity (typically the player). |
| `_enabled` | `boolean` | `true` | Controls whether the sweeper actively manages skeletons. |
| `_nosweep` | `boolean` | `true` initially, then `nil` | Flag preventing sweeps during initialization; cleared on `OnPostInit`. |
| `_skeletons` | `table` | `{}` | Ordered list of tracked skeleton entities (newest at end, oldest at index 1). |

## Main Functions

### `Sweep(max_to_keep, no_decay)`
* **Description:** Removes or decays skeletons until the collection size is ≤ `max_to_keep`. Skeletons are removed in age-descending order (oldest first). If `no_decay` is true or the skeleton lacks a `Decay` method, the skeleton is removed directly; otherwise, `Decay()` is invoked.
* **Parameters:**
  - `max_to_keep` (*number?*): Maximum number of skeletons to retain. Defaults to `TUNING.MAX_PLAYER_SKELETONS`.
  - `no_decay` (*boolean?*): If `true`, skeletons are removed outright instead of decaying.

### `OnPostInit()`
* **Description:** Called after full initialization. Disables the `_nosweep` restriction and triggers a sweep if enabled, ensuring the skeleton count complies with the cap.

## Events & Listeners
- Listens to `ms_skeletonspawn(inst, skeleton)` → Adds skeleton to `_skeletons`, subscribes to its `onremove` event, and triggers a sweep if enabled and not post-init-blocked.
- Listens to `ms_enableskeletonsweeper(inst, enable)` → Updates `_enabled`, and if newly enabled, triggers a sweep.
- Listens to `onremove(skeleton)` on each tracked skeleton → Removes the skeleton from `_skeletons` when it is destroyed externally.