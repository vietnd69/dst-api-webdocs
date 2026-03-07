---
id: quagmire_flour
title: Quagmire Flour
description: A consumable item used in Quagmire stew recipes, characterized by its unique animation and stew interaction tag.
tags: [inventory, crafting, food]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5ad6f035
system_scope: inventory
---

# Quagmire Flour

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_flour` is a prefab definition for an in-game item used in the Quagmire stew crafting system. It provides the visual and network representation of the flour entity, setting up its animation state, physics, and Tag-based categorization. It does not contain custom logic beyond initialization and relies on the game’s core systems (e.g., inventory, stewing) for behavior.

## Usage example
This prefab is instantiated automatically by the game when spawned via world generation or crafting. To spawn it manually in a mod:
```lua
local flour = SpawnPrefab("quagmire_flour")
if flour ~= nil then
    -- flour is now a fully initialized entity
    flour.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryitem`
**Tags:** Adds `quagmire_stewable` to indicate compatibility with Quagmire stews.

## Properties
No public properties.

## Main functions
This is a prefab factory function (via `Prefab(...)`), not a component. It does not define a reusable component class and has no callable functions beyond the standard prefab lifecycle.

## Events & listeners
None identified.