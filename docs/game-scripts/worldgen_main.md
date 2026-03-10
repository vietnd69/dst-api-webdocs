---
id: worldgen_main
title: Worldgen Main
description: Entry point for world generation, responsible for initializing the world generation pipeline, handling mod data, and producing saveable world data structures.
tags: [worldgen, modding, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: fe3fe54e
system_scope: world
---

# Worldgen Main

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`worldgen_main.lua` is the main entry point for the world generation process in Don't Starve Together. It handles initialization of the Lua module loader (including custom NACL-compatible loaders), platform detection, seed management, and orchestration of the world generation pipeline via `GenerateNew`. It also integrates mod support, loads required map/task/room systems, and outputs structured world data ready for serialization.

## Usage example
This module is not used directly by modders as a component. Instead, it is invoked internally during world generation via `LoadParametersAndGenerate`, which expects `GEN_PARAMETERS` to be a JSON-encoded string containing world generation parameters.

However, a modder may override aspects of world generation by patching functions defined here (e.g., `SetWorldGenSeed`), or by interacting with modules it loads (e.g., `map/levels`, `map/tasks`, `prefabswaps`).

## Dependencies & tags
**Components used:** None — this is a top-level script, not an entity component.  
**Tags:** None identified.

## Properties
No public properties are defined or exposed by this script.

## Main functions
### `SetWorldGenSeed(seed)`
*   **Description:** Sets the global random seed for world generation. If `seed` is `nil`, it derives a deterministic seed from the current system time (last 6 digits of reversed `os.time()`). It reseeds Lua’s `math.random` and discards one value to avoid bias.
*   **Parameters:** `seed` (number?) — Optional; if `nil`, auto-generated.
*   **Returns:** number — The effective seed used.
*   **Error states:** None.

### `GenerateNew(debug, world_gen_data)`
*   **Description:** Executes the core world generation pipeline: loads level configuration, selects tasks and set pieces, runs `forest_map.Generate`, and structures the resulting world data for serialization.
*   **Parameters:**  
    `debug` (boolean) — If `true`, forces generation of a debug map with all tasks (`tasks.oneofeverything`).  
    `world_gen_data` (table) — Required; contains keys `level_type`, `level_data`, and optionally `show_debug` and `DLCEnabled`.
*   **Returns:** table — A nested table of serialized world data (keys: `map`, `ents`, `mods`, `meta`), with each value stringified via `DataDumper`.
*   **Error states:** Returns `nil` if world generation fails after 5 retries. Throws `assert` errors for missing level data or invalid structures.

### `LoadParametersAndGenerate(debug)`
*   **Description:** Parses `GEN_PARAMETERS` (a JSON string), decodes it into `world_gen_data`, enables DLCs accordingly, and calls `GenerateNew`.
*   **Parameters:** `debug` (boolean) — Passed to `GenerateNew`.
*   **Returns:** table — Same as `GenerateNew`.
*   **Error states:** Throws if `GEN_PARAMETERS` is `nil`.

### Platform & Utility Helpers
*   `IsConsole()`, `IsPS4()`, `IsPS5()`, `IsXB1()`, `IsSteam()`, `IsLinux()`, `IsRail()`, `IsSteamDeck()` — Return `true`/`false` based on `PLATFORM` or `IS_STEAM_DECK` constants.
*   `LoadScript(filename)`, `RunScript(filename)` — Caching script loaders using `kleiloadlua` and the patched `loadfile`.
*   `GetTickTime()`, `GetTime()`, `GetStaticTime()`, `GetTick()`, `GetStaticTick()` — Return `0`; placeholders for runtime-only timing functions (not used in worldgen).
*   `GetTimeReal()` — Calls `getrealtime()` to retrieve real-world time.
*   `ValidateLineNumber(num)` — No-op; present for compatibility.
*   `PROFILE_world_gen(debug)` — Wraps world generation with a profiler and writes `profile.txt`.

## Events & listeners
This file does not define or interact with entity events; it is a procedural script, not an entity component.  
- **Listens to:** None  
- **Pushes:** None