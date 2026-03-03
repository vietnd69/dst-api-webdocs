---
id: colouradder
title: Colouradder
description: Manages additive colour blending stacks for an entity and propagates colour updates to child entities and render systems.
tags: [rendering, colour, entity, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9b8dfab5
system_scope: rendering
---

# Colouradder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Colouradder` implements a stack-based additive colour system for entities. It accumulates colour contributions from multiple sources (e.g., environmental effects, equipment, or abilities), computes the total additive colour, and applies it to the entity's rendering via `AnimState:SetAddColour` or replicated updates via `ColourAdderSync`. It also propagates its current colour to attached child entities that have their own `colouradder` or `colouraddersync` components, enabling hierarchical colour inheritance.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("colouradder")

-- Apply a red tint from a source
local source = someEntity
inst.components.colouradder:PushColour(source, 1, 0, 0, 0.5)

-- Update or replace the source's colour
inst.components.colouradder:PushColour(source, 0.8, 0.2, 0.2, 0.6)

-- Remove the source's contribution
inst.components.colouradder:PopColour(source)
```

## Dependencies & tags
**Components used:** `colouraddersync`, `AnimState`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colourstack` | table | `{}` | Maps source entities/keys to `{r, g, b, a}` colour contribution tables. |
| `children` | table | `{}` | Maps child entities to cleanup callbacks for `onremove` event handling. |
| `colour` | table | `{0, 0, 0, 0}` | Stores the most recently computed and applied additive colour `{r, g, b, a}`. |
| `_onremovesource` | function | See constructor | Callback registered for source entities' `onremove` events to auto-pop their contributions. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up all event listeners and child relationships when the component is removed from its entity.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** Safely handles cases where sources or children have already been removed.

### `AttachChild(child)`
*   **Description:** Registers a child entity to inherit the parent's current additive colour. Applies the colour immediately and listens for the child’s removal to auto-detach.  
*   **Parameters:**  
    * `child` (Entity) - The child entity to attach.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if child is already attached. Applies colour via `colouradder`, `colouraddersync`, or `AnimState` in that priority order.

### `DetachChild(child)`
*   **Description:** Removes a child from the inheritance list and triggers the child to remove the parent's colour contribution.  
*   **Parameters:**  
    * `child` (Entity) - The child entity to detach.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if child is not attached. Only notifies `colouradder` on the child.

### `GetCurrentColour()`
*   **Description:** Returns the currently applied additive colour without recalculating.  
*   **Parameters:** None.  
*   **Returns:** `r, g, b, a` (all numbers in `[0, 1]`) — the additive colour values.  

### `CalculateCurrentColour()`
*   **Description:** Sums all contributions in `colourstack` and clamps each channel to `[0, 1]`.  
*   **Parameters:** None.  
*   **Returns:** `r, g, b, a` (all numbers in `[0, 1]`) — the computed additive colour.  

### `OnSetColour(r, g, b, a)`
*   **Description:** Updates the stored and applied colour, notifying the network/animation layer and all attached children.  
*   **Parameters:**  
    * `r, g, b, a` (numbers in `[0, 1]`) — the new additive colour values.  
*   **Returns:** Nothing.  

### `PushColour(source, r, g, b, a)`
*   **Description:** Adds or updates a colour contribution from a specific source to the stack. Handles zero-alpha/zero-colour inputs by calling `PopColour`. Triggers recalculation and propagation only if the colour changes.  
*   **Parameters:**  
    * `source` (Entity or any hashable key) - Identifier for the colour source (used to remove it later).  
    * `r, g, b, a` (numbers in `[0, 1]`) — colour contribution. `a` defaults to 0 if omitted.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if all parameters are `nil` or if `r=g=b=a=0` (which triggers `PopColour` instead). Registers `onremove` listener for entity-type sources.

### `PopColour(source)`
*   **Description:** Removes a colour contribution from the stack and recalculates the net additive colour.  
*   **Parameters:**  
    * `source` (Entity or any hashable key) - The colour source to remove.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if source has no entry in `colourstack`.

### `GetDebugString()`
*   **Description:** Returns a human-readable multi-line string summarizing the current colour and all stack entries. Useful for debugging.  
*   **Parameters:** None.  
*   **Returns:** `str` (string) — formatted like `"Current Colour: (0.50, 0.50, 0.50, 0.80)\n\t[Entity]: (0.25, 0.25, 0.25, 0.50)"`.  

## Events & listeners
- **Listens to:**  
  - `"onremove"` on source entities (via `ListenForEvent`) — triggers auto-pop of that source’s colour contribution.  
  - `"onremove"` on child entities — triggers child cleanup callback which removes child from `self.children`.  
- **Pushes:** None.  
