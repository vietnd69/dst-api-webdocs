---
id: generate_worldgenoverride
title: Generate Worldgenoverride
description: Generates a worldgenoverride.lua file containing current world and settings preset values and override configurations.
tags: [world, configuration, tools]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: tools
source_hash: 27a6f961
system_scope: world
---

# Generate Worldgenoverride

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This utility script generates a `worldgenoverride.lua` file used to configure world generation settings in Don't Starve Together. It collects the current world settings and worldgen options via the `Customize` and `Levels` modules, formats them into a valid Lua table structure, and writes the output to `worldgenoverride.lua`. It is designed to be executed manually from the in-game console (e.g., during mod development or world template creation) and is not an entity component.

## Usage example
```lua
-- Run from the DST console to generate worldgenoverride.lua
require 'tools/generate_worldgenoverride'
-- This writes the current configuration to 'worldgenoverride.lua' in the current working directory
```

## Dependencies & tags
**Components used:** None (no entity components). Uses `require` to load `map/customize` and `map/levels`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `makedescstring(desc)`
*   **Description:** Formats an options array (e.g., from world settings) into a Lua string suitable for inline comments in the generated override file. Handles functions that return arrays by invoking them.
*   **Parameters:** `desc` (table or function or nil) — an array of option descriptors, or a function that returns one.
*   **Returns:** string or nil — formatted string like `'"opt1", "opt2"'` or `nil` if `desc` is nil.
*   **Error states:** If `desc` is a table, iterates through `ipairs`; skips malformed or missing entries silently.

## Events & listeners
Not applicable.