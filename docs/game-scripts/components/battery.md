---
id: battery
title: Battery
description: Manages whether an entity can be used as a power source and tracks usage callbacks for gameplay interactions.
tags: [power, inventory, utility]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5ad54de1
system_scope: entity
---

# Battery

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Battery` is a lightweight component that marks an entity as a potential power source by adding the `battery` tag. It supports custom logic for determining whether the entity can be used and for executing side effects when it is used, via optional callback functions (`canbeused` and `onused`). This component is typically attached to items or prefabs intended to function as batteries or consumable power sources in the game.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("battery")

-- Optional: Define custom behavior
inst.components.battery.canbeused = function(inst, user)
    return user:HasTag("wielder")
end

inst.components.battery.onused = function(inst, user)
    inst:PushEvent("battery_used", { user = user })
end

-- Later in gameplay:
if inst.components.battery:CanBeUsed(player) then
    inst.components.battery:OnUsed(player)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `battery` tag; removes `battery` tag on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbeused` | function or `nil` | `nil` | Optional callback `(inst, user) -> boolean` that determines if the battery can be used by a given user. If `nil`, defaults to `true`. |
| `onused` | function or `nil` | `nil` | Optional callback `(inst, user)` executed when the battery is used. No return value. |

## Main functions
### `CanBeUsed(user)`
*   **Description:** Checks whether the battery entity can be used by the specified user. Delegates to `self.canbeused` if defined, otherwise returns `true`.
*   **Parameters:** `user` (entity instance) — the entity attempting to use the battery.
*   **Returns:** `true` if usage is allowed, `false` otherwise.
*   **Error states:** Returns `true` if `canbeused` callback is not set.

### `OnUsed(user)`
*   **Description:** Executes the usage callback `self.onused`, if defined, allowing custom logic (e.g., damage removal, sound, or event triggers).
*   **Parameters:** `user` (entity instance) — the entity that used the battery.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `onused` callback is not set.

## Events & listeners
None identified.
