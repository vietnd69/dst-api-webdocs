---
id: bathbombable
title: Bathbombable
description: Manages whether an entity can be transformed by bath bombs, tracking its bath-bombable state and providing a callback hook for bath-bomb activation.
tags: [item, transform, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6b34d74f
system_scope: entity
---

# Bathbombable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Bathbombable` is a lightweight component that controls whether an entity is eligible to be transformed via a bath bomb interaction. It manages a boolean flag (`can_be_bathbombed`) that determines usability and synchronizes a `bathbombable` tag on the entity. When a bath bomb is used on the entity, the `OnBathBombed` method is called to lock further interactions and trigger a custom callback if provided. The component is typically added to entities that can be temporarily or permanently altered by bath bombs (e.g., Beefalo, Pig, Wathgrathr).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bathbombable")
inst.components.bathbombable:SetOnBathBombedFn(function(inst, item, doer)
    print(inst.prefab .. " was bath-bombed by " .. doer.prefab)
end)
-- Later, during bath bomb usage:
if inst.components.bathbombable.can_be_bathbombed then
    inst.components.bathbombable:OnBathBombed(bathbomb_item, player)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or removes the tag `bathbombable` on the owning entity based on `can_be_bathbombed`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `can_be_bathbombed` | boolean | `true` | Whether the entity can currently be bath-bombed. Controls the presence of the `bathbombable` tag. |
| `is_bathbombed` | boolean | `false` | Whether the entity has been bath-bombed at least once. Reflects a one-time status. |
| `onbathbombedfn` | function or `nil` | `nil` | Optional callback invoked when `OnBathBombed` is called. Signature: `fn(inst, item, doer)`. |

## Main functions
### `SetOnBathBombedFn(new_fn)`
*   **Description:** Sets a custom callback function to be executed when the entity is bath-bombed.  
*   **Parameters:** `new_fn` (function or `nil`) — the callback to run on bath-bomb activation; receives `(self.inst, item, doer)` arguments.
*   **Returns:** Nothing.

### `OnBathBombed(item, doer)`
*   **Description:** Records that the entity has been bath-bombed, disables further bathing, and triggers the optional callback.  
*   **Parameters:**  
    - `item` (GObject) — the bath bomb item used.  
    - `doer` (GObject) — the entity that used the bath bomb.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing special on error; `onbathbombedfn` is safely ignored if `nil`.

### `DisableBathBombing()`
*   **Description:** Prevents future bath-bomb interactions without resetting the `is_bathbombed` flag. Typically used when the entity is transformed or otherwise should no longer accept bath bombs (e.g., during a cutscene).  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `Reset()`
*   **Description:** Restores bath-bomb eligibility, allowing the entity to be bath-bombed again (e.g., after a cooldown or reversion). Resets `can_be_bathbombed` but not `is_bathbombed`.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.

## Notes
- The component updates the `bathbombable` tag automatically in its constructor (via `can_be_bathbombed` field setter) and in `OnRemoveFromEntity`.
- `can_be_bathbombed` and `is_bathbombed` are not automatically synced over the network; network-aware prefabs should use a `replica` version or explicit sync if needed.
