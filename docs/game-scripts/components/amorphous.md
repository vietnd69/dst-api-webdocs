---
id: amorphous
title: Amorphous
description: Manages shape-shifting behavior for an entity by switching between predefined forms based on inventory contents.
tags: [transform, inventory, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8f926882
system_scope: entity
---

# Amorphous

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Amorphous` enables an entity to transform into different forms based on the items present in its attached `container` component. It monitors item acquisition and loss events, and automatically triggers a morph when required conditions (e.g., possession of specific tags) are met. The component uses a list of form definitions, each specifying required item tags and callback functions for entry/exit logic. It respects a safety condition: no morph occurs while the container is open or the entity is dead.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("amorphous")
inst:AddComponent("container")
inst:AddComponent("health")

-- Define two forms: 'spider' and 'default'
inst.components.amorphous:AddForm({
    name = "spider",
    itemtags = { "weapon", "spider" },
    enterformfn = function(ent) ent:PushEvent("morph_spider") end,
    exitformfn = function(ent) ent:PushEvent("unmorph_spider") end,
})
inst.components.amorphous:AddForm({
    name = "default",
    itemtags = {},
    enterformfn = function(ent) ent:PushEvent("morph_default") end,
})

-- Trigger morph check
inst.components.amorphous:CheckForMorph()
```

## Dependencies & tags
**Components used:** `container` (checks `IsOpen()` and `FindItem()`), `health` (checks `IsDead()`)  
**Tags:** None directly added/removed — relies on tags carried by items in the container (`item:HasTag("tag")`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forms` | table | `{}` | Array of form definitions (each with `name`, `itemtags`, `enterformfn`, `exitformfn`). |
| `currentform` | table or `nil` | `nil` | Reference to the currently active form definition. |

## Main functions
### `AddForm(form)`
* **Description:** Adds a new form definition to the list of available forms.
* **Parameters:** `form` (table) - must contain `name` (string), `itemtags` (array of strings), and optionally `enterformfn`/`exitformfn` (functions). Forms are checked in order; the last form is treated as the default fallback.
* **Returns:** Nothing.
* **Error states:** No validation is performed — malformed forms may cause runtime errors during morph checks.

### `FindForm(name)`
* **Description:** Searches the internal `forms` list for a form with the given name.
* **Parameters:** `name` (string) - the name of the form to locate.
* **Returns:** (table or `nil`) - the matching form definition, or `nil` if not found.

### `MorphToForm(form, instant)`
* **Description:** Activates the given form, calling its exit/enter callbacks as needed.
* **Parameters:** 
  - `form` (table) - the target form definition.
  - `instant` (boolean) - passed to the enter/exit callbacks (typically indicates whether to use instant transitions).
* **Returns:** Nothing.
* **Error states:** If `form` is `nil`, callbacks may be invoked with `nil`, potentially causing errors if not guarded.

### `CheckForMorph()`
* **Description:** Evaluates the entity’s inventory to determine if a morph is needed. Compares current inventory against each form’s `itemtags`. Morphes to the first matching form (excluding the last/default), or to the default form if no matches.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** 
  - Returns early with no action if `forms` is empty, container is open, or entity is dead.
  - Silently skips forms if required tags are missing from any inventory item.

### `GetCurrentForm()`
* **Description:** Returns the name of the currently active form.
* **Parameters:** None.
* **Returns:** (string or `nil`) - the name of the current form, or `nil` if no form is active.

### `OnSave()`
* **Description:** Serializes current form for persistence, if applicable.
* **Parameters:** None.
* **Returns:** (table or `nil`) - `{ form = self.currentform.name }` if `currentform` exists and is *not* the last/default form; otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores a previously saved form.
* **Parameters:** `data` (table or `nil`) - the serialized save data (e.g., `{ form = "spider" }`).
* **Returns:** Nothing.
* **Error states:** If the specified form name is not found, logs `"Could not find amorphous form ..."` to console.

## Events & listeners
- **Listens to:** 
  - `"onclose"` — triggers `CheckForMorph()` via `CheckForMorph` handler.
  - `"itemget"` — triggers `CheckForMorphIfClosed()` via `CheckForMorphIfClosed` handler.
  - `"itemlose"` — triggers `CheckForMorphIfClosed()` via `CheckForMorphIfClosed` handler.
- **Pushes:** No events directly — morph transitions are implemented via callback functions (`enterformfn`, `exitformfn`) registered on form definitions.
