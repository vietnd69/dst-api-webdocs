---
id: wormwood_plant_fx
title: Wormwood Plant Fx
description: Renders a visual effect animation sequence associated with Wormwood's plant transformation, triggering growth or un-growth based on player proximity and state.
tags: [fx, visual, plant, wormwood, npc]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6ffe8f20
system_scope: fx
---

# Wormwood Plant Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wormwood_plant_fx` is a visual effect entity that plays an animation sequence representing Wormwood’s plant growth cycle. It is automatically spawned and managed in response to Wormwood’s transformation state changes. The effect cycles between "grow", "idle", and "ungrow" animations depending on nearby `plantkin` players (specifically Wormwood himself) and their status (alive, non-ghost, visible, and within proximity). This prefab does not possess logic for self-control—instead, it responds to external calls via its exposed `SetVariation` function and listens for animation-over events to determine its lifecycle.

## Usage example
```lua
--Typically instantiated and controlled internally by the game or Wormwood's stategraph
local fx = SpawnPrefab("wormwood_plant_fx")
if TheWorld.ismastersim then
    fx.components.wormwood_plant_fx:SetVariation(2) -- Play grow_2, then idle/ungrow accordingly
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`
**Tags:** Adds `FX`, `NOCLICK`, `wormwood_plant_fx`. Checks `plantkin` and `playerghost` tags and `fullbloom` field on players.

## Properties
No public properties.

## Main functions
### `SetVariation(inst, variation)`
* **Description:** Updates the effect variation and initiates the corresponding "grow" animation. Automatically transitions to "idle" or "ungrow" based on player conditions.
* **Parameters:**  
  - `variation` (number) – identifies which visual variant to use (e.g., 1 or 2).  
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silently overwrites existing variation if called multiple times.

## Events & listeners
- **Listens to:** `animover` – triggers `OnAnimOver` to decide whether to remove the entity or continue looping animation.
- **Pushes:** None.