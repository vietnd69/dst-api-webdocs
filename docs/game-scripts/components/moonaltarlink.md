---
id: moonaltarlink
title: Moonaltarlink
description: Manages bidirectional linking between an entity and a set of moon altar targets, updating positions and triggering callbacks on connection or disconnection.
tags: [world, map, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 92dc9172
system_scope: world
---

# Moonaltarlink

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonAltarLink` is a lightweight component that maintains a link between a central entity (e.g., a structure or effect) and a set of moon altar target entities. It computes and sets the central entity’s world position to the average of all linked altar positions, and optionally invokes callbacks when linking or breaking the connection. It interacts exclusively with the `moonaltarlinktarget` component on target entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moonaltarlink")

-- Define altars (list of entities with moonaltarlinktarget)
local altars = {altar1, altar2, altar3}

-- Set up callbacks
inst.components.moonaltarlink.onlinkfn = function(linker, targets)
    print("Altars linked:", #targets)
end

inst.components.moonaltarlink.onlinkbrokenfn = function(linker, targets)
    print("Altar link broken")
end

-- Establish the link
inst.components.moonaltarlink:EstablishLink(altars)

-- Break the link when needed
inst.components.moonaltarlink:BreakLink()
```

## Dependencies & tags
**Components used:** `moonaltarlinktarget` (accessed via `target.components.moonaltarlinktarget`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity this component is attached to. Set automatically in constructor. |
| `altars` | table | `nil` | List of target entities linked via `moonaltarlinktarget`. Set by `EstablishLink()`. |
| `onlinkfn` | function | `nil` | Callback invoked after link is established; signature: `fn(linker_entity, altars_table)`. |
| `onlinkbrokenfn` | function | `nil` | Callback invoked after link is broken; signature: `fn(linker_entity, altars_table)`. |

## Main functions
### `EstablishLink(altars)`
*   **Description:** Establishes a link to the provided list of moon altar target entities. Calculates the centroid of their positions and sets the host entity’s position there. Updates each target’s `moonaltarlinktarget.link` property and invokes their local callbacks.
*   **Parameters:** `altars` (table) — list of entities, each expected to have a `moonaltarlinktarget` component.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes all altars have valid `Transform` and `moonaltarlinktarget` components.

### `BreakLink()`
*   **Description:** Terminates the link with all currently linked altars, clears the `link` property on each target, invokes their break callbacks, and clears the internal `altars` list. Also triggers the local break callback if defined.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.
