---
id: rift_portal_defs
title: Rift Portal Defs
description: Defines configuration templates and utility functions for rift portal prefabs, including fallback implementations and affinity constants.
tags: [portal, rift, world, configuration]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7646ea3f
system_scope: world
---

# Rift Portal Defs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rift_portal_defs.lua` is a shared definitions module that establishes configuration schemas for rift portal prefabs in DST. It exports a registry (`RIFTPORTAL_DEFS`) where modders or game code can register portal definitions, and provides fallback implementations (`FALLBACK_DEFS`) for optional configuration functions. It also defines constants (`RIFTPORTAL_CONST`) — especially for portal affinity types — and exposes utility functions (`RIFTPORTAL_FNS`) to assist in portal setup. This file does not implement behavior directly but serves as a contract for how rift portal prefabs should be configured.

## Usage example
```lua
local rift_portal_defs = require "prefabs/rift_portal_defs"

local my_portal_def = {
    GetNextRiftSpawnLocation = function(map, rift_def)
        -- Custom spawn logic
        return 10, 20
    end,
    Affinity = rift_portal_defs.RIFTPORTAL_CONST.AFFINITY.LUNAR,
}

rift_portal_defs.RIFTPORTAL_FNS.CreateRiftPortalDefinition("my_rift_portal", my_portal_def)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RIFTPORTAL_CONST.AFFINITY` | table | `{ NONE = "NONE", LUNAR = "LUNAR", SHADOW = "SHADOW" }` | Enumerated affinity types for rift portals. |
| `FALLBACK_DEFS` | table |见源码| Table of fallback functions and values used when a portal definition is missing a required field. |
| `RIFTPORTAL_DEFS` | table | `{}` | Registry mapping portal prefab names to their configuration tables. |
| `RIFTPORTAL_FNS` | table | `{ CreateRiftPortalDefinition = ... }` | Utility functions for working with rift portal definitions. |

## Main functions
### `CreateRiftPortalDefinition(prefab_name, definition)`
* **Description:** Registers a rift portal configuration under a given prefab name, merging user-provided fields with fallback defaults.
* **Parameters:**  
  `prefab_name` (string) — The unique name of the portal prefab (e.g., `"rift_portal_lunar"`).  
  `definition` (table) — A table containing optional overrides for `GetNextRiftSpawnLocation`, `CustomAllowTest`, `Affinity`, and `ThrallTypes`.
* **Returns:** Nothing.
* **Error states:** None. If a key is omitted in `definition`, the corresponding fallback is used.

## Events & listeners
Not applicable. This module is a configuration file with no runtime instance or event system.