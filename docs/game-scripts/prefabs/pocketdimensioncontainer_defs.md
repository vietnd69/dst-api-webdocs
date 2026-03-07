---
id: pocketdimensioncontainer_defs
title: Pocketdimensioncontainer Defs
description: Defines metadata configurations for portal containers used in the Pocket Dimension.
tags: [pocketdimension, portal, ui]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ff313878
system_scope: entity
---

# Pocketdimensioncontainer Defs

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketdimensioncontainer_defs.lua` provides static definitions for portal container prefabs used in the Pocket Dimension. Each entry maps a container name to its associated prefab, UI animation asset, and widget name, and may include tags (e.g., for spoiler suppression). This data is consumed at runtime to instantiate and display appropriate portal UI when entering the Pocket Dimension.

## Usage example
```lua
local defs = require "prefabs/pocketdimensioncontainer_defs"
for _, def in ipairs(defs.POCKETDIMENSIONCONTAINER_DEFS) do
    print(def.name, def.prefab, def.ui, def.widgetname)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** `spoiler` (applied only to `"shadow"` entry)

## Properties
No public properties. This module exports a single constant table `POCKETDIMENSIONCONTAINER_DEFS`.

## Main functions
None identified.

## Events & listeners
None identified.