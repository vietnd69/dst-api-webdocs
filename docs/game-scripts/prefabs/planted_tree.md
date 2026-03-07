---
id: planted_tree
title: Planted Tree
description: Provides shared logic and factory functions for sapling prefabs that grow into trees after a timed period, with support for digging to harvest early.
tags: [plant, growth, loot, timer]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f1291734
system_scope: entity
---

# Planted Tree

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `planted_tree` prefabs define a family of sapling entities (e.g., `pinecone_sapling`, `acorn_sapling`) that function as timed growth vehicles. Each sapling starts a timer upon creation and spawns the appropriate mature tree when the timer expires. If dug up early via the `DIG` action, it drops loot and removes itself. This is implemented via reusable logic in `sapling_fn`, a factory function that configures shared components (`timer`, `lootdropper`, `workable`, `burnable`, etc.) and event handlers for each specific sapling type.

## Usage example
While users interact with the individual sapling prefabs (e.g., `acorn_sapling`), modders can replicate the pattern by creating a new entity and attaching the core components manually:
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()

inst:AddComponent("timer")
inst:AddComponent("lootdropper")
inst:AddComponent("workable")

inst.components.lootdropper:SetLoot({ "acorn" })
inst.components.workable:SetWorkAction(ACTIONS.DIG)
inst.components.workable:SetOnFinishCallback(function() ... end)
inst.components.workable:SetWorkLeft(1)

-- Later, start growth:
inst.growprefab = "deciduoustree"
inst.growtimes = { base = 1800, random = 300 }
inst:StartGrowing() -- see StartGrowing closure defined in sapling_fn
```

## Dependencies & tags
**Components used:** `timer`, `lootdropper`, `workable`, `inspectable`, `burnable`, `propagator`, `waxable`, `hauntable`.
**Tags added:** `plant` (unless fireproof), and a type-specific tag (e.g., `evergreen`, `deciduoustree`, `treerock`). Non-fireproof saplings also inherit fire propagation behavior.

## Properties
No public instance properties are defined on the component itself; the factory function `sapling_fn` returns a `Prefab` definition that sets up entity properties in its `fn()` closure. Properties like `growprefab`, `growtimes`, and `StartGrowing` are attached directly to the instance (`inst`) within the `fn()` body.

## Main functions
The `planted_tree` source contains no reusable component class. Instead, it defines internal helper functions used by `sapling_fn` to configure prefabs.

### `startgrowing(inst)`
*   **Description:** Starts the growth timer on the sapling. If a `"grow"` timer already exists, it does nothing.
*   **Parameters:** `inst` (Entity) — the sapling entity.
*   **Returns:** Nothing.
*   **Error states:** If `inst.growtimes` is missing, falls back to global `TUNING.PINECONE_GROWTIME`.

### `stopgrowing(inst)`
*   **Description:** Immediately cancels the `"grow"` timer if it exists.
*   **Parameters:** `inst` (Entity) — the sapling entity.
*   **Returns:** Nothing.

### `growtree(inst)`
*   **Description:** Spawns the configured mature tree prefab at the sapling's location, calls `growfromseed()` on it, and removes the sapling.
*   **Parameters:** `inst` (Entity) — the sapling entity.
*   **Returns:** Nothing.

### `digup(inst, digger)`
*   **Description:** Called when the sapling is dug up. Drops loot (via `lootdropper`) and removes the entity.
*   **Parameters:** `inst` (Entity) — the sapling entity. `digger` (Entity) — the entity performing the dig action (unused).
*   **Returns:** Nothing.

### `sapling_fn(build, anim, growprefab, tag, fireproof, overrideloot, override_deploy_smart_radius, grow_times)`
*   **Description:** A factory function returning a closure that constructs a fully configured sapling entity prefab. Accepts parameters to customize visual assets, growth target, tag, loot, fire properties, and growth timing.
*   **Parameters:**
    *   `build` (string) — anim build name (e.g., `"acorn"`).
    *   `anim` (string) — initial animation (e.g., `"idle_planted"`).
    *   `growprefab` (string or table) — target tree prefab or table of possible tree prefabs.
    *   `tag` (string) — tag to add to the sapling (e.g., `"deciduoustree"`).
    *   `fireproof` (boolean or `nil`) — if `true`, skips fire-related components; otherwise `false`.
    *   `overrideloot` (table or `nil`) — custom loot table; defaults to `{"twigs"}`.
    *   `override_deploy_smart_radius` (number or `nil`) — custom deployment radius for placement.
    *   `grow_times` (table or `nil`) — custom `{base, random}` timing for growth.
*   **Returns:** A closure (function) that returns a configured `Entity` instance.
*   **Error states:** If `growprefab` is a table, a random item is selected during `growtree()`.

## Events & listeners
- **Listens to:** `timerdone` — triggers `growtree()` if the timer name is `"grow"`.
- **Listens to (non-fireproof only):** `onignite` (calls `stopgrowing`) and `onextinguish` (calls `startgrowing`).
- **Pushes:** None directly. Relies on component events like `entity_droploot` (from `lootdropper`).
