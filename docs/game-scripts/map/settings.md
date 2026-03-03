---
id: settings
title: Settings
description: Defines a data structure for world generation presets with metadata, overrides, and display properties used in the game's frontend and world creation system.
tags: [world, config, ui]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 956e42c7
---
# Settings

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `SettingsPreset` class is a data container used to define and configure world generation presets in Don't Starve Together. It stores metadata such as display name, description, location, and version, along with custom world settings overrides. This component is primarily used during world creation and in the frontend to present available world presets to players. It is not attached to entities but instantiated as a standalone data object via its class constructor.

## Usage example

```lua
local myPreset = SettingsPreset({
    id = "custom_forest",
    baseid = "forest",
    name = "Custom Forest",
    desc = "A modified forest world with adjusted resource density.",
    location = "forest",
    hideinfrontend = false,
    hideminimap = false,
    overrides = {
        resources = { tree = { density = 1.2 } },
        entities = { pigman = { spawnweight = 0.8 } }
    },
    playstyle = "survival",
    version = 2
})
```

## Dependencies & tags

**Components used:** None  
**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | `string` | required | Unique identifier for the preset; used internally to reference this preset. |
| `settings_id` | `string` | `id` | Duplicate of `id`, maintained for compatibility or namespace separation. |
| `baseid` | `string` | `id` | Identifier of the base world type this preset modifies (e.g., `"forest"`, `"caves"`). |
| `settings_baseid` | `string` | `baseid` | Duplicate of `baseid`, maintained for compatibility or namespace separation. |
| `name` | `string` | `""` | Human-readable name displayed in the world creation UI. |
| `settings_name` | `string` | `name` | Duplicate of `name`, maintained for compatibility or namespace separation. |
| `desc` | `string` | `""` | Description of the preset shown in the world creation UI. |
| `settings_desc` | `string` | `desc` | Duplicate of `desc`, maintained for compatibility or namespace separation. |
| `location` | `string` | required | World region identifier (e.g., `"forest"`, `"caves"`, `"lavaarena"`), determines which worldgen taskset is used. |
| `hideinfrontend` | `boolean` | `nil` (treated as `false` if absent) | If `true`, this preset is hidden from the frontend world creation list. |
| `hideminimap` | `boolean` | `false` | If `true`, disables minimap display for this world. |
| `version` | `number` | `2` | Preset schema version (minimum enforced value is `2`). |
| `overrides` | `table` | `{}` | Custom world settings overrides applied during world generation. |
| `playstyle` | `string?` | `nil` | Optional tag indicating intended gameplay mode (e.g., `"survival"`, `"探索"`). |

## Main functions

### `SettingsPreset(data)`
* **Description:** Constructor for the `SettingsPreset` class. Validates required fields (`id`, `location`) and initializes all properties from the provided `data` table.
* **Parameters:**
  * `data` (table): A table containing at minimum `id` and `location`, plus optional keys `baseid`, `name`, `desc`, `hideinfrontend`, `hideminimap`, `overrides`, `version`, and `playstyle`.
* **Returns:** `nil`
* **Error states:** Raises an assertion error if `data.id` or `data.location` is `nil`.

### `:SetID(id)`
* **Description:** Sets the preset's internal `id` and syncs it to `settings_id`.
* **Parameters:**
  * `id` (string): The unique identifier for the preset.
* **Returns:** `nil`
* **Error states:** Raises an assertion error if `id` is `nil`.

### `:SetBaseID(id)`
* **Description:** Sets the base world type identifier and syncs it to `settings_baseid`.
* **Parameters:**
  * `id` (string): The identifier of the base world type (e.g., `"forest"`).
* **Returns:** `nil`

### `:SetNameAndDesc(name, desc)`
* **Description:** Sets the display name and description, and syncs them to `settings_name` and `settings_desc`.
* **Parameters:**
  * `name` (string?): Localized or raw display name. Defaults to `""` if `nil`.
  * `desc` (string?): Localized or raw description. Defaults to `""` if `nil`.
* **Returns:** `nil`

## Events & listeners

None
