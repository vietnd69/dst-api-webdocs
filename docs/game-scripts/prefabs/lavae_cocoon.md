---
id: lavae_cocoon
title: Lavae Cocoon
description: A wearable bait item that attracts moles in DST's Lavae-related content.
tags: [inventory, bait, mob]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 56261da6
system_scope: inventory
---

# Lavae Cocoon

> Based on game build **714004** | Last updated: 2026-03-05

## Overview
The `lavae_cocoon` prefab represents a wearable bait item used to attract moles. It is instantiated as an entity with visual, sound, and network representations, and is equipped with inventory and bait functionality. The component relies on the `inventoryitem` component (specifically calling `SetSinks(true)`) and integrates with the `bait` system and `inspectable`/`hauntable` systems on the server.

## Usage example
```lua
local cocoon = SpawnPrefab("lavae_cocoon")
if cocoon ~= nil then
    cocoon.components.bait:Enable(true)
    cocoon.components.inventoryitem:PushToInventory()
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `bait`, `inspectable`, `hauntable`
**Tags:** Adds `molebait`

## Properties
No public properties

## Main functions
### `SetSinks(should_sink)`
*   **Description:** Inherited from the `inventoryitem` component. Controls whether the item sinks when dropped in water.
*   **Parameters:** `should_sink` (boolean) — whether the item should sink.
*   **Returns:** Nothing.
*   **Error states:** If the item is already landed, it immediately attempts to sink based on the new value.

## Events & listeners
None identified.