---
id: flower_withered
title: Flower Withered
description: A pickable, renewable grass source that provides cutgrass and can ignite wildfires.
tags: [environment, resource, fire]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3547dcb6
system_scope: environment
---

# Flower Withered

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`flower_withered` is a renewable environmental resource prefab that yields `cutgrass` when picked. It is designed to be easily harvestable (via `quickpick`) and serves as a wildfire ignition source. The prefab uses the `pickable` component for harvesting behavior and integrates with the world's burn and fire propagation systems. It has three visual variants (`wf1`, `wf2`, `wf3`) selected randomly on spawn and persists its animation state across saves.

## Usage example
```lua
local inst = SpawnPrefab("flower_withered")
inst.Transform:SetPosition(x, y, z)
inst.components.pickable:SetUp("cutgrass", 15) -- Regenerate in 15 seconds
```

## Dependencies & tags
**Components used:** `inspectable`, `pickable`, `transform`, `animstate`, `network`  
**Tags:** None explicitly added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `"wf"..tostring(math.random(3))` | Current animation state (`wf1`, `wf2`, or `wf3`). |
| `scrapbook_anim` | string | `"wf3"` | Animation name used in scrapbook UI. |

## Main functions
### `inst.components.pickable:SetUp(product, regen, number)`
* **Description:** Configures harvesting parameters using the `pickable` component API.
* **Parameters:**  
  `product` (string) — prefab name of the item dropped on harvest (`"cutgrass"`).  
  `regen` (number) — regrowth time in seconds (`10` in the default definition).  
  `number` (number, optional) — items dropped per harvest (defaults to `1`).  
* **Returns:** Nothing.  
* **Error states:** No explicit error handling — invalid types may cause runtime errors.

### `inst.AnimState:PlayAnimation(animname)`
* **Description:** Plays the specified animation (`wf1`, `wf2`, or `wf3`) on initialization.  
* **Parameters:** `animname` (string) — animation clip name to play.  
* **Returns:** Nothing.  
* **Error states:** May fail silently if `animname` is not a valid clip in the current bank.

## Events & listeners
- **Listens to:** None explicitly defined in this prefab (save/load events are attached via `inst.OnSave` and `inst.OnLoad` callbacks, not `ListenForEvent`).  
- **Pushes:** None explicitly defined.  

### Save/Load Integration
- `inst.OnSave = onsave` — Saves current animation name to save data.  
- `inst.OnLoad = onload` — Restores animation name on load and replays the animation.