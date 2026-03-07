---
id: cookbook
title: Cookbook
description: A consumable item that, when read by a player, opens the cooking recipe book interface.
tags: [crafting, ui, item]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 05f75022
system_scope: ui
---

# Cookbook

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cookbook` prefab is a portable in-game item representing the Cooking Recipe Book. It functions as an item with a `simplebook` component that triggers the cooking interface when read by a player. It integrates with the inventory system, can be used as fuel, and participates in the haunting and burn mechanics of the world.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("fuel")
inst:AddComponent("simplebook")
inst.components.simplebook.onreadfn = function(reader)
    reader:ShowPopUp(POPUPS.COOKBOOK, true)
end
```

## Dependencies & tags
**Components used:** `fuel`, `simplebook`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `simplebook` and `bookcabinet_item`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | The amount of fuel provided when burned (in ticks). |
| `simplebook.onreadfn` | function | `OnReadBook` | Callback executed when the book is read by a player. |

## Main functions
### `OnReadBook(inst, doer)`
*   **Description:** Event handler triggered when a player opens the cookbook. It displays the cooking recipe book UI to the reader.
*   **Parameters:** `doer` (Entity) - the player who read the book.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the player fails to show the pop-up (e.g., invalid state or missing UI), though no explicit failure logic is present.

## Events & listeners
- **Listens to:** None explicitly registered in this file.
- **Pushes:** None explicitly fired in this file.