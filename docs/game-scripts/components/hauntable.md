---
id: hauntable
title: Hauntable
description: Manages haunting mechanics—including cooldowns, visual flicker effects, and haunted state—for entities that can be haunted or cause haunting.
tags: [haunting, visual, status, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dd2ee474
system_scope: entity
---

# Hauntable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Hauntable` component enables an entity to enter a *haunted* state—typically triggered by other entities—and provides support for cooldowns, visual effects (flickering animation and shader-based haunting), and optional hooks for custom haunting logic. It is commonly attached to props (e.g., haunted houses, specific items) that may be turned evil or cause haunting events. The component integrates with the `ItemMimic` component: if the entity has an `itemmimic` component, haunting triggers `ItemMimic:TurnEvil` instead of applying a direct haunt state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hauntable")
inst.components.hauntable:SetHauntValue(TUNING.HAUNT_SMALL)
inst.components.hauntable:SetOnHauntFn(function(inst, haunter) return haunter:HasTag("player") end)
inst.components.hauntable:DoHaunt(some_entity)
```

## Dependencies & tags
**Components used:** `itemmimic` (checked for existence), `AnimState` (via `inst.AnimState`), `components.inventoryitem`, `components.inventory`, `components.container`, `components.sanity`, `components.inventoryitem:GetGrandOwner()`, `components.inventory:DropItem()`, `components.container:DropItem()`  
**Tags:** Adds/Removes `"haunted"` tag based on `haunted` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onhaunt` | function | `DefaultOnHauntFn` | Callback invoked during `DoHaunt`; must return `true` for successful haunt (triggers haunter effects) or `nil`/`false` for failure. |
| `onunhaunt` | function | `nil` | Optional callback invoked when haunt ends (e.g., cooldown expires). |
| `haunted` | boolean | `false` | Whether the entity is currently in a haunted state. |
| `hauntvalue` | number | `nil` | Optional numeric haunt duration or special value (e.g., `TUNING.HAUNT_INSTANT_REZ`). |
| `no_wipe_value` | boolean | `false` | If `true`, retain `hauntvalue` after a successful haunt; otherwise, reset it to `nil`. |
| `cooldown` | number | `nil` | Base cooldown duration (seconds); if `nil`, defaults from `TUNING` are used. |
| `cooldown_on_successful_haunt` | boolean | `true` | Whether a cooldown is started on successful haunt. |
| `panic` | boolean | `false` | Whether the entity is in a panic state (short-term haunted state, e.g., during ghost events). |
| `panictimer` | number | `0` | Countdown timer for panic state (seconds). |
| `cooldowntimer` | number | `0` | Countdown timer for haunt cooldown (seconds). |
| `usefx` | boolean | `true` | Whether visual flicker effects are enabled. |
| `flicker` | string | `"off"` | Current flicker state: `"off"`, `"on"`, or `"fadeout"`. |

## Main functions
### `SetOnHauntFn(fn)`
* **Description:** Sets the custom function used to determine whether an entity should become haunted when `DoHaunt` is called. The function receives `(self.inst, haunter)` and should return `true` for success or `nil`/`false` for failure.
* **Parameters:** `fn` (function) — callback function for haunt determination.
* **Returns:** Nothing.

### `SetOnUnHauntFn(fn)`
* **Description:** Sets the callback invoked when the haunt ends (i.e., cooldown reaches zero).
* **Parameters:** `fn` (function) — callback function; receives `(self.inst)` as argument.
* **Returns:** Nothing.

### `SetHauntValue(val)`
* **Description:** Sets the haunt duration or special value (e.g., `TUNING.HAUNT_INSTANT_REZ`) and marks `no_wipe_value` as `true`.
* **Parameters:** `val` (number or `nil`) — numeric haunt value or special constant. If `nil`, the function does nothing.
* **Returns:** Nothing.

### `Panic(panictime)`
* **Description:** Immediately sets the entity into a panic (short-duration) haunted state. Updates `panictimer` and `cooldowntimer` to the maximum of current and input values, and starts component updates.
* **Parameters:** `panictime` (number) — duration in seconds; defaults to `TUNING.HAUNT_PANIC_TIME_SMALL` if omitted.
* **Returns:** Nothing.

### `StartFX(noflicker)`
* **Description:** Begins visual flicker effects. If `noflicker` is `false` and `usefx` is `true`, advances the flicker state.
* **Parameters:** `noflicker` (boolean) — if `true`, skip flicker animation.
* **Returns:** Nothing.

### `AdvanceFlickerState()`
* **Description:** Cycles the `flicker` state: `"off"` → `"on"` → `"fadeout"` → `"off"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopFX()`
* **Description:** Forces flicker to `"fadeout"`, then advances the flicker state once to ensure visuals are turned off.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoHaunt(doer)`
* **Description:** Attempts to haunt the entity. If `ItemMimic` exists, triggers `TurnEvil` immediately. Otherwise, invokes `onhaunt`; on success, sets `haunted=true`, applies haunting effects (including shader and cooldown), and may trigger instant respawn for player ghosts. On failure, still sets `haunted=true` and applies cooldown but skips haunter effects. Always fires `"haunted"` event.
* **Parameters:** `doer` (entity or `nil`) — the entity triggering the haunt.
* **Returns:** Nothing.
* **Error states:** If `onhaunt` is `nil`, the function does nothing.

### `StartShaderFx()`
* **Description:** Activates the haunting visual effect on the entity’s `AnimState`.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopShaderFX()`
* **Description:** Deactivates the haunting visual effect on the entity’s `AnimState`, if the entity is still valid.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Updates timers (`cooldowntimer`, `panictimer`), transitions `haunted`/`panic` states, handles flicker cycles, and stops updates when both states are inactive.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Clean-up function called when component is removed. Stops all FX (flicker and shader), and removes `"haunted"` tag.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (does not register listeners directly).
- **Pushes:** `"haunted"` — fired at the end of `DoHaunt`, regardless of success/failure.
