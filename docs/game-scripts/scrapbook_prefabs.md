---
id: scrapbook_prefabs
title: Scrapbook Prefabs
description: Defines the PREFABS table containing a whitelist of entity prefab names enabled for the scrapbook system.
tags: [data, config, prefabs, scrapbook, entities]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 7bfef6ce
system_scope: entity
---

# Scrapbook Prefabs

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`scrapbook_prefabs.lua` is a data configuration file that defines a static table of prefab names authorized for use with the scrapbook system. This file does not attach to entities as a component and contains no constructor logic — it is simply required by other systems that need to validate or reference scrapbook-enabled prefabs. The PREFABS table serves as a whitelist, ensuring only approved entity types can be processed by scrapbook-related features.

## Usage example
```lua
local PREFABS = require "scrapbook_prefabs"

-- Check if a prefab is in the scrapbook whitelist
local function IsScrapbookEnabled(prefab_name)
    return PREFABS[prefab_name] == true
end

-- Iterate through all scrapbook-enabled prefabs
for prefab, enabled in pairs(PREFABS) do
    if enabled then
        print("Scrapbook prefab:", prefab)
    end
end
```

## Dependencies & tags
**External dependencies:** None identified

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PREFABS` | table | — | Whitelist of scrapbook-enabled prefab names. Keys are prefab name strings (e.g., "abigail", "chester"), values are boolean `true`. Use `PREFABS[prefab_name] == true` to check membership, or `pairs(PREFABS)` to iterate. |

## Main functions
None identified. This file exports a static data table only.

## Events & listeners
None.