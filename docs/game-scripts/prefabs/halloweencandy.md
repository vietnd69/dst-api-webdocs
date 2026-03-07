---
id: halloweencandy
title: Halloweencandy
description: Generates and configures 14 distinct Halloween-themed candy prefabs with unique nutritional values and visual properties.
tags: [inventory, food, halloween]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1c48e624
system_scope: inventory
---

# Halloweencandy

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines a factory function `MakeCandy(num)` that constructs and returns 14 unique `Prefab` instances representing Halloween candy items. Each candy variant is configured with specific food type, health, hunger, and sanity values, along with an associated animation and floater behavior. The prefabs are marked with tags like `cattoy`, `halloweencandy`, and `pre-preparedfood`, and include standard inventory-related components (`edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`, `bait`) as well as physics and animation systems.

## Usage example
```lua
-- Create the fifth Halloween candy variant (Catcoon Candy)
local candy5 = require "prefabs/halloweencandy"
local candy_entity = candy5()

-- Access its edible component properties
local health = candy_entity.components.edible.healthvalue
local sanity = candy_entity.components.edible.sanityvalue
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`, `bait`  
**Tags:** `cattoy`, `halloweencandy`, `pre-preparedfood`

## Properties
No public properties. This file exports `Prefab` instances via a factory function, not a reusable component class.

## Main functions
### `MakeCandy(num)`
*   **Description:** Constructs and returns a `Prefab` for a specific candy variant, identified by `num` (1-based index into `candyinfo`). Defines entity structure, animation, tags, components, and network behavior.
*   **Parameters:** `num` (number) - Index (1 to `NUM_HALLOWEENCANDY`) selecting which candy to generate.
*   **Returns:** `Prefab` — A fully configured prefab definition ready for use in the world.
*   **Error states:** Asserts `#candyinfo == NUM_HALLOWEENCANDY`; will fail if the count does not match.

## Events & listeners
None identified. This file does not register or push any events directly.