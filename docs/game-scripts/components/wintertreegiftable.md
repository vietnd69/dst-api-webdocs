---
id: wintertreegiftable
title: Wintertreegiftable
description: Tracks the last cycle on which a gift was given to a winter tree to enforce cooldown logic.
tags: [calendar, entity, save]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 80d35032
system_scope: world
---

# Wintertreegiftable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WinterTreeGiftable` is a lightweight component that records the world cycle (`TheWorld.state.cycles`) when a gift is given to a winter tree entity (e.g., the Frost Flower, Frosty Tree, or similar interactive winter-themed objects). It provides utility functions to check the elapsed days since the last gift and persists this state across game sessions. The component is self-contained and does not interact with other components directly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wintertreegiftable")

-- Record a gift being given on the current cycle
inst.components.wintertreegiftable:OnGiftGiven()

-- Check how many cycles have passed since the last gift
local days = inst.components.wintertreegiftable:GetDaysSinceLastGift()
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `previousgiftday` | number | `-100` | The world cycle (`TheWorld.state.cycles`) of the last gift; initialized to a distant past cycle to ensure first gift is always allowed. |

## Main functions
### `GetDaysSinceLastGift()`
* **Description:** Computes and returns the number of world cycles elapsed since the last gift was given to the tree.
* **Parameters:** None.
* **Returns:** `number` — the number of cycles since the last gift.
* **Error states:** Returns a positive integer in all normal cases; may return a large number on first call if `OnGiftGiven()` has never run.

### `OnGiftGiven()`
* **Description:** Records the current world cycle as the last day a gift was given.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns a serializable table containing the component's state for save-game persistence.
* **Parameters:** None.
* **Returns:** `table` — `{ previousgiftday = <number> }`.

### `OnLoad(data)`
* **Description:** Restores the component's state from a previously saved `data` table during game load.
* **Parameters:** `data` (table or `nil`) — the saved state data.
* **Returns:** Nothing.

## Events & listeners
None identified.
