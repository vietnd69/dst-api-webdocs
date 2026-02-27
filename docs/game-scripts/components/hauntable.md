---
id: hauntable
title: Hauntable
description: Provides haunt mechanics to an entity, tracking haunted state, cooldowns, visual effects (flicker/shader), and custom haunt behavior via callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: dd2ee474
---

# Hauntable

## Overview
The `Hauntable` component enables entities (typically structures or objects) to become "haunted" through gameplay interactions. It manages haunted state persistence, cooldowns after haunt attempts, visual flicker effects (using animation states), shader-based haunting (via `AnimState:SetHaunted`), and configurable haunt-success logic. It also integrates with item mimics and ghost respawns under specific conditions.

## Dependencies & Tags
- Adds/removes the `"haunted"` tag on the entity (via the `haunted` property setter).
- Relies on the `inst.AnimState` component to call `SetHaunted()`.
- Interacts with `inst.components.itemmimic` if present (calls `TurnEvil` during haunt).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity (set in constructor). |
| `onhaunt` | `function(inst, haunter): boolean` | `DefaultOnHauntFn` | Callback invoked during haunt attempts; returns `true` for success (haunter effects trigger), `false`/`nil` for failure. |
| `onunhaunt` | `function(inst)` | `nil` | Callback invoked when haunt ends (cooldown expires and `haunted` becomes `false`). |
| `haunted` | `boolean` | `false` | Whether the entity is currently haunted. Setting it triggers tag add/remove. |
| `hauntvalue` | `number?` | `nil` | Optional value associated with haunt (e.g., duration). Set to `nil` on successful haunt if `no_wipe_value` is `false`. |
| `no_wipe_value` | `boolean` | `false` | If `true`, preserves `hauntvalue` across haunt attempts (typically set via `SetHauntValue`). |
| `cooldowntimer` | `number` | `0` | Remaining cooldown time in seconds. |
| `cooldown` | `number?` | `nil` | Optional base cooldown (used instead of global tuning if set). |
| `cooldown_on_successful_haunt` | `boolean` | `true` | Whether to apply a cooldown and effects on successful haunt attempts. |
| `panic` | `boolean` | `false` | Whether the entity is in panic state (overrides normal haunt cooldown). |
| `panictimer` | `number` | `0` | Remaining panic timer in seconds. |
| `usefx` | `boolean` | `true` | Whether to enable visual effects (flicker/shader). |
| `flicker` | `"off" \| "on" \| "fadeout"` | `"off"` | Current state of the animation-based flicker effect. |

## Main Functions

### `SetOnHauntFn(fn)`
* **Description:** Sets the custom logic for determining whether a haunt succeeds. The function is called with `(self.inst, haunter)` and should return `true` (success) or `false`/`nil` (failure).  
* **Parameters:**  
  - `fn`: Function to execute on haunt attempt.

### `SetOnUnHauntFn(fn)`
* **Description:** Sets a callback triggered when haunt ends (after cooldown expires and `haunted` becomes `false`).  
* **Parameters:**  
  - `fn`: Function to execute on unhaunt (accepts `(inst)`).

### `SetHauntValue(val)`
* **Description:** Assigns a haunt value and sets `no_wipe_value = true`, preventing `hauntvalue` from being cleared on successful haunt.  
* **Parameters:**  
  - `val`: The haunt value to assign (typically a number like a duration or strength).

### `Panic(panictime)`
* **Description:** Immediately sets the entity to a "panic" state (treated as haunted), resetting timers to ensure minimum duration. Starts updating the component.  
* **Parameters:**  
  - `panictime`: Duration (seconds) for panic. Defaults to `TUNING.HAUNT_PANIC_TIME_SMALL` if omitted.

### `StartFX(noflicker)`
* **Description:** Begins visual effects. If `noflicker` is falsy and `usefx` is `true`, triggers the first flicker animation state.  
* **Parameters:**  
  - `noflicker`: Optional boolean. If `true`, skips animation flicker (still applies shader effects via `StartShaderFx`).

### `AdvanceFlickerState()`
* **Description:** Advances the `flicker` state through `"off" → "on" → "fadeout" → "off"`, cycling the animation flicker.  
* **Parameters:** None.

### `StopFX()`
* **Description:** Immediately transitions the flicker state to `"fadeout"` then calls `AdvanceFlickerState()` to ensure effects terminate cleanly.  
* **Parameters:** None.

### `DoHaunt(doer)`
* **Description:** Initiates a haunt attempt on the entity. Calls `onhaunt`, handles success/failure logic (including item mimic override, ghost respawn, cooldowns, and effects). Always fires the `"haunted"` event.  
* **Parameters:**  
  - `doer`: The entity attempting the haunt (e.g., a player or ghost).

### `StartShaderFx()`
* **Description:** Enables shader-based haunting by calling `inst.AnimState:SetHaunted(true)`.  
* **Parameters:** None.

### `StopShaderFX()`
* **Description:** Disables shader-based haunting if the entity is still valid by calling `inst.AnimState:SetHaunted(false)`.  
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main update loop (runs when `haunted` or `panic` is active). Decrements timers, handles state transitions, stops shader/flicker when cooldown expires, and stops component updates when idle.  
* **Parameters:**  
  - `dt`: Delta time since last frame.

### `OnRemoveFromEntity()`
* **Description:** Cleanup called when the component is removed. Ensures effects stop and the `"haunted"` tag is removed.  
* **Parameters:** None.

## Events & Listeners
- Listens for: None explicitly (state changes are handled via property setters).
- Triggers:  
  - `"haunted"` — Pushed at the end of `DoHaunt()` regardless of outcome.  
  - `"respawnfromghost"` — Pushed on the `doer` when haunt succeeds with `hauntvalue == TUNING.HAUNT_INSTANT_REZ` and `doer` has the `"playerghost"` tag.