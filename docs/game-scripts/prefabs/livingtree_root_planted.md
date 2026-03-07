---
id: livingtree_root_planted
title: Livingtree root planted
description: A planted living tree seed that grows over two stages into a harvestable sapling, which then transforms into a livingtree_halloween upon growth completion.
tags: [plant, growth, halloween, loot, workable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b855979f
system_scope: entity
---

# Livingtree root planted

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`livingtree_root_planted` is a growth-enabled prefab that functions as a planted seed. It uses the `growable` component to advance through two timed growth stages before triggering a one-time transformation into `livingtree_halloween`. It is also `workable` (diggable), `lootdropper`-enabled, burnable, and hauntable. The prefab is active only during the HALLOWED_NIGHTS event, as its eye visual is hidden otherwise.

## Usage example
```lua
local inst = SpawnPrefab("livingtree_sapling")
if inst then
    -- The prefab is fully constructed in its default fn, so no further setup is needed.
    -- It will automatically begin growing in stage 1 and progress through stages.
    -- Players can dig it using the DIG action before it completes growth.
end
```

## Dependencies & tags
**Components used:** `growable`, `inspectable`, `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`
**Tags:** Adds `plant`.

## Properties
No public properties.

## Main functions
### `digup(inst, digger)`
*   **Description:** Called when a player finishes digging the planted root. Drops loot (currently `livingtree_root`) and removes the entity.
*   **Parameters:**  
    `inst` (Entity) — the planted root instance.  
    `digger` (Entity) — the digger performing the action.
*   **Returns:** Nothing.

### `growtree(inst)`
*   **Description:** Final growth transition callback. Spawns `livingtree_halloween` at the root’s position, triggers `growfromseed()` on the new tree, and removes the root.
*   **Parameters:**  
    `inst` (Entity) — the planted root instance about to be removed.
*   **Returns:** Nothing.

### `SetGrowth(inst, anim)`
*   **Description:** Helper to set and play a specific animation on the entity.
*   **Parameters:**  
    `inst` (Entity) — the planted root instance.  
    `anim` (string) — animation name to play (e.g., `"idle_planted_flask"`).
*   **Returns:** Nothing.

### `DoGrow(inst)`
*   **Description:** Plays the "burst" animation, emits a grow sound, and then transitions to the `"idle_planted"` animation loop. Called between growth stages.
*   **Parameters:**  
    `inst` (Entity) — the planted root instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `entity_droploot` — implicitly via `lootdropper:DropLoot()`.

Note: `inst:PushEvent("entity_droploot", ...)` is called inside `LootDropper:DropLoot`, not directly in this file.
