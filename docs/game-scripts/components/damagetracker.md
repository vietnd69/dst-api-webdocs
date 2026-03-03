---
id: damagetracker
title: Damagetracker
description: Tracks cumulative damage dealt by an entity and triggers a callback when a specified damage threshold is reached.
tags: [combat, tracking]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: component
source_hash: b6c7025b
system_scope: combat
---

# Damagetracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Damagetracker` is a lightweight component that monitors damage dealt to other entities via the `healthdelta` event. It maintains a running total of damage dealt and invokes a configurable callback function once a predefined damage threshold is met or exceeded. It is typically used to unlock objectives or trigger events after an entity has dealt sufficient damage over time.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("damagetracker")

inst.components.damagetracker:SetDamageThreshold(5000)
inst.components.damagetracker:SetThresholdFn(function(target) 
    print("Target dealt 5000 total damage!")
end)

inst.components.damagetracker:Start()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage_done` | number | `0` | Accumulated damage dealt so far. |
| `damage_threshold` | number | `2500` | Threshold of total damage to trigger the callback. |
| `damage_threshold_fn` | function | `nil` | Callback function executed when the threshold is reached. |
| `enabled` | boolean | `false` | Whether the component is actively tracking damage. |

## Main functions
### `Start()`
* **Description:** Enables damage tracking. Once enabled, damage from `healthdelta` events will be counted toward the threshold.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Disables damage tracking. No further damage will be added to `damage_done` until `Start()` is called again.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetDamageThreshold(threshold)`
* **Description:** Sets the damage threshold value that triggers the callback.
* **Parameters:** `threshold` (number) — the total damage amount required to invoke `damage_threshold_fn`.
* **Returns:** Nothing.

### `SetThresholdFn(fn)`
* **Description:** Assigns the callback function to be executed when the damage threshold is reached.
* **Parameters:** `fn` (function) — function accepting a single argument: the entity instance (`self.inst`). Called once per threshold breach (i.e., only on the first crossing).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `healthdelta` — receives damage events and updates the tracked total.
- **Pushes:** None.
