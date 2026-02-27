---
id: instrument
title: Instrument
description: Manages audio playback and sound propagation for in-game musical instruments by handling playback callbacks and broadcasting sound to nearby listeners.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: audio
source_hash: 2ea7b8c5
---

# Instrument

## Overview
This component enables an entity to function as a musical instrument within the Entity Component System. It manages the full lifecycle of instrument playback—including pre-play, hearing, and post-play events—and broadcasts audio to eligible listeners within a configurable radius using positional entity queries.

## Dependencies & Tags
- **Components Used:** None directly added or required.
- **Tags Used:** Excludes `"FX"`, `"DECOR"`, and `"INLIMBO"` entities when locating listeners for sound propagation (defined in `NOTAGS`).
- **External Dependencies:** Relies on `TheSim:FindEntities()` and `Transform:GetWorldPosition()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity this component is attached to. |
| `range` | `number` | `15` | Maximum radius (in units) around the musician within which listeners can hear the instrument. |
| `onheard` | `function?` | `nil` | Callback invoked for each eligible listener when the instrument is played. Signature: `fn(listener, musician, instrument_inst)`. |
| `onplayed` | `function?` | `nil` | Callback invoked immediately before sound propagation. Signature: `fn(instrument_inst, musician)`. |
| `onfinishedplaying` | `function?` | `nil` | Callback invoked after sound propagation completes. Signature: `fn(instrument_inst, musician)`. |
| `override_build` | `string?` | `nil` | Custom asset build name override for the instrument model. |
| `override_symbol` | `string?` | `nil` | Custom symbol override for the instrument's visual representation. |
| `override_sound` | `string?` | `nil` | Custom sound event name override for playback. |

## Main Functions

### `SetOnHeardFn(fn)`
* **Description:** Sets the callback function invoked once for each listener within range when the instrument is played.  
* **Parameters:**  
  `fn` (function): A callback with signature `(listener_entity, musician_entity, instrument_entity)`.

### `SetOnPlayedFn(fn)`
* **Description:** Sets the callback function invoked immediately before sound propagation begins.  
* **Parameters:**  
  `fn` (function): A callback with signature `(instrument_entity, musician_entity)`.

### `SetOnFinishedPlayingFn(fn)`
* **Description:** Sets the callback function invoked after sound propagation completes.  
* **Parameters:**  
  `fn` (function): A callback with signature `(instrument_entity, musician_entity)`.

### `SetRange(range)`
* **Description:** Updates the maximum hearing radius for the instrument.  
* **Parameters:**  
  `range` (number): New radius value (must be ≥ 0).

### `SetAssetOverrides(build, symbol, sound)`
* **Description:** Configures custom asset identifiers for the instrument’s model, visual symbol, and sound. These are stored for later use by other systems (e.g., animations or prefabs).  
* **Parameters:**  
  `build` (string): Asset build name.  
  `symbol` (string): Symbol/texture name.  
  `sound` (string): Sound event name.

### `GetAssetOverrides()`
* **Description:** Returns the currently configured asset overrides.  
* **Returns:**  
  `build` (string?), `symbol` (string?), `sound` (string?) — All three in that order.

### `Play(musician)`
* **Description:** Executes the instrument’s playback logic: triggers `onplayed`, finds listeners in range, invokes `onheard` for each, then triggers `onfinishedplaying`.  
* **Parameters:**  
  `musician` (Entity): The entity playing the instrument. Its position is used to locate listeners.  
* **Returns:**  
  `true` (boolean) — Always returns `true`.

## Events & Listeners
- **Listens to:** None (component does not register event listeners).
- **Triggers:** Uses callback functions (`onheard`, `onplayed`, `onfinishedplaying`) to simulate events—not the event system (`inst:PushEvent`).