---
id: deer_antler
title: Deer Antler
description: A prefab factory function that generates deer antler items used as collectibles and key items in DST, supporting both standard and irreplaceable variants via the KlausSackKey component.
tags: [collectible, key, inventory, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 523072be
system_scope: inventory
---

# Deer Antler

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`deer_antler.lua` defines a factory function `MakeAntler` that generates multiple prefab variants of the deer antler item—used both as craftable inventory items and as quest-critical collectibles. Each antler is an inventory item with physics, animation, and floatable properties, and optionally implements key functionality through the `klaussackkey` component. Standard variants (`antlertype` 1–4) are replaceable, while one variant (`antlertype = 4`, `trueklaussackkey = true`) is marked as `irreplaceable` and triggers special key behavior via `KlausSackKey:SetTrueKey`.

## Usage example
```lua
-- Create a standard deer antler (type 1)
local antler = MakeAntler(1)

-- Create an irreplaceable key antler (used for Klaus Sack progression)
local key_antler = MakeAntler(4, true)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `klaussackkey`
**Tags:** Adds `deerantler`, `klaussackkey`; conditionally adds `irreplaceable`

## Properties
No public properties.

## Main functions
### `MakeAntler(antlertype, trueklaussackkey)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a deer antler item. Generates five total prefabs when executed: one generic and four type-specific (1–4), with the last being the key variant.
*   **Parameters:**
    *   `antlertype` (number or `nil`) — identifies the variant (1–4). `nil` creates the generic/fallback version.
    *   `trueklaussackkey` (boolean) — if `true`, marks the item as irreplaceable and activates `klaussackkey` key behavior.
*   **Returns:** `Prefab` — a reusable prefab definition.
*   **Error states:** 
    *   `antlertype` outside `1`–`4` or `nil` may produce unexpected variant naming or behavior.
    *   Passing `trueklaussackkey = true` without setting `antlertype = 4` is valid but may conflict with intended quest logic.

## Events & listeners
None identified.