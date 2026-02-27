---
id: lunarsupernovablocker
title: Lunarsupernovablocker
description: This component manages visual and logical blocking of lunar supernovae effects for an entity by tracking valid sources and rendering corresponding effects.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: eeb1d0fc
---

# Lunarsupernovablocker

## Overview
This component acts as a dynamic filter for lunar supernovae effects: it tracks one or more potential supernova sources, spawns and updates visual effect proxies (e.g., rotating "robot leg" FX), applies flickering colour modulation, and ensures effects are removed when sources become invalid, leave the arena, or exceed the allowed distance. It also maintains a `"lunarsupernovablocker"` tag on its entity and integrates with the `colouradder` component for visual effects.

## Dependencies & Tags
- Adds tag: `"lunarsupernovablocker"` (on creation)
- Removes tag: `"lunarsupernovablocker"` (on removal)
- Relies on components: `Transform`, `colouradder`
- Uses external prefabs: `"wagboss_robot_leg_fx"`
- Uses utility modules: `easing`, `prefabs/wagboss_util`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity passed to the constructor. |
| `sources` | `table` | `{}` | Dictionary mapping valid supernova source entities to their corresponding FX instances. |
| `onstartblockingfn` | `function?` | `nil` | Optional callback executed when the first source is added (triggers blocking mode). |
| `onstopblockingfn` | `function?` | `nil` | Optional callback executed when the last source is removed (triggers unblocking mode). |
| `flickerdelay` | `boolean` | `nil` (initialized in `AddSource`) | Controls timing of flicker updates—toggled each frame until `UpdateFlicker()` triggers colour change. |

## Main Functions

### `AddSource(source)`
* **Description:** Registers a new supernova source, spawns an associated FX entity, and starts periodic updates if this is the first source. Ensures no duplicate sources are added.
* **Parameters:**
  - `source` (`Entity`): A valid entity representing a supernova source; must have a `Transform` and possibly `sg` (state graph) components.

### `RemoveSource(source)`
* **Description:** Unregisters a source, destroys its associated FX, stops component updates if no sources remain, and pops the colour modifier from `colouradder`.
* **Parameters:**
  - `source` (`Entity`): The source entity to remove.

### `SetOnStartBlockingFn(fn)`
* **Description:** Sets the optional callback triggered when the first source is successfully added.
* **Parameters:**
  - `fn` (`function`): A function that receives `self.inst` (the blocker entity) as argument.

### `SetOnStopBlockingFn(fn)`
* **Description:** Sets the optional callback triggered when the last source is removed.
* **Parameters:**
  - `fn` (`function`): A function that receives `self.inst` (the blocker entity) as argument.

### `UpdateFlicker()`
* **Description:** Toggles flicker state and, on alternating ticks, applies a dynamically computed RGBA alpha modifier to the entity via `colouradder`, using `easing.inOutQuad` with randomized brightness.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main update loop called periodically while sources exist. Performs:
  - Flicker effect update
  - Validation of all registered sources (checks validity, `"supernovaburning"` state tag)
  - Arena and distance checks (using world coordinates)
  - FX positioning and visibility updates (hides FX if source is at same XZ position; otherwise rotates it toward the source).
* **Parameters:**
  - `dt` (`number`): Delta time since last frame.

## Events & Listeners
None identified (this component does not register for or dispatch any events via `inst:ListenForEvent` or `inst:PushEvent`).