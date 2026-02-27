---
id: incrementalproducer
title: Incrementalproducer
description: Manages incremental production of items or resources for an entity based on configurable delay, increment, and production logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c19e67af
---

# Incrementalproducer

## Overview
This component enables an entity to produce items or resources incrementally over time. It supports dynamic configuration of production rate, maximum capacity, and custom production callbacks, making it suitable for entities like farms, forges, or automated generators that produce items in batches with delays between each unit.

## Dependencies & Tags
None identified

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to. |
| `producefn` | `function` | `nil` | Callback function invoked when an item is produced. Receives `inst` as argument. |
| `countfn` | `function` | `nil` | Callback function that returns the current count of produced items/resources. |
| `maxcount` | `number` | `0` | Maximum number of items the entity can hold or produce at once. Dynamically updated via `maxcountfn`. |
| `maxcountfn` | `function` | `nil` | Optional callback to dynamically compute `maxcount`. Receives `inst` as argument. |
| `increment` | `number` | `1` | Number of items produced per production cycle. Can be overridden by `incrementfn`. |
| `incrementfn` | `function` | `nil` | Optional callback to dynamically compute `increment`. Receives `inst` as argument. |
| `incrementdelay` | `number` | `1` | Minimum time (in seconds) between consecutive production events. |
| `toproduce` | `number` | `0` | Number of items remaining to be produced in the current batch. |
| `lastproduction` | `number` | `0` | Timestamp (via `GetTime()`) of the last production event. |

## Main Functions

### `CanProduce()`
* **Description:** Evaluates whether production can occur *right now* based on time delay and current/max counts. Updates dynamic values (`maxcount`, `increment`, `toproduce`) if custom functions are defined. Sets `toproduce` to the number of items that *can* be produced in the next batch (capped by remaining space).
* **Parameters:** None.

### `TryProduce()`
* **Description:** Attempts to produce one unit (or batch) if `CanProduce()` returns true. Calls `DoProduce()` internally if production is possible.
* **Parameters:** None.

### `DoProduce()`
* **Description:** Executes the actual production by invoking `producefn` (if set), decrements `toproduce`, and updates `lastproduction` to the current time.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging purposes, showing current count, pending production, max count, and time remaining until next production.
* **Parameters:** None.

## Events & Listeners
None identified