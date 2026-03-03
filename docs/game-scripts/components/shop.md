---
id: shop
title: Shop
description: Handles the delivery and spawning of shop-purchased items above the entity's position in the world.
tags: [inventory, shop, spawner]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ec36853b
system_scope: entity
---

# Shop

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Shop` component manages the visual and physical delivery of items to the entity it is attached to, typically used for shop interfaces where purchased items are physically spawned into the world above the entity (e.g., a merchant or stall). It does not handle transaction logic, inventory, or shop UI—only the spawner behavior for resulting items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shop")
inst.components.shop:SetStartTab("general")
inst.components.shop:SetTitle("Merchant Stall")
local items = { "torch", "boards", "log" }
inst.components.shop:DeliverItems(items)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tab` | string | `""` | The shop tab identifier used by client-side UI (not used by this component logic). |
| `title` | string | `"Shop"` | The shop title string, used by client-side UI. |

## Main functions
### `SetStartTab(tab)`
* **Description:** Sets the initial shop tab name, typically consumed by UI screens to pre-select a category.
* **Parameters:** `tab` (string) – the identifier for the starting shop tab.
* **Returns:** Nothing.

### `SetTitle(title)`
* **Description:** Sets the display title for the shop entity, used in UI contexts.
* **Parameters:** `title` (string) – the human-readable shop name.
* **Returns:** Nothing.

### `DeliverItems(items)`
* **Description:** Spawns each item prefab listed in `items` and positions them above the owner entity with randomized velocity for a falling/spread effect.
* **Parameters:** `items` (table of strings) – an array of prefab names to spawn.
* **Returns:** Nothing.
* **Error states:** Asserts that `items` is non-`nil` and non-empty (via `assert(items)`). Fails silently for any prefab that fails to spawn (logs a warning to console only).

## Events & listeners
None identified
