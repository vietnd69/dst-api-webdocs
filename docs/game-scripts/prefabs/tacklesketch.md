---
id: tacklesketch
title: Tacklesketch
description: Represents a fishing tackle blueprint prefab that teaches a specific recipe and functions as a teachable item in DST.
tags: [crafting, teacher, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1773a1fe
system_scope: crafting
---

# Tacklesketch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Tacklesketch` is a prefab definition that creates a teachable blueprint item used in DST's ocean fishing system. Each instance corresponds to a specific fishing lure or bobber recipe and is used by players to learn the corresponding crafting recipe. It integrates with the `teacher` component for recipe teaching, `named` for dynamic naming, `inventoryitem` for appearance management, and `fuel` for basic usability. The prefab supports both a generic `tacklesketch` base and 13 distinct recipe-specific variants.

## Usage example
```lua
-- To create a generic tackle sketch that defaults to the first recipe (oceanfishingbobber_ball):
local sketch = GLOBAL.Prefab("tacklesketch")()

-- To create a specific sketch variant (e.g., for "oceanfishingbobber_robin"):
local robin_sketch = GLOBAL.Prefab("oceanfishingbobber_robin_tacklesketch")()

-- Access the recipe it teaches:
local recipe_name = sketch:GetRecipeName()  -- returns "oceanfishingbobber_ball"
local specific_prefab_name = sketch:GetSpecificSketchPrefab()  -- returns "oceanfishingbobber_ball_tacklesketch"
```

## Dependencies & tags
**Components used:** `teacher`, `named`, `inventoryitem`, `fuel`, `erasablepaper`, `inspectable`  
**Tags:** Adds `tacklesketch`, ` _named`; later removes `_named` on master simulation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sketchid` | number | `1` | Index into the global `SKETCHES` array, determining which recipe the sketch teaches. |
| `GetRecipeName` | function | — | Returns the recipe string associated with the current `sketchid`. |
| `GetSpecificSketchPrefab` | function | — | Returns the prefab name string for the corresponding specific sketch variant. |

## Main functions
### `GetRecipeName(inst)`
* **Description:** Returns the recipe name string corresponding to the current sketch's `sketchid`.
* **Parameters:** `inst` (Entity) — the tackle sketch instance.
* **Returns:** string — the recipe name, e.g., `"oceanfishingbobber_robin"`.

### `GetSpecificSketchPrefab(inst)`
* **Description:** Returns the prefab name string for the recipe-specific sketch variant.
* **Parameters:** `inst` (Entity) — the tackle sketch instance.
* **Returns:** string — e.g., `"oceanfishingbobber_robin_tacklesketch"`.

### `OnTeach(inst, learner)`
* **Description:** Handler invoked when another entity learns from this sketch. Broadcasts a `"learnrecipe"` event to the learner.
* **Parameters:**  
  - `inst` (Entity) — the tackle sketch instance.  
  - `learner` (Entity) — the entity receiving the recipe.
* **Returns:** Nothing.

### `MakeSketchPrefab(sketchid)`
* **Description:** Factory function generator that creates the prefab constructor for a specific tackle sketch variant.
* **Parameters:** `sketchid` (number) — the index into `SKETCHES` for this sketch type.
* **Returns:** function — a constructor function that instantiates and configures the specific sketch.

### `fn()`
* **Description:** Main constructor for the base `tacklesketch` prefab. Sets up core components, animations, tags, and default properties.
* **Parameters:** None.
* **Returns:** Entity — the initialized tackle sketch instance.

## Events & listeners
- **Listens to:** None explicitly defined in this file; event handling is delegated to component callbacks (`OnLoad`, `OnSave`, `onteach`).
- **Pushes:** `"learnrecipe"` — fired on the learner entity during teaching (`OnTeach`); `"imagechange"` — indirectly via `inventoryitem:ChangeImageName()` during load or variant creation.