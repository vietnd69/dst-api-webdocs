---
id: beargervest
title: Beargervest
description: Defines the Bearger Vest prefab, an equipable body slot item that provides insulation and slows hunger drain while consuming durability.
tags: [inventory, equipment, insulation, durability]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e20f978
system_scope: inventory
---

# Beargervest

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Beargervest` is a prefab definition for an equipable clothing item. It functions as body armor that provides thermal insulation and reduces the owner's hunger burn rate. The item degrades over time using the `fueled` component with `FUELTYPE.USAGE` and is removed from the world when durability is depleted. It handles animation overrides for the torso slot and supports item skins.

## Usage example
```lua
-- Spawning the vest in the world
local vest = SpawnPrefab("beargervest")

-- Adding it to a player's inventory
local player = ThePlayer
player.components.inventory:GiveItem(vest)

-- Equipping the vest manually (triggers onequip logic)
player.components.inventory:Equip(vest)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `tradable`, `equippable`, `insulator`, `fueled`.
**Tags:** None identified. (Armor tags are present in source code but commented out).

## Properties
No public properties. Configuration is handled internally during entity instantiation via the `fn` factory function.

## Main functions
### `onequip(inst, owner)`
*   **Description:** Internal callback assigned to `equippable:SetOnEquip`. Executes when the vest is equipped by a player.
*   **Parameters:** `inst` (entity) - The vest instance. `owner` (entity) - The player equipping the item.
*   **Returns:** Nothing.
*   **Error states:** Checks for `owner.components.hunger` existence before modifying burn rate.

### `onunequip(inst, owner)`
*   **Description:** Internal callback assigned to `equippable:SetOnUnequip`. Executes when the vest is unequipped.
*   **Parameters:** `inst` (entity) - The vest instance. `owner` (entity) - The player unequipping the item.
*   **Returns:** Nothing.
*   **Error states:** Checks for `owner.components.hunger` existence before removing burn rate modifier.

### `onperish(inst)`
*   **Description:** Internal callback assigned to `fueled:SetDepletedFn`. Executes when the vest fuel reaches zero.
*   **Parameters:** `inst` (entity) - The vest instance.
*   **Returns:** Nothing.
*   **Error states:** Removes the entity from the world immediately.

## Events & listeners
-   **Listens to:** None directly on the inst.
-   **Pushes:** `equipskinneditem` (on owner) - Fired when equipping a skinned version.
-   **Pushes:** `unequipskinneditem` (on owner) - Fired when unequipping a skinned version.