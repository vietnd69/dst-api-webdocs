---
id: bandage
title: Bandage
description: A consumable small item that heals a fixed amount of health when used by a player.
tags: [consumable, healing, inventory, player]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e5ebd8ad
system_scope: inventory
---

# Bandage

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bandage` prefab represents a wearable/usable small-item that restores health when consumed. It is implemented as a simple entity with the `inventoryitem`, `stackable`, `healer`, and `inspectable` components. It is not a standalone component class but a prefab definition (`Prefab("bandage", fn, assets)`) intended for instantiation in the game world and inventory systems.

## Usage example
```lua
-- Spawn a bandage into the world
local bandage = SpawnPrefab("bandage")

-- Spawn a bandage into a player's inventory
local player = TheFrontEnd:GetMenuPlayer()
if player and player.components.inventory then
    player.components.inventory:GiveItem("bandage")
end

-- Modify healing amount (e.g., for a modded variant)
local custom_bandage = SpawnPrefab("bandage")
if custom_bandage and custom_bandage.components.healer then
    custom_bandage.components.healer:SetHealthAmount(50) -- Custom heal value
end
```

## Dependencies & tags
**Components used:** `stackable`, `healer`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `physics`, `floatable`, `hauntable_launch`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animstate.bank` | string | `"bandage"` | Animation bank name used for rendering. |
| `animstate.build` | string | `"bandage"` | Animation build name used for rendering. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `healer.health` | number | `TUNING.HEALING_MEDLARGE` | Amount of health restored on use. |

## Main functions
### `SetHealthAmount(health)`
* **Description:** Sets the amount of health the bandage restores when used. This is called internally during prefab instantiation to configure the healing value. Modders may call it on an instance to customize healing.
* **Parameters:** `health` (number) — the amount of health to restore.
* **Returns:** Nothing.

## Events & listeners
None identified.