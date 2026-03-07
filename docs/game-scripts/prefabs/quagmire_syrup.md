---
id: quagmire_syrup
title: Quagmire Syrup
description: A consumable crafting ingredient used in Quagmire stew recipes, visually represented as a sticky syrup bottle.
tags: [crafting, ingredient, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 88a7ff59
system_scope: inventory
---

# Quagmire Syrup

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_syrup` is a simple prefab representing a consumable item used exclusively in Quagmire-era crafting. It functions as a storable, networked inventory item that participates in the `quagmire_stewable` tagging system for stew recipes. The prefab defines its visual representation (animation bank and build) and minimal physics for inventory use, but contains no custom logic beyond initialization and network sync.

## Usage example
```lua
-- When crafting a stew that requires syrup:
local syrup = SpawnPrefab("quagmire_syrup")
-- The item is automatically handled by the stew crafting system due to the "quagmire_stewable" tag.
-- It does not require direct manipulation of this prefab beyond spawning it as an ingredient.
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryitem`, `Physics` (via `MakeInventoryPhysics`)
**Tags:** Adds `quagmire_stewable`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
None identified