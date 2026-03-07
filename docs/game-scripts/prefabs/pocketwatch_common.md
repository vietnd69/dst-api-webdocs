---
id: pocketwatch_common
title: Pocketwatch Common
description: Provides shared prefab construction logic and recall-marking functionality for pocket watch items.
tags: [inventory, item, network, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bc760bb1
system_scope: inventory
---

# Pocketwatch Common

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketwatch_common.lua` is a shared helper module that defines two core functions for constructing and extending pocket watch prefabs. The `common_fn` function initializes the base structure for all pocket watch entities—setting up required components (`inventoryitem`, `rechargeable`, `pocketwatch`, `inspectable`), animations, physics, and tags. The `MakeRecallMarkable` function enhances an existing entity with recall-marking capabilities by adding the `recallmark` component and synchronizing marker visuals based on ownership and position state. This module centralizes common logic used across different pocket watch variants in the game.

## Usage example
```lua
local prefabs = require "prefabs/pocketwatch_common"

local function MyPocketWatch()
    local inst = prefabs.common_fn("bank_name", "build_name", DoCastSpell, true, {"mycustomtag"}, nil, nil)
    prefabs.MakeRecallMarkable(inst)
    return inst
end
```

## Dependencies & tags
**Components used:**  
- `inventoryitem` (via `inst.components.inventoryitem`)  
- `rechargeable` (via `inst.components.rechargeable`)  
- `pocketwatch` (via `inst.components.pocketwatch`)  
- `inspectable` (via `inst.components.inspectable`)  
- `recallmark` (via `inst.components.recallmark`, added by `MakeRecallMarkable`)

**Tags added by `common_fn`:**  
- `pocketwatch`  
- `cattoy`  
- `pocketwatch_castfrominventory` (only if `cast_from_inventory` is `true`)  
- Any custom tags passed via the `tags` array  

**Tags checked:**  
- `playerghost`  
- `pocketwatchcaster`  

## Properties
No public properties are exposed directly in the module's returned functions. Properties are set on the created `inst` entity within `common_fn` and `MakeRecallMarkable`, and are handled via component APIs.

## Main functions
### `common_fn(bank, build, DoCastSpell, cast_from_inventory, tags, common_postinit, master_postinit)`
*   **Description:** Constructs and configures a new pocket watch entity. Handles setup of basic entity structure (transform, anim state, sound, network), inventory physics, component registration, animation, and post-initialization callbacks for both client and master simulation.
*   **Parameters:**  
    - `bank` (string) – AnimState bank name for the item.  
    - `build` (string) – AnimState build name for the item.  
    - `DoCastSpell` (function) – Function assigned to `inst.components.pocketwatch.DoCastSpell`.  
    - `cast_from_inventory` (boolean) – If `true`, adds the `pocketwatch_castfrominventory` tag.  
    - `tags` (array of strings, optional) – Additional tags to apply.  
    - `common_postinit` (function, optional) – Callback run after common (non-master-only) setup, before returning for clients.  
    - `master_postinit` (function, optional) – Callback run after master-only setup (server-side).
*   **Returns:** `inst` – The fully initialized entity.
*   **Error states:** Returns early (without master setup) for non-master simulations (`TheWorld.ismastersim == false`).

### `MakeRecallMarkable(inst)`
*   **Description:** Adds recall-marking functionality to an existing entity. Attaches the `recallmark` component, sets up event listeners for ownership/dropping events, and manages the spawning and removal of a visual marker prefab (`pocketwatch_recall_marker`) when the item is held by a valid, non-ghost owner.
*   **Parameters:**  
    - `inst` (entity) – The entity to enhance with recall-marking capabilities.
*   **Returns:** Nothing.
*   **Error states:** Marker creation only proceeds if `recallmark:IsMarked()` is `true`, the marked position is on the same shard, and the grand owner exists and is not a ghost. Fails silently otherwise.

## Events & listeners
- **Listens to (in `MakeRecallMarkable`):**  
    - `onputininventory` – Triggers marker creation.  
    - `onownerputininventory` – Triggers marker creation.  
    - `ondropped` – Triggers marker removal.  
    - `onownerdropped` – Triggers marker removal.  
    - `onremove` – Triggers marker removal.  
    - `ms_respawnedfromghost` – Triggers marker recreation after player respawns (listens on grand owner).  
- **Pushes:** None directly. Relies on `recallmark` component’s `onMarkPosition` callback and event-driven marker lifecycle.

