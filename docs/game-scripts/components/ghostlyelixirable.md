---
id: ghostlyelixirable
title: Ghostlyelixirable
description: Marks an entity as a ghostly elixir item by adding the `ghostlyelixirable` tag for use in gameplay logic.
tags: [item, ghost, elixir]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a3ca163d
system_scope: inventory
---

# Ghostlyelixirable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GhostlyElixirable` is a lightweight component that tags an entity with `"ghostlyelixirable"`, identifying it as a consumable item used in ghost-related mechanics (e.g., elixirs that affect spirits or ghosts). It provides minimal logic: tag assignment upon initialization, an optional overrideable method to determine its effect target, and automatic tag removal when detached from an entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("ghostlyelixirable")

-- Optional: override the target application logic
inst.components.ghostlyelixirable.overrideapplytotargetfn = function(selfinst, doer, elixir)
    -- Custom logic, e.g., return a ghost entity instead of self
    return GetNearestGhost(doer)
end

-- When applied:
local target = inst.components.ghostlyelixirable:GetApplyToTarget(player, inst)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `ghostlyelixirable` on initialization; removes it on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `overrideapplytotargetfn` | function or nil | `nil` | Optional callback to customize the logic for determining the elixir's target. Takes `(inst, doer, elixir)` and returns a target entity. |

## Main functions
### `GetApplyToTarget(doer, elixir)`
* **Description:** Determines the target entity for the elixir's effect. If `overrideapplytotargetfn` is set, it delegates to that callback; otherwise, it returns `self.inst` (the elixir itself).
* **Parameters:**  
  - `doer` (entity) – The entity performing the action (e.g., the player using the elixir).  
  - `elixir` (entity) – The elixir instance (typically `self.inst`).
* **Returns:** The target entity (usually the elixir or a custom entity from the override).
* **Error states:** None — returns `self.inst` when no override is defined.

### `OnRemoveFromEntity()`
* **Description:** Removes the `"ghostlyelixirable"` tag from the entity when the component is detached.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
