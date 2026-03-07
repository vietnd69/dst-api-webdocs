---
id: wagstaff_items
title: Wagstaff Items
description: "Defines prefabs for two wearable decorative items used by Wagstaff: a glove and a clipboard."
tags: [inventory, decoration, character, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 757300fc
system_scope: inventory
---

# Wagstaff Items

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines reusable prefab factory logic for Wagstaff's personal decorative items — specifically the glove (`wagstaff_item_1`) and clipboard (`wagstaff_item_2`). Each item is an inventory-compatible entity with animation state, network synchronization, and optional ornament functionality (e.g., supporting an FX clone for visual effects in the hermit's house). Items are characterized by their unique animation bank and build name (`"wagstaff_personal_items"`), and are tagged for identification and categorization.

## Usage example
```lua
local wagstaff_glove = GoToState("wagstaff_item_1")
local item = SpawnPrefab("wagstaff_item_1")
item:AddComponent("equippable")
item.components.equippable:SetEquipLocation("hands")
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `hauntablelaunch`
**Tags:** Adds `"wagstaff_item"` to all items; conditionally adds `"hermithouse_ornament"` when `info.isornament` is true.

## Properties
No public properties

## Main functions
### `MakeItem(info)`
* **Description:** Factory function that constructs and returns a new `Prefab` definition for a Wagstaff item. It configures the entity's transform, animation, physics, inventory, and optionally sets ornament-specific behavior.
* **Parameters:** `info` (table) - Configuration table with keys:
  - `name` (string) – The prefab name (e.g., `"wagstaff_item_1"`)
  - `anim` (string) – Animation bank animation to play on creation (e.g., `"glove1"`)
  - `isornament` (boolean) – If `true`, enables ornament behavior and FX cloning
* **Returns:** `Prefab` – A fully configured prefab definition.
* **Error states:** None documented; assumes `info.name`, `info.anim`, and `info.isornament` are correctly specified.

### `CloneAsFx(inst)`
* **Description:** Helper function that spawns an `hermithouse_ornament_fx` prefab and configures its animation bank and build to match the calling item. Used exclusively by ornament-type items to render visual effects in the hermit’s house.
* **Parameters:** `inst` (Entity) – The item instance requesting the FX clone.
* **Returns:** `Entity` – The spawned FX entity with matching animation settings.
* **Error states:** None documented; assumes `"hermithouse_ornament_fx"` prefab exists.

## Events & listeners
None identified