---
id: ghostcommand_defs
title: Ghostcommand Defs
description: Defines the structure and logic for Wendy’s ghost command spells, including unsummon, behaviour commands, and skill-enabled abilities.
tags: [combat, ai, wendy, ghost, skill]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: faf4b3fe
system_scope: player
---

# Ghostcommand Defs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ghostcommand_defs.lua` defines the command structures (as Lua tables) for Wendy’s ghost action spells. These commands power the UI and spell execution logic for unsummoning, riling up, soothing, escaping, attacking at a location, scaring, and haunting with her ghost (Abigail). It centralizes command definitions, animation sets, cooldown checks, and the spell function bindings that interact with the `spellbook`, `aoespell`, `aoetargeting`, `ghostlybond`, and `skilltreeupdater` components. The module exports two functions (`GetGhostCommandsFor` and `GetBaseCommands`) to provide dynamic command sets based on the owner’s state and activated skills.

## Usage example
```lua
local commands = require("prefabs/ghostcommand_defs").GetGhostCommandsFor(ThePlayer)
for _, cmd in ipairs(commands) do
    print("Command:", cmd.label)
    if cmd.onselect then
        cmd.onselect(some_ghost_instrument)
    end
end
```

## Dependencies & tags
**Components used:**  
- `spellbook` (for spell name, action, and spell function assignment)  
- `aoespell` (for assigning `spellfn`)  
- `aoetargeting` (for reticule configuration and targeting)  
- `ghostlybond` (for behaviour change and recall)  
- `health` (to check if ghost is alive)  
- `skilltreeupdater` (to conditionally enable skill-based commands)  
- `playercontroller` (for AOETargeting entry point)  
- `spellbookcooldowns` (for cooldown checks and management)

**Tags:**  
- Adds `unsummoning_spell` (temporary, only on `unsummon` command selection)

## Properties
No public properties are exposed directly by this module. It only returns a table of exported functions.

## Main functions
### `GetGhostCommandsFor(owner)`
*   **Description:** Constructs and returns the full list of ghost commands available to the given `owner` (typically the player). It includes base commands (`unsummon`, `rile`/`soothe`), plus any skill-activated commands from `SKILLTREE_COMMAND_DEFS`. Selects between `RILE_UP_ACTION` and `SOOTHE_ACTION` based on whether `owner` has the `has_aggressive_follower` tag.
*   **Parameters:** `owner` (Entity instance) — the entity that owns the ghost and commands.
*   **Returns:** `table` — a list of command definition tables (each with fields like `label`, `onselect`, `execute`, `anims`, `widget_scale`, etc.).
*   **Error states:** If `SKILLTREE_COMMAND_DEFS` entries are malformed (e.g., missing `label` but nested incorrectly), it may silently skip them.

### `GetBaseCommands()`
*   **Description:** Returns the static list of base commands that are always available (regardless of skills or tags), currently only the `unsummon` command.
*   **Parameters:** None.
*   **Returns:** `table` — a list containing the single `BASECOMMANDS` entry.

## Events & listeners
- **Pushes:** `spellupdateneeded` — fired by `GhostChangeBehaviour` to signal the UI or game state that command availability may have changed after behaviour change.
- **Listens to:** None — this module does not register event listeners itself. Event interaction is handled via component callbacks (e.g., `onselect` functions interact with components).