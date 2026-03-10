---
id: debughelpers
title: Debughelpers
description: Provides debugging utilities to inspect entities, components, and function upvalues for development and troubleshooting.
tags: [debug, tools, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9b210458
system_scope: world
---

# Debughelpers

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Debughelpers` exposes utility functions for runtime introspection of game objects. It includes helpers to dump the contents of an entity, its components, and function upvalues — valuable for diagnosing state, component presence, and closure behavior during development. These are *not* part of the runtime ECS and are intended solely for developer debugging.

## Usage example
```lua
-- Dump an entity's structure, components, and values
if TheNet:GetServerIsDebugBuild() then
    DumpEntity(some_entity_inst)
end

-- Inspect upvalues of a closure for debugging closures or closures with external state
DumpUpvalues(my_function)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `DumpComponent(comp)`
*   **Description:** Prints a formatted dump of all fields and methods in a component table, including source locations for functions and validity status for object references.
*   **Parameters:** `comp` (table) — the component table to inspect.
*   **Returns:** Nothing.
*   **Error states:** None. Assumes `comp` is a valid table.

### `DumpEntity(ent)`
*   **Description:** Prints a comprehensive dump of an entity instance, including its debug string, direct fields, and all attached components with their respective contents.
*   **Parameters:** `ent` (Entity) — the entity instance to inspect.
*   **Returns:** Nothing.
*   **Error states:** None. Fails gracefully (prints nothing or partial output) if `ent` is `nil` or invalid.

### `DumpUpvalues(func)`
*   **Description:** Prints a list of upvalues (captured external variables) for a given Lua closure, with type and value information.
*   **Parameters:** `func` (function) — the function whose upvalues are to be inspected.
*   **Returns:** Nothing.
*   **Error states:** None. Only prints upvalues accessible via `debug.getupvalue`; fails silently if `func` is not a function.

## Events & listeners
None identified