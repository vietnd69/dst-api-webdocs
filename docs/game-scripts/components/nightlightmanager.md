---
id: nightlightmanager
title: Nightlightmanager
description: Manages registration, tracking, and filtering of night light entities within the world for master simulation.
tags: [world, lighting, network, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3a83f46a
system_scope: world
---

# Nightlightmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Nightlightmanager` is a master-only component that tracks registered night light entities and maintains their positions and associated node tags. It enables filtering night lights by gameplay-relevant criteria (e.g., region tags) and locating the closest one to a given entity. It is intended to exist only on the master simulation (`TheWorld.ismastersim`) and is typically attached to a persistent world-level entity.

## Usage example
```lua
-- Assuming `world` is a master-only entity with the component attached
world:AddComponent("nightlightmanager")
-- Night lights register themselves with `inst:PushEvent("ms_registernightlight", nightlight)`
-- To get all night lights in forest region (tag: "forest"):
local forestLights = world.components.nightlightmanager:GetNightLightsWithFilter(
    NightLightManager.Filter_OnlyInTags, {"forest"}
)
-- To get the closest night light to the player:
if #forestLights > 0 then
    local closest = world.components.nightlightmanager:FindClosestNightLightFromListToInst(forestLights, player)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** The component checks and stores node tags (e.g., `"forest"`, `"cave"`) per night light via `TheWorld.Map:FindVisualNodeAtPoint`, but does not directly add or remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (must be master). |
| `nightlights` | `table` | `{}` | Map of night light entities → metadata tables containing position and node tags. |

## Main functions
### `IsNightLightDataInAnyTag(nightlightdata, tags)`
*   **Description:** Checks whether `nightlightdata.node_tags` contains any of the provided tags.
*   **Parameters:**  
    - `nightlightdata` (table) — metadata table associated with a night light (must include `node_tags` or `nil`).  
    - `tags` (table of strings) — list of tags to test against.  
*   **Returns:** `true` if any tag matches; `false` otherwise.

### `GetNightLightsWithFilter(filterfn, ...)`
*   **Description:** Returns a list of night light entities that satisfy the provided filter function.
*   **Parameters:**  
    - `filterfn` (function) — a callable with signature `filterfn(manager, nightlight, nightlightdata, ...)` returning a boolean.  
    - `...` — additional arguments passed to `filterfn`.  
*   **Returns:** `table` — array of night light entities satisfying the filter.

### `FindClosestNightLightFromListToInst(nightlights, inst)`
*   **Description:** Finds the night light in `nightlights` with the smallest squared distance to `inst`.
*   **Parameters:**  
    - `nightlights` (table of entities) — list of night light entities to search.  
    - `inst` (Entity) — target entity for distance comparison.  
*   **Returns:** `Entity` — the closest night light, or `nil` if `nightlights` is empty.

### `UpdateNightLightPosition(nightlight)`
*   **Description:** Updates stored position (`x`, `y`, `z`) and node index/tags for a given night light.
*   **Parameters:**  
    - `nightlight` (Entity) — the night light entity to update.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_registernightlight` — triggers internal registration of a night light.  
  - `onremove` (on night lights) — cleans up the night light from tracking when removed.  
  - `onbuilt`, `entitywake`, `entitysleep` — triggers position update and registration when a night light becomes active.  
- **Pushes:** None identified.
