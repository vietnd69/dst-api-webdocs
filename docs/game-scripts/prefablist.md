---
id: prefablist
title: Prefablist
description: Contains a static list of all game prefabs used for entity creation and mod registration.
tags: [prefab, world, spawning]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: de934358
system_scope: world
---

# Prefablist

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`PREFABFILES` is a top-level Lua table listing all valid prefab names known to the game engine. It serves as a registry of prefabs for use during world generation, entity spawning, and modding workflows. This list is typically referenced by tools such as `exportprefabs.lua` and is not an ECS component—it is a plain global table without component instantiation or lifecycle behavior.

## Usage example
```lua
-- Iterate over all known prefabs to validate or process them
for _, name in ipairs(PREFABFILES) do
    if TheWorld.prefabs[name] == nil then
        print("Missing prefab:", name)
    end
end

-- Check if a specific prefab is registered
if table.contains(PREFABFILES, "lavaarena_creature_spawn_fx") then
    print("Valid prefab name")
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PREFABFILES` | table | `{}` | Array of strings representing prefab names used throughout the game. |

## Main functions
None identified.

## Events & listeners
None identified.