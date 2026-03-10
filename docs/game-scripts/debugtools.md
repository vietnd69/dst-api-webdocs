---
id: debugtools
title: Debugtools
description: Provides utility functions for debugging, including callstack inspection, table dumping, conditional logging, and entity-based debug visualization.
tags: [debug, utility, logging]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a4d330cc
system_scope: debug
---

# Debugtools

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`debugtools` is a collection of standalone Lua utility functions for debugging and diagnostics in Don't Starve Together. It does not define a component, but rather exports procedural functions and utilities (e.g., `dprint`, `dumptable`, `DebugArcAttackHitBox`) that modders can use directly. Key capabilities include formatted stack tracing, recursive table inspection, conditional console output based on environment variables, and live debug drawing of geometric shapes and arc hitboxes for entity-based attacks.

## Usage example
```lua
-- Enable debug printing for current user only
DPRINT_USERNAME = TheSim:GetUsersName()

-- Dump a complex table with recursion control
dumptable(my_entity.components.inventory)

-- Log only ifCHEATS_ENABLED and current user matches
dprint("Update tick", frame_count, entity:GetGUID())

-- Visualize an arc attack hitbox (radius 5, 90-degree span)
DebugArcAttackHitBox(player, 90, 1.5, 5, 1.0)
```

## Dependencies & tags
**Components used:** None (this file is a procedural utility, not a component).  
**Tags:** None identified.

## Properties
No public properties. All functionality is exposed via exported functions.

## Main functions
### `dprint(...)`
*   **Description:** Conditional debug print to the game's internal log buffer. Only prints if `CHEATS_ENABLED` and `CHEATS_ENABLE_DPRINT` are true. If `DPRINT_USERNAME` is defined, it also checks that the current user matches. Optionally prepends source file and line number if `DPRINT_PRINT_SOURCELINE` is true.
*   **Parameters:** Vararg (`...`) — values to log.
*   **Returns:** Nothing.
*   **Error states:** Silent no-op unless `CHEATS_ENABLED` and `CHEATS_ENABLE_DPRINT` are true (and optionally `DPRINT_USERNAME` matches).

### `dumptable(obj, indent, recurse_levels, visit_table, is_terse)`
*   **Description:** Recursively prints the contents of a table to the console with indented key-value pairs. Skips circular references by tracking visited tables.
*   **Parameters:**
    *   `obj` (table or any) — the table to dump.
    *   `indent` (number, optional) — starting indentation level; defaults to `1`.
    *   `recurse_levels` (number, optional) — maximum recursion depth; defaults to `5`.
    *   `visit_table` (table, optional) — internal tracking table for visited objects (do not pass manually).
    *   `is_terse` (boolean, optional) — if true, suppresses "(empty)" and "nil" messages.
*   **Returns:** Nothing.
*   **Error states:** Skips tables already visited (prevents infinite recursion). Skips entity tables by printing "(Entity -- skipping.)".

### `dumptablequiet(obj, indent, recurse_levels, visit_table)`
*   **Description:** Alias for `dumptable(..., true)` — same behavior as `dumptable` but in "terse" mode (suppresses verbose empty/nil output).
*   **Parameters:** Same as `dumptable`, with `is_terse` implicitly `true`.
*   **Returns:** Nothing.

### `ddump(obj, indent, recurse_levels, root)`
*   **Description:** Alternative recursive table dumper that outputs via `dprint()` (respecting debug filters) instead of raw `print()`. Includes self-reference detection.
*   **Parameters:**
    *   `obj` (table) — the table to dump.
    *   `indent` (number, optional) — indentation level; defaults to `1`.
    *   `recurse_levels` (number, optional) — max depth; defaults to `3`.
    *   `root` (table, optional) — internal root table reference to detect cycles.
*   **Returns:** Nothing.

### `table.inspect = require("inspect")`
*   **Description:** Makes the `inspect` module (for pretty-printing recursive tables) available as `table.inspect`. (Note: This is a module assignment, not a function.)

