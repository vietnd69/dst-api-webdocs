---
id: skeleton_wizard_fire
title: Skeleton Wizard Fire
description: Static map layout data for a burnt forest area associated with the Skeleton Wizard boss encounter.
tags: [map, boss, environment, layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ae194299
system_scope: world
---

# Skeleton Wizard Fire

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Skeleton Wizard Fire` is a static Tiled map layout file defining the environment for the burnt battlefield where the Skeleton Wizard boss is fought. It includes background tile layers, an object group containing environmental objects (e.g., burnt trees, ash piles, hound bones, gunpowder), and associated object metadata such as `data.burnt = true` on certain trees. This file does *not* implement an ECS component; it is a data definition used by the world generation system to instantiate the arena during boss encounters.

## Usage example
This file is not used directly in mod code as a component. Instead, it is referenced and loaded by worldgen system scripts (e.g., via `static_layouts` task processing). A modder would typically load it like other static layouts using `StaticLayouts` utilities, for example:
```lua
local layout = require("map/static_layouts/skeleton_wizard_fire")
-- The layout is then passed to worldgen systems that spawn objects from the objectgroup
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Loads objects with `"burnt"` property in some trees' `properties` fields; no game tags are added programmatically.

## Properties
No public properties — this file is a pure data definition returning a Tiled map table.

## Main functions
No mod-facing functions — this file returns only static layout data and is not a component with methods.

## Events & listeners
Not applicable.