---
id: gem
title: Gem
description: Defines a family of gem prefabs with shared behavior including inventory physics, repair capabilities, and sparkle animation effects.
tags: [inventory, crafting, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 94eb5351
system_scope: inventory
---

# Gem

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gem` file defines factory functions (`buildgem`) that create multiple gem prefab variants (purple, blue, red, orange, yellow, green, opal). Each gem is an inventory item with `edible`, `repairer`, `stackable`, `tradable`, `bait`, `inspectable`, and `inventoryitem` components. Gems also include sparkle animations and are usable as bait and repair materials. The system relies on external components to handle hunger restoration, repair work, and stacking behavior.

## Usage example
```lua
-- Create a blue gem (non-precious)
local bluegem = Prefab("bluegem", "prefabs/gem")

-- Create a purple gem (precious)
local purplegem = Prefab("purplepreciousgem", "prefabs/gem")

-- In an entity's definition, instantiate and customize if needed:
local inst = Prefab("bluegem", "prefabs/gem")()
inst.components.repairer.workrepairvalue = 100
```

## Dependencies & tags
**Components used:** `edible`, `repairer`, `stackable`, `tradable`, `bait`, `inspectable`, `inventoryitem`  
**Tags:** `molebait`, `quakedebris`, `gem`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colour` | string | (param value) | The colour string (e.g. `"blue"`, `"purple"`) identifying this gem variant. |

## Main functions
### `buildgem(colour, precious)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a specific gem colour. Handles property setup, component instantiation, animations, and tag assignment.
*   **Parameters:** `colour` (string) – the base name for the gem (e.g., `"green"`, `"opal"`); `precious` (boolean) – if `true`, appends `"preciousgem"` to the prefab name.
*   **Returns:** `Prefab` – a fully configured prefab function.
*   **Error states:** No error handling is present in the function body; incorrect `colour` values may result in missing animations or assets.

### `Sparkle(inst)`
*   **Description:** Internal helper that triggers a sparkle animation sequence on the gem. Plays a sparkle animation, then returns to idle.
*   **Parameters:** `inst` (Entity) – the gem entity instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the sparkle animation is already playing.

## Events & listeners
- **Listens to:** None (uses one-time `DoTaskInTime` scheduling for sparkle effects).  
- **Pushes:** None (does not fire custom events).