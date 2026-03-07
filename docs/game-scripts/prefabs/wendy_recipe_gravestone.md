---
id: wendy_recipe_gravestone
title: Wendy Recipe Gravestone
description: Acts as an intermediate placeholder prefab used to spawn Wendy’s gravestone, supporting ghost skeleton snapping, writing, and transition to the final gravestone prefab.
tags: [wip, placement, writing, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 782008df
system_scope: entity
---

# Wendy Recipe Gravestone

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines two prefabs: `wendy_recipe_gravestone`, a transient entity used during placement to enable ghost skeleton snapping and writing, and `wendy_recipe_gravestone_placer`, a placer helper used to control snapping behavior. The `wendy_recipe_gravestone` entity coordinates with the `writeable`, `inspectable`, and `placer` components to accept player input, allow epitaph inscription, snap to nearby ghost skeletons, and convert into the final `gravestone` prefab upon writing completion.

## Usage example
```lua
-- Place the gravestone at a location with valid snapping targets (skeletons)
local inst = SpawnPrefab("wendy_recipe_gravestone")
-- Writing completes the transition to gravestone automatically
-- The placer variant is used internally via MakePlacer()
```

## Dependencies & tags
**Components used:** `writeable`, `placer`, `inspectable`, `animstate`, `transform`, `soundemitter` (indirect via gravestone spawn), `network`
**Tags added:** `NOCLICK`, `CLASSIFIED` (on mound placer), `placer` (on mound), `_writeable` (temporary, removed after replication)
**Tags checked:** `skeleton`, `skeleton_standin`

## Properties
No public properties are defined on the `wendy_recipe_gravestone` entity itself. Internal state (`_accept_placement`, `_mound`) is used by the placer variant.

## Main functions
### `OnProxyBuilt(inst, data)`
*   **Description:** Callback triggered when the entity is built in the world (typically via the placer). Validates builder presence and starts the writing interaction.
*   **Parameters:** `inst` (Entity), `data` (table containing `builder` — a player entity). If `data.builder` is missing, removes the entity.
*   **Returns:** Nothing.

### `OnWritingEnded(inst)`
*   **Description:** Called when the player finishes writing on the gravestone. Handles snapping to nearby skeletons, removing them, spawning the visual `attune_out_fx`, creating the final `gravestone` prefab, setting epitaph text (if any), and deleting itself.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Early exit if `writeable` component is missing.

### `wendy_recipe_gravestone_fn()`
*   **Description:** The constructor for the `wendy_recipe_gravestone` entity. Sets up core entities and components, enables writeable mode, and registers the `onbuilt` event listener.
*   **Parameters:** None.
*   **Returns:** Entity with `writeable`, `placer` (indirect), `inspectable` (added on master), and networked transform/animstate. Runs differently on master vs client.

### `wendy_placer_onupdatetransform(inst)`
*   **Description:** Custom transform update callback for the placer variant. Snaps the placer to the nearest `skeleton` or `skeleton_standin` within `WENDY_PLACER_SNAP_DISTANCE`.
*   **Parameters:** `inst` (Entity) — the placer instance.
*   **Returns:** Nothing. Updates `_accept_placement` flag and entity position.

### `wendy_placer_override_testfn(inst)`
*   **Description:** Overrides the default placer testfn to honor the snapped position, ensuring mouse-based placement respects ghost snapping behavior.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `accept_placement` (boolean), `mouse_blocked` (boolean).

## Events & listeners
- **Listens to:** `onbuilt` — triggers `OnProxyBuilt` to initiate writing upon placement.
- **Pushes:** None directly (entity is removed at end of `OnWritingEnded`).