### `debugstack(start, bottom, top)`
*   **Description:** Returns a formatted string representing the current Lua call stack, truncated to `top` frames from the start and `bottom` frames from the end if the stack is large.
*   **Parameters:**
    *   `start` (number, optional) — stack level offset to start listing from; defaults to `1`.
    *   `bottom` (number, optional) — number of bottom frames to show; defaults to `10`.
    *   `top` (number, optional) — number of top frames to show; defaults to `12`.
*   **Returns:** String — the formatted stack traceback.

### `debugstack_oneline(linenum)`
*   **Description:** Returns a one-line formatted string for a specific stack level (default `3`).
*   **Parameters:** `linenum` (number, optional) — stack level to format; defaults to `3`.
*   **Returns:** String.

### `instrument_userdata(instance)`
*   **Description:** Wraps a userdata object (e.g., `TheNet`) with a proxy table that prints the call stack before every method call. Useful for tracing who is calling low-level APIs.
*   **Parameters:** `instance` (userdata) — the userdata object to instrument.
*   **Returns:** Table — a proxy with methods that log the full stack before forwarding.

### `debuglocals(level)`
*   **Description:** Returns a string listing all local variables and their values at the specified stack level.
*   **Parameters:** `level` (number) — stack level from which to inspect locals (e.g., `2` for caller's scope).
*   **Returns:** String — formatted as `"varname = value\n..."`.

### `printwrap(msg, ...)`
*   **Description:** Prints a message, and if the remaining arguments are a table, calls `dumptable` to dump it recursively; otherwise prints normally. Returns all original arguments.
*   **Parameters:** `msg` (string), `...` — vararg arguments.
*   **Returns:** All input arguments unchanged.

### `printsel(inst, ...)`
*   **Description:** Prints only if `inst` matches the currently selected entity (via `c_sel()`).
*   **Parameters:** `inst` (entity), `...` — values to print.
*   **Returns:** Nothing.

### `eprint(inst, ...)`
*   **Description:** Calls `dprint(...)` only if `inst` is the debug entity (as returned by `GetDebugEntity()`).
*   **Parameters:** `inst` (entity), `...` — values to log.
*   **Returns:** Nothing.

### `EnableDebugOnEntity(thing, items)`
*   **Description:** Configures debug output behavior for a specific entity by setting up a `_DEBUG_List` table. Supports per-entity debug tags, priority filtering, and enabling/disabling.
*   **Parameters:**
    *   `thing` (table) — the entity/table to enable debug for.
    *   `items` (boolean/string/number) — `false` to disable; `"on"`/`"off"` to toggle; `"all"`/string to enable tagging; number to set priority.
*   **Returns:** Nothing.

### `Dbg(thing, level, ...)`
*   **Description:** Conditional debug print for a specific entity. Only prints if debug is enabled for that entity and conditions (`priority`, `tag`, or `"all"`) match.
*   **Parameters:**
    *   `thing` (table) — the entity to check debug settings on.
    *   `level` (string or number) — tag name or priority threshold.
    *   `...` — vararg values to print.
*   **Returns:** Nothing.

### `DrawLine(pos1, pos2)`
*   **Description:** Draws a white line between two 3D positions for map debugging. Internally creates a temporary `DebugDrawMap` entity and uses its debug renderer.
*   **Parameters:**
    *   `pos1` (table) — `{x, y, z}` or `{x, z}` position.
    *   `pos2` (table) — `{x, y, z}` or `{x, z}` position.
*   **Returns:** Nothing.

### `DebugArcAttackHitBox(inst, arc_span, forward_offset, arc_radius, lifetime)`
*   **Description:** Draws a thick arc hitbox in front of an entity for debugging attacks. Visualizes the arc using debug-rendered lines with a central and offset lines to represent thickness.
*   **Parameters:**
    *   `inst` (entity) — entity whose facing direction determines the arc center.
    *   `arc_span` (number) — total angular width of the arc in degrees.
    *   `forward_offset` (number) — forward distance to shift the arc origin.
    *   `arc_radius` (number) — radius of the arc.
    *   `lifetime` (number, optional) — seconds before the debug lines are cleared.
*   **Returns:** Nothing.

## Events & listeners
Not applicable.