---
id: sanityauraadjuster
title: Sanityauraadjuster
description: Manages periodic adjustment of sanity aura effects by running a custom callback function on a timer.
tags: [sanity, aura, periodic, callback]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 04aa37e5
system_scope: entity
---

# Sanityauraadjuster

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SanityAuraAdjuster` is a utility component that enables dynamic, periodic modification of sanity aura behavior. It stores a custom callback function (`adjustmentfn`) and executes it once per second using a periodic task. The callback receives the entity instance and a list of players, and is expected to return the updated player list. This component is designed for prefabs that need to dynamically affect nearby players’ sanity over time.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sanityauraadjuster")

inst.components.sanityauraadjuster:SetAdjustmentFn(function(entity, current_players)
    -- Custom logic to adjust sanity aura based on proximity, state, etc.
    return current_players
end)

inst.components.sanityauraadjuster:StartTask()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | (injected) | The entity instance that owns this component. |
| `adjustmentfn` | `function` | `nil` | Optional callback function used to compute sanity aura adjustments. |
| `players` | `table` | `{}` | List of players (typically entities) considered for sanity adjustment; updated by the callback. |

## Main functions
### `SetAdjustmentFn(fn)`
* **Description:** Sets the callback function that will be invoked every second to adjust the sanity aura behavior.
* **Parameters:** `fn` (function) – A function with signature `fn(entity: GObject, players: table): table`, where `entity` is `self.inst`, and the return value replaces the current `players` list.
* **Returns:** Nothing.

### `StartTask()`
* **Description:** Starts a periodic task that runs the adjustment callback once per second. Has no effect if a task is already running.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopTask()`
* **Description:** Cancels the currently running periodic task (if any) and clears its reference.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
