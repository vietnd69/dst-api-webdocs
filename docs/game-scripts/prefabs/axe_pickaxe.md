---
id: axe_pickaxe
title: Axe Pickaxe
description: A multitool item that functions as both an axe and a pickaxe, with limited durability and weapon capabilities.
tags: [tool, weapon, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7b175a9a
system_scope: inventory
---

# Axe Pickaxe

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `multitool_axe_pickaxe` prefab represents the in-game Axe Pickaxe item — a reusable multitool that combines chopping (tree斧) and mining (pickaxe⛏️) functionality. It uses the `tool`, `weapon`, `finiteuses`, and `equippable` components to handle durability, combat, and equip/unequip behavior. Tags like `"tool"`, `"weapon"`, `"sharp"`, and `"shadowlevel"` are added at creation for optimized runtime checks and compatibility with gameplay systems.

## Usage example
This is not a component but a prefab definition — it is instantiated via the `Prefab()` function and referenced in other prefabs or game logic. Example usage in a mod or override:
```lua
return Prefab("my_multitool", fn, assets)
```
Where `fn` is a modified version of the `fn()` constructor shown in the source.

## Dependencies & tags
**Components used:** `weapon`, `tool`, `finiteuses`, `equippable`, `inspectable`, `inventoryitem`, `shadowlevel`, `transform`, `animstate`, `soundemitter`, `network`
**Tags:** `"sharp"`, `"tool"`, `"weapon"`, `"shadowlevel"` — all added during initialization

## Properties
No public properties are initialized in the constructor. All state is managed internally through component APIs.

## Main functions
This file defines no public functions beyond the constructor `fn`. Internal helper functions `onequip` and `onunequip` are used only as callbacks.

### `fn()`
*   **Description:** Constructor function that creates and configures the Axe Pickaxe entity. It initializes all required components, assets, and animations, sets durability and efficiency values via `TUNING`, and applies tags for gameplay categorization.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — fully initialized prefab instance ready for placement in the world or inventory.
*   **Error states:** Returns early with no further setup if executed on a non-master simulation (`TheWorld.ismastersim == false`), preserving network consistency.

### `onequip(inst, owner)`
*   **Description:** Callback invoked when the item is equipped. Handles animation state overrides for equipped views (including skinned variants) and arm visibility.
*   **Parameters:**  
  `inst` (Entity) — the item instance.  
  `owner` (Entity) — the entity equipping the item.  
*   **Returns:** Nothing.
*   **Error states:** If no skin is present (`skin_build == nil`), only non-skin symbol overrides are applied.

### `onunequip(inst, owner)`
*   **Description:** Callback invoked when the item is unequipped. Restores default arm animation states and fires skin events if applicable.
*   **Parameters:**  
  `inst` (Entity)  
  `owner` (Entity)  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (event listeners are configured by components added, e.g., `equippable`).
- **Pushes:** `equipskinneditem`, `unequipskinneditem`, `percentusedchange` (via `finiteuses` component), `Remove` (via `onfinished` hook).