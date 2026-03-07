---
id: gravediggable
title: Gravediggable
description: Marks an entity as diggable by grave-digging actions and provides a hook for custom dig behavior.
tags: [digging, interaction, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 96c5964b
system_scope: entity
---

# Gravediggable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `GraveDiggable` component enables an entity to be targeted and dug up by grave-digging actions (e.g., using a shovel). It manages whether the entity is currently diggable via the `canbedug` property and exposes a customizable `ondug` callback that executes when a dig attempt occurs. The component automatically toggles the `gravediggable` tag on the entity based on the diggable state to support action filtering in the UI (e.g., component actions).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gravediggable")
inst.components.gravediggable.ondug = function(grave, tool, doer)
    -- Custom logic when the grave is dug
    return true, nil
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `gravediggable` at construction; removes it when component is removed or when `canbedug` is set to `false`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbedug` | boolean | `true` | Whether the entity is currently diggable. Controls presence of `gravediggable` tag. |
| `ondug` | function | `nil` | Optional callback invoked on dig attempt. Signature: `function(inst, tool, doer) → success: boolean, reason: ?string` |

## Main functions
### `DigUp(tool, doer)`
*   **Description:** Executes the dig action. Invokes the `ondug` callback if defined, otherwise returns `true, nil`.  
*   **Parameters:**  
    *   `tool` (TheEntity) — The entity used to dig (e.g., shovel).  
    *   `doer` (TheCharacter) — The character performing the dig.  
*   **Returns:**  
    *   `success` (boolean) — Whether the dig succeeded.  
    *   `reason` (?string) — Optional failure reason string if `ondug` returns `false`.  
*   **Error states:** Returns `true, nil` if `ondug` is `nil` or not set.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified

## Save/Load support
- **`OnSave()`**: Returns `{ canbedug = self.canbedug }` for persistence.  
- **`OnLoad(data)`**: Restores `canbedug` from `data.canbedug`, defaulting to `true` if missing.  

## Notes
- The component adds the `gravediggable` tag unconditionally during construction to ensure the action exists in the UI; the `canbedug` setter (`oncanbedug`) dynamically manages the tag presence based on current diggable state.  
- This component does not handle dig animation or particle effects—those are typically managed by the action itself or the entity's stategraph.
