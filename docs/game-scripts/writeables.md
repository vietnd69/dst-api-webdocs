---
id: writeables
title: Writeables
description: Manages named sign and gravestone UI layouts for in-game writing interfaces, including prompt text, animation banks, and button configurations.
tags: [ui, entity, interaction]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 0306ba53
system_scope: ui
---

# Writeables

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`writeables` is a module that defines and manages layout configurations for writable interfaces in the game—such as home signs, arrow signs, beefalo name signs, and gravestones. Each layout specifies UI behavior including prompt text, animation banks, menu offset, input controls, and optional default or random text generators. It serves as a registry for UI templates used by the HUD to render writeable widgets when a player interacts with appropriate entities.

## Usage example
```lua
-- Add a new custom writeable layout
local my_layout = {
    prompt = "Enter custom name",
    animbank = "ui_board_5x3",
    animbuild = "ui_board_5x3",
    menuoffset = Vector3(6, -70, 0),
    cancelbtn = { text = STRINGS.SIGNS.MENU.CANCEL, control = CONTROL_CANCEL },
    acceptbtn = { text = STRINGS.SIGNS.MENU.ACCEPT, control = CONTROL_ACCEPT },
}
writeables.AddLayout("customsign", my_layout)

-- Show the writeable UI for an instance
writeables.makescreen(my_sign_instance, player_doer)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not modify entity tags directly; relies on `inst.prefab` to select layout.  
**External modules:** Requires `signgenerator` (used by `homesign`-type layouts).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kinds` | table | *Internal* | Registry mapping prefab names to layout definitions. Each entry specifies `prompt`, `animbank`, `animbuild`, `menuoffset`, buttons (`cancelbtn`, `middlebtn`, `acceptbtn`), and optional `defaulttext` or `maxcharacters`. |

## Main functions
### `makescreen(inst, doer)`
* **Description:** Launches the writeable UI screen for the given entity `inst` using the layout registered under `inst.prefab`, and associates it with the player `doer`. Calls `HUD:ShowWriteableWidget`.
* **Parameters:**  
  - `inst` (Entity) – The entity with a writable surface (e.g., sign, gravestone). Must have a `prefab` key matching a registered layout.  
  - `doer` (Entity, optional) – The player triggering the interaction. Must have a `HUD` component; otherwise, no UI is shown.
* **Returns:** Result of `doer.HUD:ShowWriteableWidget(inst, data)` (typically a widget object or `nil`).
* **Error states:** Returns `nil` silently if `doer` is `nil` or lacks a `HUD` component.

### `AddLayout(name, layout)`
* **Description:** Registers a new writeable layout under a given name. Overwrites existing layout only if the name is `nil`.
* **Parameters:**  
  - `name` (string, optional) – Unique identifier for the layout (e.g., `"beefalo"`).  
  - `layout` (table) – Layout definition table (see `kinds` structure).
* **Returns:** Nothing.
* **Error states:** Prints an error message to console if `name` is non-`nil` and already exists in `kinds`.

### `GetLayout(name)`
* **Description:** Retrieves the layout definition associated with `name`.
* **Parameters:**  
  - `name` (string) – Registered layout name (e.g., `"homesign"`).
* **Returns:** `table` – Layout configuration, or `nil` if not found.

## Events & listeners
Not applicable. This module does not register or emit game events.