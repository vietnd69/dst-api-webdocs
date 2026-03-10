---
id: reload
title: Reload
description: Manages hot-swapping of Lua modules during development to enable live code updates without restarting the game.
tags: [hotswap, development, reloading]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 5bf9f2a1
system_scope: network
---

# Reload

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `reload.lua` module provides infrastructure for hot-swapping Lua modules during development. It enables mod developers to update script files and apply changes at runtime by reloading modified modules without restarting the game session. This is particularly useful in the `Don't Starve Together` modding workflow for rapid iteration.

## Usage example
```lua
-- Simulate pressing the reload key (e.g., F3) in-game:
ProbeReload(true)

-- Or invoke a full reload manually:
DoReload()
```

## Dependencies & tags
**Components used:** `TheSim`, `ClassRegistry`, `RequiredFilesForReload` (global tables/variables)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `hotswap(modname)`
* **Description:** Replaces the current Lua module with an updated version from disk, preserving object instances and class hierarchies where possible. This is a core utility for live code updates.
* **Parameters:** `modname` (string) — the module name (e.g., `"scripts/myscript"`).
* **Returns:** 
  * On success: `oldmod` (table) — the previous module table before the update.
  * On failure: `nil, err` — error message on `pcall`/`xpcall` failure.
* **Error states:** 
  * If `require(modname)` fails (e.g., syntax error), module state is restored to prior version; error is printed and `nil` is returned.

### `DoReload()`
* **Description:** Scans files tracked in `RequiredFilesForReload`, detects changes by comparing modification timestamps, and hot-swaps any modified files under `scripts/`. After reloading, it re-applies class inheritance chains and cleans up stale metatable entries.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Logs errors encountered during hot-swapping but does not abort the reload process for other files.

### `ProbeReload(ispressed)`
* **Description:** Handles input-triggered reload (e.g., from a keypress like F3). Only triggers a reload when the key transitions from unpressed to pressed.
* **Parameters:** `ispressed` (boolean) — whether the reload key is currently pressed.
* **Returns:** Nothing.

### `ScrubClass(cls, inh)`
* **Description:** Removes inherited functions from a derived class table that were copied from a base class, allowing clean reconstruction of the class after hot-swap.
* **Parameters:** 
  * `cls` (table) — the derived class table to scrub.
  * `inh` (table) — the inheritance table (typically the base class or prototype).
* **Returns:** Nothing.

### `MonkeyPatchClass(mt)`
* **Description:** Rebuilds a class's function table by traversing its inheritance chain and merging all functions (from base to derived) into a single flat table, then replacing the original class table.
* **Parameters:** `mt` (table) — the metaclass/table representing the class.
* **Returns:** Nothing.

### `MonkeyPatchClasses()`
* **Description:** Applies `ScrubClass` and `MonkeyPatchClass` to all classes registered in `ClassRegistry`, restoring correct inheritance after a hot-swap.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.