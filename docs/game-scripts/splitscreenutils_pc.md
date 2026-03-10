---
id: splitscreenutils_pc
title: Splitscreenutils Pc
description: Provides split-screen utility functions specifically for PC builds, returning fixed values that disable split-screen functionality.
tags: [network, ui, player]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 0786de56
system_scope: network
---

# Splitscreenutils Pc

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Splitscreenutils Pc` is a utility module that supplies split-screen-related constants and helper functions for PC builds. It defines a set of instance identifiers (`Instances`) and returns fixed boolean values to indicate that split-screen mode is always disabled on PC platforms. This file exists solely to prevent merge conflicts between PC and console code branches — its console counterpart (`splitscreenutils.lua`) likely provides different behavior.

## Usage example
```lua
local splitscreen = require "splitscreenutils_pc"

if splitscreen.IsSplitScreen() then
    -- This will never execute on PC
    print("Split-screen is active")
end

if splitscreen.IsGameInstance(splitscreen.Instances.Player1) then
    print("Current instance is Player1")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `IsGameInstance(instance_id)`
* **Description:** Returns `true` if the given `instance_id` equals `Instances.Player1`, otherwise `false`. Used to determine if the current execution context corresponds to Player1 in a multi-instance setup.
* **Parameters:** `instance_id` (number) — an identifier constant from the `Instances` table.
* **Returns:** `boolean` — `true` only for `Instances.Player1`, `false` for all other values including `Instances.Player2`, `Instances.Server`, etc.

### `IsSplitScreen()`
* **Description:** Always returns `false` for PC builds. Indicates whether split-screen mode is currently active.
* **Parameters:** None.
* **Returns:** `boolean` — always `false` in this PC-specific implementation.

### `HaveMultipleViewports()`
* **Description:** Always returns `false` for PC builds. Indicates whether the game is rendering multiple simultaneous viewports (e.g., local co-op split-screen).
* **Parameters:** None.
* **Returns:** `boolean` — always `false` in this PC-specific implementation.

## Events & listeners
Not applicable