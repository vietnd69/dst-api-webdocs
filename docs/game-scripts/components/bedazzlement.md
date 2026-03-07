---
id: bedazzlement
title: Bedazzlement
description: Manages the bedazzled state for a spider den, applying visual and gameplay effects such as pacifying nearby spiders and altering creep radius.
tags: [spider, state, visual, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a8266408
system_scope: entity
---

# Bedazzlement

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Bedazzlement` component controls the transformation and ongoing effects of a spider den when it enters a "bedazzled" state — typically triggered by specific interactions in the Spider Den event or related content. It modifies visual appearance, sound, creep behavior, and pacifies nearby spiders. It also integrates with the `growable` component to pause or resume growth depending on state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bedazzlement")
inst:AddComponent("growable")
-- After setup, trigger bedazzlement:
inst.components.bedazzlement:Start()
-- Later, revert:
inst.components.bedazzlement:Stop()
```

## Dependencies & tags
**Components used:** `growable`, `animstate`, `soundemitter`, `minimapentity`, `groundcreepentity`, `transform`
**Tags:** Adds `bedazzled`; checks `bedazzled`, `spider`, `spiderqueen`, `creaturecorpse`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bedazzle_task` | `Task` | `nil` | Periodic task that repeatedly calls `PacifySpiders` at `TUNING.BEDAZZLEMENT_RATE` intervals. |

## Main functions
### `Start()`
* **Description:** Activates the bedazzled state for the entity. It adds the `bedazzled` tag, shows a visual flare, plays bedazzled animations and sound, stops growth via the `growable` component, updates the minimap icon, sets bedazzled creep radius, and starts the pacification task.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early without effect if the entity already has the `bedazzled` tag.

### `Stop()`
* **Description:** Reverts the bedazzled state. Removes the `bedazzled` tag, hides the visual flare, restores original animations and minimap icon, resumes growth (via `growable:StartGrowing()`), resets creep radius, and cancels the pacification task.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early without effect if the entity does not have the `bedazzled` tag.

### `PacifySpiders()`
* **Description:** Finds nearby valid spiders within a radius dependent on the den’s tier and applies the `bedazzle_buff` debuff to them. Den tier is capped at `3` for radius calculation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes component state for saving. Returns a data table containing whether the entity is currently bedazzled.
* **Parameters:** None.
* **Returns:** `table` — Contains `{ bedazzled = true }` if the entity is bedazzled; otherwise an empty table.

### `OnLoad(data)`
* **Description:** Restores component state on load. If saved data indicates `bedazzled = true`, re-applies the bedazzled state via a delayed `Start()` call.
* **Parameters:** `data` (table) — Saved data from `OnSave()`.
* **Returns:** Nothing.

## Events & listeners
None identified.
