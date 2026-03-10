---
id: config
title: Config
description: Manages platform-specific and user-defined configuration options for the game.
tags: [configuration, platform, settings]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 2ad4f3b1
system_scope: entity
---

# Config

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Config` is a utility class for managing key-value configuration options. It supports default values, platform-specific overrides, and runtime modification of settings. The single global instance `TheConfig` is initialized at load time using `defaults` and then updated with platform-specific overrides (e.g., Android, iOS, NaCl). This component is not attached to entities via the ECS and instead operates as a standalone configuration registry.

## Usage example
```lua
-- Add component to an entity for demonstration (not typical usage)
local inst = CreateEntity()
inst:AddComponent("config") -- This is illustrative only; Config is not an ECS component.
-- Real usage:
TheConfig:Enable("hide_vignette")
print(TheConfig:IsEnabled("hide_vignette")) -- true
print(tostring(TheConfig)) -- displays all options
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `options` | table | `{}` | Stores all active configuration key-value pairs. |

## Main functions
### `SetOptions(options)`
*   **Description:** Merges the provided `options` table into `self.options`, overwriting existing keys and adding new ones.
*   **Parameters:** `options` (table) — A dictionary of configuration keys and their boolean or scalar values.
*   **Returns:** Nothing.

### `IsEnabled(option)`
*   **Description:** Checks whether a given configuration option is enabled (`true`).
*   **Parameters:** `option` (string) — The key/name of the configuration option.
*   **Returns:** `true` if `self.options[option]` is truthy (not `nil` or `false`), otherwise `false`.

### `Enable(option)`
*   **Description:** Enables a configuration option by setting its value to `true`.
*   **Parameters:** `option` (string) — The key/name of the configuration option.
*   **Returns:** Nothing.

### `Disable(option)`
*   **Description:** Disables a configuration option by removing its key from `self.options`.
*   **Parameters:** `option` (string) — The key/name of the configuration option.
*   **Returns:** Nothing.

### `__tostring()`
*   **Description:** Returns a formatted string representation of all configuration options.
*   **Parameters:** None.
*   **Returns:** `string` — A multiline string starting with `"PLATFORM CONFIGURATION OPTIONS"` followed by `"key = value"` lines.

## Events & listeners
None identified