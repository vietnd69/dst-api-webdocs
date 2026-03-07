---
id: wx78_moduleremover
title: Wx78 Moduleremover
description: A consumable inventory item that removes upgrade modules from WX78 components.
tags: [inventory, item, upgrade, wx78]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9f3b2ff3
system_scope: inventory
---

# Wx78 Moduleremover

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wx78_moduleremover` prefab is a reusable inventory item used to remove installed upgrade modules from WX78 chassis components (e.g., WX78's battery, laser, or thruster modules). It is implemented as a self-contained prefab with built-in physics, animation, and network synchronization. It integrates with DST's upgrade module removal system via the `upgrademoduleremover` component and supports in-world floating, lighting, and burning properties.

## Usage example
```lua
local inst = SpawnPrefab("wx78_moduleremover")
if inst then
    -- Equip into a character's inventory
    inst.Transform:SetPos(entity.Transform:GetWorldPosition())
    inst.components.inventoryitem:RemoveFromInventory()
    entity.components.inventoryitem:AddItem(inst)

    -- Remove a module (typically triggered by UI interaction)
    -- The actual removal logic is handled by the upgrademoduleremover component
    -- when used via the upgrade module UI workflow
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `upgrademoduleremover`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable. This is a prefab definition, not a standalone component class. The logic resides in the `fn()` function, which instantiates and configures the entity.

## Events & listeners
Not applicable. The prefab relies on external components (`upgrademoduleremover`, `inventoryitem`) to handle event-driven behavior; no event listeners are registered directly in this file.