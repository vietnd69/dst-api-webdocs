---
id: glommerflower
title: Glommerflower
description: Acts as a leader for Glommer entities and tracks their life state, transforming into a dead flower when Glommer leaves or dies.
tags: [entity, leader, lifecycle, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e74aa677
system_scope: entity
---

# Glommerflower

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`glommerflower` is aPrefab entity that serves as the leader for Glommer pets in DST. When active, it holds Glommer in a leashed, active state. If Glommer is lost (via removal or death), the flower transitions into a dead state: it becomes perishable, its animation changes, and it gains fuel properties for burning. The prefab uses `leader` and `inspectable` components to manage followers and UI status, and it supports save/load state persistence via custom hooks.

## Usage example
```lua
local flower = SpawnPrefab("glommerflower")
flower.Transform:SetPosition(x, y, z)

-- Manually trigger rebind logic if needed (e.g., after loading)
if flower:HasTag("glommerflower") then
    flower.RefreshFlowerIcon()
end

-- Check status via inspectable component
local status = flower.components.inspectable and flower.components.inspectable:getstatus(flower)
-- status will be "DEAD" if the flower has lost its Glommer
```

## Dependencies & tags
**Components used:** `leader`, `inspectable`, `inventoryitem`, `perishable`, `fuel`, `health`, `follower`, `container`, `inventory`, `animator`, `minimap`, `transform`, `network`, `hauntable`
**Tags:** `glommerflower`, `nonpotatable`, `irreplaceable`, `dead` (via removal of `glommerflower` tag)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_adddeps` | table of strings | `{ "glommer" }` | Dependencies listed in the scrapbook for this item. |
| `RefreshFlowerIcon` | function | `RefreshFlowerIcon` | Public helper method to update inventory icon based on life state. |
| `OnPreLoad` | function | `OnPreLoad` | Save/load hook to restore dead/alive state. |
| `OnSave` | function | `OnSave` | Save hook storing whether the flower is dead. |

## Main functions
### `RefreshFlowerIcon(inst)`
* **Description:** Updates the inventory image name based on whether the flower is alive (`glommerflower`) or dead (`glommerflower_dead`). Accounts for custom skins.
* **Parameters:** `inst` (entity) — the flower instance.
* **Returns:** Nothing.
* **Error states:** None documented; assumes `inventoryitem` component exists.

## Events & listeners
- **Listens to:** 
  - `leader` component event: `onremovefollower` triggers `OnLoseChild` when Glommer detaches.
  - `OnInit` delayed task (`DoTaskInTime(0, OnInit)`) attempts to rebind Glommer if present and valid.
- **Pushes:** 
  - Internally via components: `imagechange` (from `inventoryitem:ChangeImageName`), `gotnewitem`, `itemget`, `leaderchanged`, `onremove`.
  - Save/load events: `OnSave`, `OnPreLoad` called by the world save system.

