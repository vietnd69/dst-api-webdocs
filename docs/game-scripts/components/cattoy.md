---
id: cattoy
title: Cattoy
description: Manages play interactions for toy items that creatures can interact with.
tags: [entity, interaction, toy]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: components
source_hash: 5361167b
system_scope: entity
---

# Cattoy

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`Cattoy` manages play interactions for toy items that creatures can interact with. It provides a callback system for custom play behavior and supports airborne play detection. While the component itself does not add tags, modders should consider adding "cattoy" or "cattoyairborne" tags to entities so creatures can identify items to play with.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cattoy")

-- Set a custom play callback
inst.components.cattoy:SetOnPlay(function(inst, doer, is_airborne)
    -- Custom play logic here
    return true
end)

-- Enable bypass for last air time check
inst.components.cattoy:SetBypassLastAirTime(true)

-- Trigger play interaction
inst.components.cattoy:Play(doer, false)
```

## Dependencies & tags
**Components used:**
- None identified

**Tags:**
- None (component does not add/remove tags; "cattoy" and "cattoyairborne" tags are recommended for entity identification by creatures)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | entity instance | The owning entity instance. |
| `onplay_fn` | function | `nil` | Callback function triggered when Play() is called. |
| `bypass_last_air_time` | boolean | `nil` | Flag to bypass last air time checks for airborne play. |

## Main functions
### `SetOnPlay(fn)`
* **Description:** Sets the callback function that executes when the toy is played with.
* **Parameters:** `fn` -- function to call when Play() is invoked. Should accept `(inst, doer, is_airborne)` parameters.
* **Returns:** None
* **Error states:** None

### `SetBypassLastAirTime(boolval)`
* **Description:** Enables or disables bypassing of last air time checks for airborne play interactions.
* **Parameters:** `boolval` -- boolean value to set the bypass flag. Passes `nil` if `false` or `nil`.
* **Returns:** None
* **Error states:** None

### `ShouldBypassLastAirTime()`
* **Description:** Returns the current state of the bypass last air time flag.
* **Parameters:** None
* **Returns:** `true` if bypass is enabled, `nil` otherwise.
* **Error states:** None

### `Play(doer, is_airborne)`
* **Description:** Triggers the play interaction. Calls the `onplay_fn` callback if one is set.
* **Parameters:**
  - `doer` -- entity performing the play action
  - `is_airborne` -- boolean indicating if the play is happening while airborne
* **Returns:** Returns the result of `onplay_fn` if set, otherwise `false`.
* **Error states:** None

## Events & listeners
None.