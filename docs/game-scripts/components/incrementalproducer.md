---
id: incrementalproducer
title: IncrementalProducer
description: Manages incremental resource production on an entity, with configurable delay, capacity limits, and custom callbacks for production logic and state queries.
tags: [production, resource, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c19e67af
system_scope: entity
---

# IncrementalProducer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`IncrementalProducer` enables an entity to produce resources incrementally over time, respecting configurable limits, delays, and production rates. It supports callbacks for querying current count, maximum capacity, and increment size, as well as for executing the actual production logic. It is used in entities that require time-gated or threshold-based resource generation (e.g., bees producing honey, woolly cows producing wool).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("incrementalproducer")

inst.components.incrementalproducer:SetCountFn(function() return 0 end)
inst.components.incrementalproducer:SetMaxCountFn(function() return 10 end)
inst.components.incrementalproducer:SetIncrementFn(function() return 1 end)
inst.components.incrementalproducer:SetProduceFn(function(inst)
    print("Produced 1 resource")
end)
inst.components.incrementalproducer:SetIncrementDelay(2.0)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity owning this component. |
| `producefn` | function | `nil` | Callback executed on each production tick. |
| `countfn` | function | `nil` | Callback returning the current count of produced items. |
| `maxcount` | number | `0` | Maximum allowed count (updated via `countfn` or `maxcountfn`). |
| `maxcountfn` | function | `nil` | Callback returning the dynamic max count. |
| `increment` | number | `1` | Default number of items produced per tick. |
| `incrementfn` | function | `nil` | Callback returning the dynamic increment per tick. |
| `incrementdelay` | number | `1` | Minimum seconds between production increments. |
| `toproduce` | number | `0` | Number of units queued for production. |
| `lastproduction` | number | `0` | Timestamp of last production event. |

## Main functions
### `CanProduce()`
* **Description:** Determines if the entity can produce in the current tick based on time elapsed since last production, and if the current count is below the max. Also refreshes `increment` and `maxcount` using their respective callbacks.
* **Parameters:** None.
* **Returns:** `true` if `toproduce > 0` and conditions are met; otherwise `false`.
* **Error states:** Returns `false` if `countfn` returns `nil`, `maxcountfn` or `incrementfn` callbacks are missing and default values are used in unexpected ways.

### `TryProduce()`
* **Description:** Attempts to produce one increment if `CanProduce()` returns `true`. Does nothing if production is not possible.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoProduce()`
* **Description:** Executes the production logic by invoking `producefn`, decrements `toproduce`, and records the current time as `lastproduction`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `producefn` is `nil`, this function does nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing the current production state (count, pending production, max count, time until next increment).
* **Parameters:** None.
* **Returns:** `string` — formatted as `"count:<n> toproduce:<n> max:<n> nextincrement:<f>"`.

## Events & listeners
None identified
