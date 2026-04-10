---
id: prefabskins
title: Prefabskins
description: Defines global tables mapping prefab names to skin identifiers, listing non-selectable skins, and creating an inverted lookup table for skin data in Don't Starve Together.
tags: [data, config, skins, prefabs]
sidebar_position: 10

last_updated: 2026-04-11
build_version: 719586
change_status: stable
category_type: root
source_hash: bb25d4ff
system_scope: entity
---

# Prefabskins

> Based on game build **719586** | Last updated: 2026-04-11

## Overview
`prefabskins.lua` is a data configuration file that defines global lookup tables for character, item, structure, and decoration skins. It maps prefab names to arrays of available skin identifiers via `PREFAB_SKINS`, lists non-selectable skin prefabs in `PREFAB_SKINS_SHOULD_NOT_SELECT`, and generates an inverted `PREFAB_SKINS_IDS` table for reverse lookups. This file is required by systems that need to resolve skin ownership or validate skin availability without attaching to specific entity instances.

## Usage example
```lua
local PrefabSkins = require "prefabskins"

-- Check available skins for a specific prefab
local skins = PrefabSkins.PREFAB_SKINS["wilson"]
if skins then
    print("Wilson has " .. #skins .. " available skins")
end

-- Verify if a skin is selectable
local is_selectable = not PrefabSkins.PREFAB_SKINS_SHOULD_NOT_SELECT["skin_name"]

-- Lookup prefab by skin ID
local prefab = PrefabSkins.PREFAB_SKINS_IDS["skin_id"]
```

## Dependencies & tags
**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
None.

## Events & listeners
This file is not event-driven.
