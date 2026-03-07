---
id: cattoy
title: Cattoy
description: Manages a callback-based interaction handler for cat toy items in DST, invoked when an entity plays with the item.
tags: [item, interaction, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ca4cc0ed
system_scope: entity
---

# Cattoy

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CatToy` is a lightweight component that enables custom behavior to be attached to cat toy items. It stores an optional callback function (`onplay_fn`) that is executed when `Play()` is invoked—typically by creatures (e.g., cats) interacting with the item. The component itself does not enforce tags or logic, but comments indicate it is designed to work with the `"cattoy"` or `"cattoyairborne"` tags on the entity instance.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cattoy")
inst.components.cattoy:SetOnPlay(function(inst, doer, is_airborne)
    print("Item played with by", doer.prefab, "airborne?", is_airborne)
    return true
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks none directly; relies on external logic (e.g., creature prefabs) to check for `"cattoy"`/`"cattoyairborne"` tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onplay_fn` | function or `nil` | `nil` | Callback function invoked on `Play()`. Signature: `(item_inst, doer, is_airborne) → boolean?`. |

## Main functions
### `SetOnPlay(fn)`
*   **Description:** Assigns the callback function to be executed when `Play()` is called.
*   **Parameters:** `fn` (function or `nil`) — a function taking three arguments (`item_inst`, `doer`, `is_airborne`) returning a boolean (or `nil`).
*   **Returns:** Nothing.

### `Play(doer, is_airborne)`
*   **Description:** Invokes the stored callback if present. Used to signal that an entity (`doer`) has interacted with the item as a cat toy.
*   **Parameters:**  
    `doer` (entity instance) — the entity performing the play action.  
    `is_airborne` (boolean) — whether the toy was airborne at time of interaction.
*   **Returns:** Returns the result of `onplay_fn(...)` if set; otherwise returns `false`.
*   **Error states:** If `onplay_fn` is `nil`, the function returns `false` and no callback is executed.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
