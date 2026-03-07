---
id: quagmire_key
title: Quagmire Key
description: Prefab factory function for creating quagmire-specific keys used to lock and unlock Klaus Sacks.
tags: [inventory, loot, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e4587060
system_scope: inventory
---

# Quagmire Key

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_key` is a prefab factory script that defines reusable key entities for the Quagmire DLC. It creates two distinct key prefabs (`quagmire_key` and `quagmire_key_park`) by calling the `MakeKey` helper with different animation states. Each key is an inventory item with network sync, transform, animation state, and physics components. Keys are tagged `irreplaceable` and `klaussackkey` to prevent crafting duplication and to signal compatibility with Klaus Sacks.

## Usage example
```lua
-- Creates an instance of the base Quagmire key
local key = SpawnPrefabs["quagmire_key"]()

-- Creates an instance of the Park key (special variant)
local park_key = SpawnPrefabs["quagmire_key_park"]()
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryitem` (via `MakeInventoryPhysics`)
**Tags:** Adds `irreplaceable`, `klaussackkey`

## Properties
No public properties

## Main functions
### `MakeKey(name, anim)`
* **Description:** Factory function that constructs and returns a prefab definition for a Quagmire key. Configures the entity with required components, animation, tags, and network behavior.
* **Parameters:**
  * `name` (string) — The unique prefab name (e.g., `"quagmire_key"`).
  * `anim` (string) — The animation state to play on spawn (e.g., `"safe_key"`, `"park_key"`).
* **Returns:** `Prefab` — A prefab definition suitable for registration in the game’s prefabs table.
* **Error states:** If called on a client (`TheWorld.ismastersim == false`), `master_postinit` is skipped; server-side behavior relies on `master_postinit` for further initialization.

## Events & listeners
None identified