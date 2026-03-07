---
id: singable
title: Singable
description: Provides a sing interaction that triggers a song effect on a singer with the SingingInspiration component.
tags: [audio, interaction, song]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4e64705d
system_scope: entity
---

# Singable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Singable` component enables an entity to be sung to by players or other entities. When the `Sing` function is called on this component, it invokes a custom callback (`onsingfn`) if one is set and then adds the entity's song data to the singer's `SingingInspiration` component. This component does not manage song state directly but serves as a trigger point for song application logic. It is typically attached to objects that represent musical instruments or song sources (e.g., windchimes, instruments).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("singable")
inst.songdata = { battlesong_netid = 123, INSTRUMENT = "flute" }

inst.components.singable:SetOnSing(function(inst, singer)
    print(inst.prefab .. " was sung to by " .. singer.prefab)
end)

-- Later, when a player sings to it:
inst.components.singable:Sing(player)
```

## Dependencies & tags
**Components used:** `singinginspiration`, `finiteuses` (commented out, not active)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity reference | — | The entity instance that owns this component. |
| `onsingfn` | function or nil | `nil` | Optional callback function called when `Sing` is invoked. Takes `(target_inst, singer)` as arguments. |

## Main functions
### `SetOnSing(onsingfn)`
*   **Description:** Sets the callback function to execute when the sing interaction occurs. The callback receives the target entity and the singer as arguments.
*   **Parameters:** `onsingfn` (function or nil) — function to call during sing, or `nil` to clear.
*   **Returns:** Nothing.

### `Sing(singer)`
*   **Description:** Executes the sing interaction. If a callback is set, it is invoked. Then, the entity's `songdata` is added to the singer’s `SingingInspiration` component. Has no effect if the singer lacks the `SingingInspiration` component.
*   **Parameters:** `singer` (Entity reference) — the entity performing the sing action.
*   **Returns:** Nothing.
*   **Error states:** If `singer.components.singinginspiration` is `nil`, prints an error message `"ATTEMPTING TO SING WITH NO INSPIRATION"` and returns early.

## Events & listeners
None identified.
