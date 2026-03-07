---
id: healthtrigger
title: Healthtrigger
description: Triggers custom callbacks when an entity's health percentage crosses specified thresholds during damage or healing events.
tags: [health, event, callback]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 894a75f5
system_scope: entity
---

# Healthtrigger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HealthTrigger` enables prefabs to register callback functions that execute when the entity's health percentage crosses predefined thresholds. It listens for `healthdelta` events (fired whenever health changes) and evaluates which thresholds were crossed between the old and new health percentages. This component is typically used for implementing game mechanics tied to specific health milestones (e.g., triggering boss phase changes or visual effects at 50% health).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("healthtrigger")

-- Trigger at 50% health
inst.components.healthtrigger:AddTrigger(0.5, function(entity)
    print("Entity crossed 50% health!")
end)

-- Trigger at 25% health
inst.components.healthtrigger:AddTrigger(0.25, function(entity)
    print("Entity crossed 25% health!")
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `AddTrigger(amount, fn)`
* **Description:** Registers a callback function that executes when the entity’s health percentage crosses `amount`. The function is called only once per threshold crossing (on the frame the threshold is crossed).
* **Parameters:**  
  `amount` (number) – Health percentage threshold (between `0.0` and `1.0`, exclusive).  
  `fn` (function) – Callback function accepting the entity instance as its only argument.
* **Returns:** Nothing.

### `OnHealthDelta(data)`
* **Description:** Internal handler invoked automatically when a `healthdelta` event fires. Evaluates registered thresholds and triggers corresponding callbacks.
* **Parameters:**  
  `data` (table) – Contains `oldpercent` (number) and `newpercent` (number) — the health percentages before and after the delta.  
* **Returns:** Nothing.  
* **Error states:** Thresholds are evaluated inclusively/exclusively to avoid double-triggering on the same frame. No errors are raised for out-of-range thresholds, but thresholds at exactly `0.0` or `1.0` are ignored in practice due to equality checks.

## Events & listeners
- **Listens to:** `healthdelta` – triggers evaluation of registered thresholds.
- **Pushes:** No events.
