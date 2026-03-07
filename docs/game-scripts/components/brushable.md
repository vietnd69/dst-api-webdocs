---
id: brushable
title: Brushable
description: Manages brushable interactions for an entity, calculating prizes awarded based on time elapsed since last brushing and handling brush events.
tags: [world, interaction, loot]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a313a81c
system_scope: world
---

# Brushable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Brushable` component enables an entity to be brushed, awarding items (prizes) based on how many brushing cycles have passed since the last brush action. It tracks brushing progress over world cycles, calculates the number of rewards due, and emits events upon successful brushing. This component is commonly used for entities like beefalo, bees, or bushes that yield resources when interacted with.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brushable")

inst.components.brushable:SetBrushable(true, true)
inst.components.brushable:SetPrize("bee")
inst.components.brushable:SetMaxPrizes(5)
inst.components.brushable:SetCyclesPerPrize(600)

inst:ListenForEvent("brushed", function(inst, data)
    print("Brushed by", data.doer, "for", data.numprizes, "prizes")
end)
```

## Dependencies & tags
**Components used:** None explicitly called via `inst.components.X` beyond internal usage, but relies on `inventory` component for item distribution.
**Tags:** Adds or removes `brushable` tag on the entity depending on state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prize` | string or nil | `nil` | Prefab name of the item to award when brushed. |
| `max` | number | `0` | Maximum number of prizes that can be earned in one brush action. |
| `cyclesperprize` | number | `0` | Number of world cycles required per prize unit. |
| `lastbrushcycle` | number | `0` | World cycle at which the last brush occurred. |
| `brushable` | boolean | `true` | Whether the entity can currently be brushed. |

## Main functions
### `SetBrushable(brushable, reset)`
* **Description:** Enables or disables brushing on the entity and optionally resets the last brush cycle.
* **Parameters:** `brushable` (boolean) – whether the entity should be brushable. `reset` (boolean, optional) – if `true`, sets `lastbrushcycle` to the current world cycle.
* **Returns:** Nothing.

### `SetOnBrushed(fn)`
* **Description:** Sets a callback function to be invoked whenever the entity is brushed.
* **Parameters:** `fn` (function) – function with signature `fn(inst, doer, numprizes)`, where `doer` is the entity performing the brush and `numprizes` is the number of prizes given.
* **Returns:** Nothing.

### `CalculateNumPrizes()`
* **Description:** Computes how many prizes have accumulated since the last brush, based on elapsed cycles and `cyclesperprize`.
* **Parameters:** None.
* **Returns:** number – number of prizes due; `0` if no time has elapsed or `cyclesperprize <= 0`.
* **Error states:** Returns `0` if `elapsed <= 0`.

### `Brush(doer, brush)`
* **Description:** Performs the brush action: awards prizes to the actor (`doer`) if brushing is enabled and valid, updates the last brush cycle, and fires events.
* **Parameters:** `doer` (Entity) – the entity performing the brush. `brush` (Entity, unused) – kept for API compatibility but not used.
* **Returns:** Nothing.
* **Error states:** If `brushable` is `false`, `prize` is `nil`, and `max <= 0`, no prizes are awarded.

### `OnSave()`
* **Description:** Prepares the component’s state for saving to disk.
* **Parameters:** None.
* **Returns:** table – `{ lastbrushcycle = number, brushable = boolean }`.

### `OnLoad(data)`
* **Description:** Restores the component’s state from saved data.
* **Parameters:** `data` (table) – saved state, must contain `lastbrushcycle` and optionally `brushable`.
* **Returns:** Nothing.
* **Error states:** Defaults `brushable` to `true` if not present in `data`.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string representation of the component’s current state.
* **Parameters:** None.
* **Returns:** string – formatted as `" <brushable_status> lastcycle: <N> prizes: <M>"`.

## Events & listeners
- **Pushes:** `brushed` – fired with payload `{doer = Entity, numprizes = number}` after prizes are awarded. Used internally and by external listeners.
