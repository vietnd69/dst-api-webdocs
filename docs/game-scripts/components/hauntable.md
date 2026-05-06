---
id: hauntable
title: Hauntable
description: Manages ghost haunting mechanics and visual effects for entities that can be haunted by player ghosts.
tags: [ghost, haunting, effects]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 851fd94d
system_scope: entity
---

# Hauntable

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Hauntable` enables entities to be haunted by player ghosts, triggering visual effects, cooldown timers, and optional callback functions. This component is commonly added to structures, items, and creatures that should react to ghost interactions. It manages haunt state, panic timers, flicker effects, and shader-based visual feedback. Works closely with the `itemmimic` component for special haunt behaviors.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hauntable")
inst.components.hauntable:SetHauntValue(TUNING.HAUNT_COOLDOWN_MEDIUM)
inst.components.hauntable:SetOnHauntFn(function(inst, haunter)
    return true
end)
inst.components.hauntable:DoHaunt(player)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accesses HAUNT_PANIC_TIME_SMALL, HAUNT_INSTANT_REZ, HAUNT_COOLDOWN_MEDIUM, HAUNT_COOLDOWN_SMALL constants

**Components used:**
- `itemmimic` -- checked in DoHaunt(); TurnEvil() called if present

**Tags:**
- `haunted` -- added when haunted, removed on unhaunt or component removal

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onhaunt` | function | `DefaultOnHauntFn` | Callback fired when haunt is attempted; returns true for success. |
| `onunhaunt` | function | `nil` | Callback fired when haunt ends. |
| `haunted` | boolean | `false` | Current haunt state of the entity. |
| `hauntvalue` | any | `nil` | Custom value associated with the haunt; not wiped if `no_wipe_value` is true. |
| `no_wipe_value` | boolean | `false` | If true, `hauntvalue` persists after haunt. |
| `cooldowntimer` | number | `0` | Remaining time before haunt cooldown expires. |
| `cooldown` | number | `nil` | Custom cooldown duration; falls back to TUNING constants if nil. |
| `cooldown_on_successful_haunt` | boolean | `true` | Whether to start cooldown timer on successful haunt. |
| `panic` | boolean | `false` | Whether entity is in panic state from haunting. |
| `panictimer` | number | `0` | Remaining panic duration. |
| `usefx` | boolean | `true` | Whether visual flicker effects are enabled. |
| `flicker` | string | `"off"` | Current flicker state: `"off"`, `"on"`, or `"fadeout"`. |

## Main functions
### `SetOnHauntFn(fn)`
* **Description:** Sets the callback function invoked when a haunt is attempted. The function should return true for successful haunts and nil/false for unsuccessful haunts.
* **Parameters:** `fn` -- function(inst, haunter) returning boolean or nil
* **Returns:** None
* **Error states:** None

### `SetOnUnHauntFn(fn)`
* **Description:** Sets the callback function invoked when the haunt effect expires or is stopped.
* **Parameters:** `fn` -- function(inst) called on unhaunt
* **Returns:** None
* **Error states:** None

### `SetHauntValue(val)`
* **Description:** Sets a custom value associated with the haunt and prevents it from being wiped after haunt completes.
* **Parameters:** `val` -- any value to store; nil values are ignored
* **Returns:** None
* **Error states:** None

### `Panic(panictime)`
* **Description:** Triggers panic state on the entity, setting haunted flag and panic timer. Starts component updating.
* **Parameters:** `panictime` -- duration in seconds; defaults to TUNING.HAUNT_PANIC_TIME_SMALL if nil
* **Returns:** None
* **Error states:** None

### `StartFX(noflicker)`
* **Description:** Starts visual flicker effects if usefx is enabled and noflicker is not true.
* **Parameters:** `noflicker` -- boolean to skip flicker advancement
* **Returns:** None
* **Error states:** None

### `AdvanceFlickerState()`
* **Description:** Cycles the flicker state through off → on → fadeout → off sequence.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `StopFX()`
* **Description:** Stops visual effects by setting flicker to fadeout and advancing state to guarantee off.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `DoHaunt(doer)`
* **Description:** Main haunt trigger function. Checks onhaunt callback, handles itemmimic special case, applies haunt effects, and starts cooldown.
* **Parameters:** `doer` -- the entity performing the haunt (typically a player ghost)
* **Returns:** None
* **Error states:** None

### `SetAnimStateGetterFn(fn)`
* **Description:** Sets a custom function to retrieve the animation state, overriding default AnimState access.
* **Parameters:** `fn` -- function(inst) returning AnimState
* **Returns:** None
* **Error states:** None

### `GetAnimState()`
* **Description:** Returns the animation state for the entity, using custom getter if set or default AnimState otherwise. Returns nil if AnimState is missing and no custom getter is set.
* **Parameters:** None
* **Returns:** AnimState instance or `nil` if missing
* **Error states:** None

### `StartShaderFx()`
* **Description:** Enables haunted shader effect on the entity's animation state.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `GetAnimState()` returns nil and SetHaunted is called on it.

### `StopShaderFX()`
* **Description:** Disables haunted shader effect on the entity's animation state.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `GetAnimState()` returns nil (missing AnimState component), as `SetHaunted` is called on the result without a nil check despite the IsValid guard.

### `IsHaunted()`
* **Description:** Returns the current haunt state of the entity.
* **Parameters:** None
* **Returns:** boolean -- true if currently haunted
* **Error states:** None

### `StopHaunt()`
* **Description:** Stops the haunt effect, resets cooldown timer, calls onunhaunt callback, and stops shader effects.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `TryStopUpdating()`
* **Description:** Stops component updating if neither haunted nor panic states are active.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Update loop called each frame when component is updating. Decrements cooldown and panic timers, advances flicker state near end of cooldown.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** None
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Stops all effects and removes haunted tag.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** None identified
- **Pushes:** `haunted` -- fired in DoHaunt() when haunt is attempted