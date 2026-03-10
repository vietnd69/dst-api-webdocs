---
id: usercommands
title: Usercommands
description: Manages user-executable commands (e.g., chat slash commands), including permissions, voting, validation, and execution flow for built-in and modded commands.
tags: [command, player, permissions, voting, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e8d10e35
system_scope: network
---

# Usercommands

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`usercommands` is the central module for managing player-invoked commands—both built-in and mod-added—in Don't Starve Together. It handles command parsing, permission validation (admin/moderator/user-level), vote-based execution (via `WorldVoter` and `PlayerVoter`), and metrics reporting. The module supports user-menu commands (targeted at specific players), server-menu commands, and voting workflows, and it enforces rate limits to prevent command spam per tick.

## Usage example
```lua
local usercommands = require "usercommands"

-- Register a custom mod command
AddModUserCommand("my_mod", "heal", {
    permission = COMMAND_PERMISSION.MODERATOR,
    desc = "Heals the target player.",
    serverfn = function(params)
        local target = UserToPlayer(params.user)
        if target ~= nil and target.components.health ~= nil then
            target.components.health:DoToleranceDamage(-100)
        end
    end,
    params = {"user"},
})

-- Check if a user can execute a command
local can_execute = usercommands.CanUserAccessCommand("heal", player, target.userid)
if can_execute then
    usercommands.RunUserCommand("heal", {user = target.userid}, player, true)
end
```

## Dependencies & tags
**Components used:** `playervoter`, `worldvoter`, `stats`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `AddModUserCommand(mod, name, data)`
* **Description:** Registers a new modded command under the given mod namespace. Accepts full command metadata (name, params, permissions, functions, voting support).
* **Parameters:**
  * `mod` (string) — Unique mod identifier (e.g., `"my_mod"`).
  * `name` (string) — Command name (e.g., `"heal"`).
  * `data` (table) — Command specification table (see `AddUserCommand` for expected fields).
* **Returns:** Nothing.

### `AddUserCommand(name, data)`
* **Description:** Registers a built-in server command with the global `usercommands` table. Supports aliases via `data.aliases`.
* **Parameters:**
  * `name` (string) — Command name.
  * `data` (table) — Command specification, typically including:
    * `params` (array of strings) — Required parameter names.
    * `paramsoptional` (optional array of booleans) — Marks optional parameters.
    * `permission` (`COMMAND_PERMISSION`) — Required permission level.
    * `vote` (boolean) — Whether the command uses voting.
    * `canstartfn`/`votecanstartfn`/`hasaccessfn` — Predicate functions for validation.
    * `localfn`/`serverfn` — Functions to execute (local/client vs server).
    * `usermenu`/`servermenu` (booleans) — Whether the command appears in UI menus.
* **Returns:** Nothing.

### `RunUserCommand(commandname, params, caller, onserver)`
* **Description:** Executes a command directly using a parsed parameter table. Applies permissions, voting, confirmation, and queuing as appropriate.
* **Parameters:**
  * `commandname` (string) — Name of the command to run.
  * `params` (table) — Key-value parameter map (e.g., `{user = "abc123"}`).
  * `caller` (entity) — Entity initiating the command.
  * `onserver` (boolean) — Whether execution originates on the server (`true`) or client (`false`).
* **Returns:** Nothing.

### `RunTextUserCommand(input, caller, onserver)`
* **Description:** Parses and executes a raw slash command string (e.g., `"/heal playername"`). Handles argument splitting and optional argument aggregation (`params.rest`).
* **Parameters:**
  * `input` (string) — Full command string (with leading `/` implied or not).
  * `caller` (entity) — Entity initiating the command.
  * `onserver` (boolean) — Execution context (server vs client).
* **Returns:** Nothing.

### `UserRunCommandResult(commandname, player, targetid)`
* **Description:** Returns the execution result type for a command without executing it. Used for UI state (e.g., enabling/disabling buttons).
* **Parameters:**
  * `commandname` (string)
  * `player` (entity) — Calling player.
  * `targetid` (string or nil) — Target user ID (required for `usermenu` commands).
* **Returns:** `COMMAND_RESULT` enum value: `ALLOW`, `VOTE`, `DISABLED`, `DENY`, or `INVALID`.

### `CanUserAccessCommand(commandname, player, targetid)`
* **Description:** Checks whether the `player` can *ever* see or attempt the command (i.e., not `INVALID`).
* **Parameters:** Same as `UserRunCommandResult`.
* **Returns:** boolean.

### `CanUserStartCommand(commandname, player, targetid)`
* **Description:** Checks if the command can be *started* (bypassing voting). Delegate to `command.canstartfn` if present.
* **Parameters:** Same as `UserRunCommandResult`.
* **Returns:** boolean, optional string (reason) — e.g., `"MINPLAYERS"` or `"MINSTARTAGE"`.

### `CanUserStartVote(commandname, player, targetid)`
* **Description:** Validates whether a vote can be initiated for the command (checks min players, caller age, custom `votecanstartfn`).
* **Parameters:** Same as `UserRunCommandResult`.
* **Returns:** boolean, optional string — reason string if invalid.

### `FinishVote(commandname, params, voteresults)`
* **Description:** Processes vote completion: determines outcome, executes command if passed, and announces result. Runs during the `WorldVoter` update loop.
* **Parameters:**
  * `commandname` (string or hash) — Command identifier.
  * `params` (table) — Original command parameters (including `user`, `username`).
  * `voteresults` (table) — Vote tally data (e.g., `total_for`, `total_not_voted`, `choices`).
* **Returns:** boolean — `true` if vote passed and command executed.

### `GetUserActions(caller, targetid)`
* **Description:** Returns a list of `usermenu`-type commands available to `caller` for the given `targetid`, sorted for UI display. Each entry includes `exectype`, `prettyname`, `desc`, and `menusort`.
* **Parameters:**
  * `caller` (entity)
  * `targetid` (string) — Target player’s `userid`.
* **Returns:** table of command info tables.

### `GetServerActions(caller)`
* **Description:** Same as `GetUserActions`, but filters for `servermenu` commands and passes `nil` for target.
* **Parameters:** `caller` (entity)
* **Returns:** table.

### `GetCommandNames()`
* **Description:** Returns a list of display-ready command names (including modded commands), respecting item ownership requirements (`requires_item_type`).
* **Returns:** table of strings.

### `GetEmotesWordPredictionDictionary()`
* **Description:** Builds a dictionary of emote commands for chat word prediction. Filters emotes using `command.emote` and `hasaccessfn`.
* **Returns:** table with:
  * `words` (array of strings)
  * `delim` (string, e.g., `"/"`)
  * `GetDisplayString(word)` function prepending `delim`.

### `ClearModData(mod)`
* **Description:** Removes all commands registered by the given mod, or all modded commands if `mod` is `nil`.
* **Parameters:** `mod` (string or nil)
* **Returns:** Nothing.

### `UserToClient(input)`
* **Description:** Converts various input types (index, `userid`, name, case-insensitive name) to a client object. Handles client-hosted/dedicated server filtering.
* **Parameters:** `input` (string, number, or nil)
* **Returns:** client table or `nil`.

### `UserToName(input)` / `UserToClientID(input)` / `UserToPlayer(input)`
* **Description:** Convenience wrappers around `UserToClient` that return the player’s name, `userid`, or entity reference, respectively.
* **Parameters:** Same as `UserToClient`.
* **Returns:** string (name/id) or entity (player), or `nil`.

### `SendCommandMetricsEvent(command, targetid, caller)` / `SendVoteMetricsEvent(command, targetid, success, caller)`
* **Description:** Sends metrics events for admin-level commands (`kick`, `ban`, `rollback`, `regenerate`) and their vote variants.
* **Parameters:**
  * `command` (string) — Command name.
  * `targetid` (string) — Target `userid`.
  * `success` (boolean, only `SendVoteMetricsEvent`) — Vote outcome.
  * `caller` (entity) — Calling player entity.
* **Returns:** Nothing.

## Events & listeners
Not applicable — `usercommands` is a passive module, not an entity component, and does not register event listeners or push events itself. It integrates with external systems (`WorldVoter`, `Stats`) to trigger side effects.