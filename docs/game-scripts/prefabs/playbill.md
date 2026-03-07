---
id: playbill
title: Playbill
description: A prefab factory that generates playable bill-related entities with associated costumes, scripts, and burnable properties for DST's theatre minigame.
tags: [theatre, inventory, furniture, burning]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 192148a1
system_scope: entity
---

# Playbill

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `playbill` file defines a factory function `makeplay` that constructs distinctPrefab instances for various acts (e.g., *The Doll*, *The Veil*, *The Vault*, *The Princess*). Each generated entity functions as an inventory item representing a playbill in the game, which also serves as furniture and fuel when unopened. The resulting prefabs integrate with the `playbill` component (defined in `scripts/play_*.lua` files), `fuel`, `inventoryitem`, `furnituredecor`, `inspectable`, and `tradable` components.

The system relies on external `play_*.lua` files (e.g., `scripts/play_the_doll.lua`) for act-specific data such as costumes and scripts. Burn behavior can be disabled per act using the `noburn` flag.

## Usage example
```lua
-- Internally used by DST to generate prefabs for theatre acts
-- Typical consumption is via the returned Prefab objects:
-- local the_doll_bill = Prefab("playbill_the_doll", ...)
-- local the_vault_bill = Prefab("playbill_the_vault", ...)

-- Usage in modding usually involves referencing the generated prefabs directly:
local bill = TheWorld:PushEvent("spawnprefab", { prefabs = { "playbill_the_doll" } })
bill.components.inventoryitem:Equip()
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `follower`, `network`, `inventoryitem`, `furnituredecor`, `inspectable`, `tradable`, `fuel`, `playbill` (added via `inst:AddComponent("playbill")`)  
**Tags:** `playbill`, `furnituredecor`  

## Properties
No public properties are defined in this file itself. Properties are set on the `inst.components.playbill` object within the `fn()` constructor (see Main functions), and depend on the loaded `play_*.lua` data.

## Main functions
### `makeplay(name, _assets, prefabs, data)`
* **Description:** Factory function that creates a Prefab for a specific playbill. It configures the entity's visual assets, animations, tags, components, and fuel/burn behavior based on the provided `name` and optional `data`.
* **Parameters:**
  * `name` (string) – Identifier used to load the corresponding `play_*.lua` script and name the prefab (e.g., `"the_doll"` → `"playbill_the_doll"`).
  * `_assets` (table of Asset) – List of assets (ANIM, INV_IMAGE) to include.
  * `prefabs` (table of string) – List of dependent prefabs to spawn (e.g., `"marionette_appear_fx"`).
  * `data` (table, optional) – Configuration table supporting keys:
    * `build` (string) – AnimState build name (defaults to `"playbill"`).
    * `lectern_book_build` (string, optional) – Value assigned to `inst.components.playbill.book_build`.
    * `noburn` (boolean, optional) – If truthy, disables fuel/burn behavior.
* **Returns:** `Prefab` – A prefabricated entity constructor function for `makeplay(...)` to be used in game setup.
* **Error states:** Not applicable for normal operation; errors may occur if the required `play_*.lua` script or assets are missing.

### `fn()` (inner constructor)
* **Description:** The actual prefab instantiation function passed to `Prefab(...)`. Sets up the entity’s transform, animation, physics, and components.
* **Parameters:** None (called internally by the Prefab system).
* **Returns:** `inst` (Entity) – Fully initialized entity instance.
* **Error states:** May fail if required assets or scripts are missing; client-only early return prevents crashes during world loading.

## Events & listeners
This file does not register or push events directly. However:
- `inst:PushEvent("imagechange")` is invoked by the `inventoryitem` component when `ChangeImageName(build)` is called (see `connected files`).
- Event-driven behavior (e.g., marionette appearance) is handled in the `playbill` component (`scripts/play_*.lua`) and related FX prefabs, not in this file.