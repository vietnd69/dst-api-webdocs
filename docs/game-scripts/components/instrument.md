---
id: instrument
title: Instrument
description: Manages the playback logic and event callbacks for in-game musical instruments, including range-based listener detection and custom asset overrides.
tags: [audio, entity, music]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2ea7b8c5
system_scope: audio
---

# Instrument

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Instrument` is a component that encapsulates the logic for playing musical instruments within the game world. It supports callback hooks for when an instrument is played, heard, or finishes playing, and allows dynamic adjustment of the hearing range. The component is typically attached to prefabs representing musical instruments and coordinates with the musician entity performing the instrument.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("instrument")
inst.components.instrument:SetRange(20)
inst.components.instrument:SetOnHeardFn(function(inst, musician) print("Heard!") end)
inst.components.instrument:SetOnPlayedFn(function(inst, musician) print("Played!") end)
inst.components.instrument:Play(musician_entity)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks for and excludes entities with tags `FX`, `DECOR`, and `INLIMBO` during listener search.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `15` | Maximum radius (in world units) within which listeners can hear the instrument. |
| `onheard` | function \| nil | `nil` | Callback invoked when the instrument is played and listeners are detected. Signature: `fn(listener, musician, instrument)` |
| `onplayed` | function \| nil | `nil` | Callback invoked immediately when the instrument starts playing. Signature: `fn(instrument_inst, musician)` |
| `onfinishedplaying` | function \| nil | `nil` | Callback invoked after the instrument finishes playing (e.g., at end of animation/sound). Signature: `fn(instrument_inst, musician)` |
| `override_build` | string \| nil | `nil` | Optional custom build asset to use for the instrument. |
| `override_symbol` | string \| nil | `nil` | Optional custom symbol/texture to override the instrument’s visual representation. |
| `override_sound` | string \| nil | `nil` | Optional custom sound event to use instead of the default. |

## Main functions
### `SetOnHeardFn(fn)`
* **Description:** Sets the callback function triggered when nearby entities hear the instrument. Typically used to play audible feedback or trigger effects for listeners.
* **Parameters:** `fn` (function) - A function accepting three arguments: `(listener: Entity, musician: Entity, instrument: Entity)`.
* **Returns:** Nothing.

### `SetOnPlayedFn(fn)`
* **Description:** Sets the callback invoked when the instrument begins playing, before any listener logic runs.
* **Parameters:** `fn` (function) - A function accepting two arguments: `(instrument: Entity, musician: Entity)`.
* **Returns:** Nothing.

### `SetOnFinishedPlayingFn(fn)`
* **Description:** Sets the callback invoked after the instrument completes its playback action (e.g., at end of animation or sound duration).
* **Parameters:** `fn` (function) - A function accepting two arguments: `(instrument: Entity, musician: Entity)`.
* **Returns:** Nothing.

### `SetRange(range)`
* **Description:** Updates the radius within which entities can hear the instrument. Controls the effective area of influence for listener detection.
* **Parameters:** `range` (number) - New hearing radius in world units.
* **Returns:** Nothing.

### `SetAssetOverrides(build, symbol, sound)`
* **Description:** Assigns optional custom assets to override default visual and audio representations of the instrument.
* **Parameters:**
  * `build` (string) — Path to custom build asset (e.g., `anim/build.zip`).
  * `symbol` (string) — Custom symbol name (e.g., `instrument_symbol.tex`).
  * `sound` (string) — Custom sound event identifier (e.g., `"sound/events/my_instrument"`).
* **Returns:** Nothing.

### `GetAssetOverrides()`
* **Description:** Returns the currently set custom asset override values.
* **Parameters:** None.
* **Returns:** `build` (string\|nil), `symbol` (string\|nil), `sound` (string\|nil).

### `Play(musician)`
* **Description:** Executes the instrument playback flow: fires the `onplayed` callback, finds and notifies listeners within `range`, then fires the `onfinishedplaying` callback.
* **Parameters:** `musician` (Entity) — The entity performing the instrument.
* **Returns:** `true` — Always returns `true` indicating successful execution.
* **Error states:** Listeners must have none of the excluded tags (`FX`, `DECOR`, `INLIMBO`) and must not be the instrument instance itself. If `onheard` is `nil`, no listener search or callback occurs.

## Events & listeners
None identified
