---
id: savedscale
title: Savedscale
description: Stores and restores non-default scale values for an entity's transform during save/load operations.
tags: [save, network, transform]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 987f94a1
system_scope: entity
---

# Savedscale

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Savedscale` is a lightweight component responsible for persisting and restoring an entity's non-default scale values across game sessions. It integrates with the DST save/load system by implementing `OnSave` and `OnLoad` callbacks. The component records scale components (`x`, `y`, `z`) only when they differ from the default value of `1`, optimizing saved data size by omitting redundant information.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("savedscale")
-- Scale is automatically saved and loaded with the entity; no manual intervention required.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `OnSave()`
* **Description:** Captures the entity's current scale and returns a minimal table of non-default values for saving.
* **Parameters:** None.
* **Returns:** A table with keys `x`, `y`, and/or `z` containing scale values that differ from `1`, or `nil` if all scales are `1`.
* **Error states:** If `inst.Transform` is missing or inaccessible, behavior is undefined (component assumes valid transform).

### `OnLoad(data)`
* **Description:** Restores the entity's scale using the saved data table.
* **Parameters:** `data` (table or nil) — a table containing scale values under `x`, `y`, and `z` keys, or `nil` if no custom scale was saved.
* **Returns:** Nothing.
* **Error states:** If `data` is `nil`, defaults all axes to `1`. If `data.y` or `data.z` are omitted, they default to `data.x`.

## Events & listeners
None identified
