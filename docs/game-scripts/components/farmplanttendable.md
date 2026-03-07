---
id: farmplanttendable
title: Farmplanttendable
description: Controls whether a farm plant entity can be tended to, managing the `tendable_farmplant` tag and tend completion logic.
tags: [farm, plant, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 4e81483c
system_scope: entity
---

# Farmplanttendable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FarmplantTendable` manages the tendable state of a farm plant entity in DST. It ensures the `tendable_farmplant` tag is correctly added or removed based on whether the plant can still be tended, and handles the execution of tend actions via the `TendTo` method. When the plant is tended successfully, the component marks it as no longer tendable and triggers state changes accordingly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("farmplanttendable")
inst.components.farmplanttendable:SetTendable(true)
inst.components.farmplanttendable.ontendtofn = function(ent, doer)
    -- Custom tend logic here (e.g., check doer, apply effects)
    return true
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `tendable_farmplant` when `tendable` is `true`, removes it otherwise.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tendable` | boolean | `true` | Whether the plant can be tended. Set via constructor or `SetTendable`. |
| `ontendtofn` | function\|nil | `nil` | Callback invoked when `TendTo` is called; should return `true` on success. Not initialized by the component. |

## Main functions
### `SetTendable(tendable)`
* **Description:** Updates whether the plant is tendable and syncs the `tendable_farmplant` tag accordingly.
* **Parameters:** `tendable` (boolean) — the new tendable state.
* **Returns:** Nothing.

### `TendTo(doer)`
* **Description:** Attempts to tend the plant. If `tendable` is `true`, `ontendtofn` is present, and the callback returns `true`, marks the plant as no longer tendable and returns success.
* **Parameters:** `doer` (GObject) — the entity performing the tend action.
* **Returns:** `true` if the tend action succeeded, `false` or `nil` otherwise.
* **Error states:** Returns `false`/`nil` if `tendable` is `false`, `ontendtofn` is `nil`, or the callback returns `false`/`nil`.

### `OnSave()`
* **Description:** Returns the component's serializable state for savegames.
* **Parameters:** None.
* **Returns:** `{ tendable = self.tendable }` — a table containing the current `tendable` state.

### `OnLoad(data)`
* **Description:** Restores the component's state from saved data.
* **Parameters:** `data` (table\|nil) — the saved state, expected to contain a `tendable` key.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
