---
id: moon_altar_break
title: Moon Altar Break
description: Creates a one-time visual effect prefab for the breaking animation of moon altar components.
tags: [fx, visual, animation]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 02b22a2b
system_scope: fx
---

# Moon Altar Break

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This script defines a reusable function `make_break_fx` that generates FX prefabs for the destruction animation of moon altar parts (e.g., `moon_altar_break`, `moon_altar_claw_break`, `moon_altar_crown_break`). Each generated prefab plays a specific "break" animation and is automatically removed once the animation completes. It is used by the game to visualize the breaking of moon altar structures during gameplay.

## Usage example
```lua
-- The prefabs are automatically returned and registered by this file:
local moon_altar_break_prefab = require "prefabs/moon_altar_break"
-- The function `make_break_fx` is not exposed externally.
-- Prefabs are consumed by elsewhere in the codebase via Prefab("moon_altar_break").
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` tag.

## Properties
No public properties

## Main functions
### `make_break_fx(name)`
* **Description:** Constructs and returns a `Prefab` that spawns a one-shot FX entity playing the "break" animation. Also creates the corresponding entity prefabs for moon altar parts by returning multiple prefab instances.
* **Parameters:**  
  `name` (string) — Base name of the altar part (e.g., `"moon_altar"`), used to derive the FX prefab name as `name.."_break"` and locate associated assets (`anim/{name}.zip`, `anim/{name}_break.zip`).
* **Returns:**  
  One or more `Prefab` objects (vararg return, e.g., `return A, B, C`).
* **Error states:** None identified — assumes assets exist.

## Events & listeners
- **Listens to:**  
  `animover` — triggers `inst.Remove`, destroying the entity when the break animation finishes.
- **Pushes:** None identified.