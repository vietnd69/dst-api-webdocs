---
id: builtinusercommands
title: Builtinusercommands
description: Registers and manages built-in chat commands for players and admins in Don't Starve Together.
tags: [network, ui, admin]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ab75f569
system_scope: network
---

# Builtinusercommands

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`builtinusercommands.lua` defines and registers core built-in user commands (e.g., `/help`, `/kick`, `/ban`, `/emote`) using the `AddUserCommand` API. It integrates with the `UserCommands` and `VoteUtil` modules to support permission-based access, local/server execution, voting, and localization. This file does not define an Entity Component System (ECS) component—it is a top-level script that populates the user command registry at initialization. It serves as the authoritative source for core UI and admin functionality via chat commands.

## Usage example
The `builtinusercommands.lua` file is loaded automatically by the game and does not require manual instantiation. Modders interact with it indirectly via `AddUserCommand` calls in their own mod code to extend the command system. Example:

```lua
local UserCommands = require("usercommands")

AddUserCommand("mycommand", {
    prettyname = "My Command",
    desc = "Does something cool.",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    usermenu = false,
    servermenu = false,
    params = {},
    vote = false,
    localfn = function(params, caller)
        print("My command executed!")
    end,
})
```

## Dependencies & tags
**Components used:** None (no ECS components accessed).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `AddUserCommand(name, definition)`
*   **Description:** Registers a new chat command with the game. This function is called internally for built-in commands and externally by mods. The command is stored in the global command registry and made available via `/name`, `name`, or via the in-game UI (if enabled).
*   **Parameters:**  
    - `name` (string) – Primary name of the command (e.g., `"kick"`).  
    - `definition` (table) – Configuration table with fields like:
        - `aliases` (array of strings, optional) – Alternate names.
        - `prettyname`, `desc` (string or `nil`) – Localized labels; `nil` defaults to `STRINGS.UI.BUILTINCOMMANDS.NAME.*`.
        - `permission` (`COMMAND_PERMISSION.*` enum) – Access level (e.g., `USER`, `MODERATOR`, `ADMIN`).
        - `slash` (boolean) – Whether `/name` syntax is enabled.
        - `usermenu`, `servermenu` (boolean) – Whether the command appears in the respective UI menus.
        - `params` (array of strings) – Required parameter names.
        - `paramsoptional` (array of booleans, optional) – Same length as `params`; indicates optional parameters.
        - `vote` (boolean) – Whether voting is supported.
        - `votetimeout`, `voteminstartage`, etc. (various) – Voting parameters (only relevant if `vote` is true).
        - `localfn` (function) – Client-side callback `(params, caller) → nil`.
        - `serverfn` (function, optional) – Server-side callback `(params, caller) → nil`.
        - `hasaccessfn`, `canstartfn`, `votecanstartfn`, `voteresultfn` (function, optional) – Custom access/vote logic hooks.
*   **Returns:** Nothing.
*   **Error states:** If `paramsoptional` is provided, non-optional params must appear first (i.e., `true` entries may follow `false`, but not precede them). Misordering will cause runtime issues.

### `ResolveCommandStringProperty(command, prop, fallback)`
*   **Description:** Internal helper used by commands like `/help` to resolve localized string properties (e.g., `prettyname`, `desc`). Falls back to a provided default if the property is `nil`.
*   **Parameters:**  
    - `command` (table) – Command definition table.  
    - `prop` (string) – Key to access in `command` (e.g., `"prettyname"`).  
    - `fallback` (string) – Default value if `command[prop]` is `nil`.  
*   **Returns:** (string) The resolved localized string or `fallback`.
*   **Error states:** None.

### `UserToClientID(username)`
*   **Description:** Internal utility to convert a player’s username to their client ID for network operations (e.g., kicking, banning).
*   **Parameters:**  
    - `username` (string) – Player’s in-game username.  
*   **Returns:** (number or string) Client ID (numeric) if found; otherwise, returns the original `username` (string).
*   **Error states:** Returns the input unchanged if no mapping exists.

## Events & listeners
None (this file does not define or listen to any events).