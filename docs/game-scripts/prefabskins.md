---
id: prefabskins
title: Prefabskins
description: This module defines the PREFAB_SKINS table mapping prefabs to skin identifiers, along with a selection blacklist and a reverse lookup table for skin IDs.
tags: [skins, prefabs, data, customization]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 541cf500
system_scope: global
---

# Prefabskins

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
The `prefabskins` module serves as a central data definition file for the skinning system in Don't Starve Together. It establishes the `PREFAB_SKINS` table, which maps specific prefab names to arrays of available skin identifier strings, enabling entity customization. Additionally, it maintains a blacklist table (`PREFAB_SKINS_SHOULD_NOT_SELECT`) to exclude specific upgraded chests and critters from standard skin selection processes, and constructs a reverse lookup table (`PREFAB_SKINS_IDS`) to map skin IDs back to their corresponding skin names per prefab. This data is referenced globally to validate and resolve skin assets during entity instantiation and inventory management.

## Usage example
```lua
-- Access the list of available skins for a specific prefab
local prefab_name = "waxwell"
local available_skins = PREFAB_SKINS[prefab_name]

-- Verify if a prefab is excluded from skin selection
if PREFAB_SKINS_SHOULD_NOT_SELECT[prefab_name] then
    return
end

-- Perform reverse lookup to find skin name from ID
local skin_id = 1001
local skin_lookup = PREFAB_SKINS_IDS[prefab_name]
if skin_lookup then
    local skin_name = skin_lookup[skin_id]
    -- Apply skin logic using skin_name
end
```

## Dependencies & tags

**Components used:**
None

**Tags:**
None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
None

## Events & listeners
None
