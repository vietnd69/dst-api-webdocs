---
id: worldsettings
title: Worldsettings
description: Stores and manages world-level configuration settings that can be modified at runtime.
tags: [world, config, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 52d4c86a
system_scope: world
---

# Worldsettings

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorldSettings` is a component responsible for storing and managing world-level configuration settings as key-value pairs. It is typically attached to the world entity and responds to network events (`ms_setworldsetting`) to update settings during gameplay. This component provides a simple interface to get and set arbitrary world settings, which are persisted and accessible throughout the world instance.

## Usage example
```lua
-- Assuming 'world' is the world entity
world:AddComponent("worldsettings")

-- Set a custom world setting
world.components.worldsettings:SetSetting("storm_frequency", 0.75)

-- Retrieve the setting later
local stormFreq = world.components.worldsettings:GetSetting("storm_frequency")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `settings` | table | `{}` | Internal dictionary storing key-value pairs of world settings. |

## Main functions
### `GetSetting(setting)`
* **Description:** Retrieves the value of a world setting by its key.
* **Parameters:** `setting` (string) - the key identifying the setting.
* **Returns:** The stored value for the given setting key, or `nil` if the key does not exist.

### `SetSetting(setting, value)`
* **Description:** Sets a world setting to a new value.
* **Parameters:**  
  * `setting` (string) - the key identifying the setting.  
  * `value` (any) - the value to assign to the setting.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ms_setworldsetting` - triggers when a network message requests a world setting update; calls `SetSetting` with the message data (`data.setting`, `data.value`).  
- **Pushes:** None identified.
