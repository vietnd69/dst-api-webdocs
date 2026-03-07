---
id: inspectable
title: Inspectable
description: Manages inspection behavior and dynamic description/status reporting for entities.
tags: [inspection, description, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d505b3c9
system_scope: entity
---

# Inspectable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Inspectable` component enables an entity to be inspected (e.g., via right-click or UI), providing a dynamic description and status string based on its state and the viewer. It automatically adds the `inspectable` tag to its host entity upon construction and removes it on cleanup. The component coordinates with several other components (`health`, `sleeper`, `burnable`, `diseaseable`, `pickable`, `witherable`, `inventoryitem`, `occupiable`, `container`) to report accurate, real-time status information during inspection.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectable")

-- Set a static description string
inst.components.inspectable:SetDescription("A sturdy wooden crate.")

-- Or provide a dynamic description function
inst.components.inspectable.descriptionfn = function(inst, viewer)
    return "Looks like it's been这里." -- Note: avoid non-Latin characters in real code
end

-- Enable view counting (e.g., for achievement tracking)
inst.components.inspectable:RecordViews(true)
```

## Dependencies & tags
**Components used:** `health`, `sleeper`, `burnable`, `diseaseable`, `pickable`, `witherable`, `inventoryitem`, `occupiable`, `container`  
**Tags:** Adds `inspectable` on construction; removes it on `OnRemoveFromEntity()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `description` | string or function | `nil` | Static description string or a function `(inst, viewer) → string`. |
| `descriptionfn` | function | `nil` | Alternative dynamic description function (takes precedence over `description`). |
| `getspecialdescription` | function | `nil` | Custom description handler for special cases (e.g., player skeleton), returning `desc, filter_context, author`. |
| `nameoverride` | string | `nil` | Overrides the name used in inspection UI (distinct from display name). |
| `recordview` | boolean | `false` | Whether inspection events should be recorded for stats/achievements. |

## Main functions
### `SetDescription(desc)`
* **Description:** Sets the static or dynamic description to use when inspecting the entity.
* **Parameters:** `desc` (string or function) – if a function, must accept `(inst, viewer)` and return a string.
* **Returns:** Nothing.

### `SetNameOverride(nameoverride)`
* **Description:** Sets the name string used in the inspection UI panel (not the entity's actual name).
* **Parameters:** `nameoverride` (string) – custom name to display during inspection.
* **Returns:** Nothing.

### `RecordViews(state)`
* **Description:** Enables or disables inspection logging for stats/achievement tracking (via `ProfileStatsSet`).
* **Parameters:** `state` (boolean) – if `true`, inspection events are recorded; `false` disables logging.
* **Returns:** Nothing.

### `GetStatus(viewer)`
* **Description:** Returns a status string (e.g., `"DEAD"`, `"SLEEPING"`, `"BURNING"`) based on the entity's current state and the viewer. Used to prepend context to the description (e.g., "A dead skeleton").
* **Parameters:** `viewer` (entity) – the inspecting entity.
* **Returns:** string or `nil` – status descriptor, or `nil` if no status applies.
* **Error states:** Returns early with `nil` if `viewer == self.inst` (self-inspection is not allowed).

### `GetDescription(viewer)`
* **Description:** Returns the full description string for inspection, considering darkness, viewer state (e.g., ghost/mime), smoldering status, and custom description handlers.
* **Parameters:** `viewer` (entity) – the inspecting entity.
* **Returns:** string or `nil` – the description string, optionally with `filter_context` and `author` if provided by a handler.
* **Error states:** Returns `"DESCRIBE_TOODARK"` if the entity is not visible and not inside an opened container; returns `"DESCRIBE_SMOLDERING"` if the entity is smoldering.

## Events & listeners
- **Listens to:** None directly. Uses `inst:ListenForEvent(...)` only via other components it queries (e.g., `health`, `sleeper`).  
- **Pushes:** None. Status and description are computed on demand via inspection calls.
