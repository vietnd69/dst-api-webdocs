---
id: worldsettings
title: Worldsettings
description: Manages global world settings by storing and updating named key-value pairs accessible across the game.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 52d4c86a
---

# Worldsettings

## Overview
The `worldsettings` component provides a simple key-value store for global world settings in the Entity Component System. It allows setting and retrieving configuration values (e.g., difficulty modes, world generation flags) that persist across the game session and can be updated dynamically via network events.

## Dependencies & Tags
- **Component dependency:** None (this component does not require or verify other components on `inst`).
- **Tags:** None added or removed.
- **Event listener:** Registers a global listener for the `"ms_setworldsetting"` event (handled by `OnSetWorldSetting`).

## Properties
The constructor initializes one private property:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `settings` | `table` | `{}` | Internal dictionary storing world setting keys (strings) mapped to values of any type. |

> Note: No public instance properties are exposed directly; access is provided solely through `GetSetting` and `SetSetting`.

## Main Functions

### `GetSetting(setting)`
* **Description:** Retrieves the current value of a world setting by its name.
* **Parameters:**
  * `setting` (**string**): The key/name of the setting to look up.

### `SetSetting(setting, value)`
* **Description:** Sets or updates a world setting to the specified value.
* **Parameters:**
  * `setting` (**string**): The key/name of the setting to update.
  * `value` (**any**): The value to assign; can be any Lua type (e.g., `string`, `number`, `boolean`, `table`).

## Events & Listeners
- **Listens for `"ms_setworldsetting"`:** A multiplayer-safe event (indicated by the `"ms_"` prefix) that carries a `data` table containing `data.setting` and `data.value`. When received, it calls `SetSetting` on the local `worldsettings` component instance if present.

> This event listener ensures that setting updates initiated on the master client are propagated and applied consistently on all connected clients and the server.