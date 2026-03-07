---
id: chestupgrade_stacksize
title: Chestupgrade Stacksize
description: A consumable item prefab that upgrades a chest's item stack size limit when applied.
tags: [inventory, upgrade, crafting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 67e792e7
system_scope: inventory
---

# Chestupgrade Stacksize

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`chestupgrade_stacksize` is a prefab definition for an in-game item that permanently increases a chest's maximum stack size per slot. It is a type of upgrade component applied via the `upgrader` system to target entities with the `CHEST` upgrade type. The component provides visual representation via animations and integrates with DST's inventory, networking, and tradable systems.

## Usage example
```lua
local inst = SpawnPrefab("chestupgrade_stacksize")
if inst ~= nil then
    -- Item is ready for use in player inventory
    inst.Transform:SetPosition(0, 0, 0)
    -- To apply the upgrade, the player must use it on a chest
    -- The upgrader component handles the application logic automatically
end
```

## Dependencies & tags
**Components used:** `tradable`, `inspectable`, `inventoryitem`, `upgrader`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab constructor, not a component with custom logic.

## Events & listeners
Not applicable.

