---
id: webber_spider_minions
title: Webber Spider Minions
description: Defines the asset and initialization logic for Webber's spider minion prefabs in DST, including physics, animation, sound, and network properties.
tags: [spider, npc, minion, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bcd3ba68
system_scope: entity
---

# Webber Spider Minions

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines the `webber_spider_minion` prefab, a type of NPC that serves as Webber's spider minions. It handles asset loading (animations, sounds), entity creation, and initial setup such as physics, animation bank, build, and dynamic shadow configuration. For server-side execution (`TheWorld.ismastersim`), it delegates to an external `master_postinit` function located in `event_server_data("lavaarena", "prefabs/webber_spider_minions")`, indicating this prefab is primarily used in the Lava Arena event. It does not contain core logic itself but sets up the foundational entity properties.

## Usage example
```lua
-- The prefab is instantiated automatically via the game's prefab system:
-- local minion = Prefab("webber_spider_minion", fn, assets, prefabs)
-- Minions are typically spawned programmatically in Lava Arena scenarios
-- using SpawnPrefab("webber_spider_minion") and configured further via scripts.
```

## Dependencies & tags
**Components used:** None identified (uses `MakeCharacterPhysics`, `TheWorld`, `event_server_data`, and core engine functions, but no explicit component access).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `fn()`
*   **Description:** Factory function used by the `Prefab` constructor to instantiate and initialize the `webber_spider_minion` entity. Sets up visual and physics properties and delegates to `master_postinit` on the server.
*   **Parameters:** None (called internally by the Prefab system).
*   **Returns:** `inst` (Entity) — the initialized entity instance.
*   **Error states:** Returns early (before master setup) on clients when `TheWorld.ismastersim` is `false`.

### `master_postinit(inst)` (external)
*   **Description:** Resides in `event_server_data("lavaarena", "prefabs/webber_spider_minions")`. Initialized only on the server. Not part of this file's source, but is explicitly invoked by the `fn` function for master simulation.
*   **Parameters:** `inst` (Entity) — the entity returned by `fn`.
*   **Returns:** Nothing.
*   **Error states:** None documented (source not provided).

## Events & listeners
- **Pushes:** None identified in this file.
- **Listens to:** None identified in this file.

