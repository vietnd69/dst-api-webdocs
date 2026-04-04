---
id: builtinusercommands
title: Builtinusercommands
description: Registers default chat and console commands for player and admin interactions.
tags: [chat, admin, network]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: ab75f569
system_scope: network
---

# Builtinusercommands

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`builtinusercommands` is a script that registers the default set of user commands available in Don't Starve Together. It defines behavior for chat slash commands (e.g., `/help`, `/kick`) and server administration actions. This file does not define a component class but rather executes command registration logic using the `UserCommands` module. It handles permissions, voting mechanics, and network interactions for administrative tasks.

## Usage example
This file registers commands globally upon load. Modders can reference this structure to understand how built-in commands are configured.

```lua
AddUserCommand("roll", {
    aliases = { "dice", "random", "diceroll" },
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = { "dice" },
    paramsoptional = { true },
    localfn = function(params, caller)
        -- Implementation logic for dice rolling
        TheNet:DiceRoll(100, 1)
    end,
})
```

## Dependencies & tags
**Components used:** None (Script file).
**Modules:** `usercommands`, `voteutil`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
The following commands are registered by this script. They act as the functional interface for user input.

### `help`
*   **Description:** Displays a list of available commands or detailed info for a specific command.
*   **Parameters:** `commandname` (string, optional) - The name of the command to inspect.
*   **Returns:** Nothing (outputs to chat history).
*   **Error states:** If `commandname` is invalid, displays a not found message.

### `emote`
*   **Description:** Triggers an emote animation or sends a chat message formatted as an emote. Supports aliases `e` and `me`.
*   **Parameters:** `emotename` (string) - The emote to perform.
*   **Returns:** Nothing.
*   **Error states:** Falls back to standard chat say if emote is not found.

### `bug`
*   **Description:** Opens the Klei bug tracker URL in the system browser.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `rescue`
*   **Description:** Forces the player entity back onto the ground (server-side).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Server function only; requires valid caller entity.

### `kick`
*   **Description:** Removes a player from the server. Supports aliases `boot`. Requires moderator permission or a successful vote.
*   **Parameters:** `user` (string) - The target player name or ID.
*   **Returns:** Nothing.
*   **Error states:** Cannot target self or admins. Vote settings apply if permission is insufficient.

### `ban`
*   **Description:** Bans a player from the server permanently or for a set duration. Requires admin permission.
*   **Parameters:** `user` (string), `seconds` (number, optional).
*   **Returns:** Nothing.
*   **Error states:** Cannot target self or admins.

### `stopvote`
*   **Description:** Immediately terminates any active vote on the server. Supports alias `veto`. Requires admin permission.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `roll`
*   **Description:** Generates a random number (dice roll). Supports aliases `dice`, `random`, `diceroll`. Includes cooldown logic.
*   **Parameters:** `dice` (string, optional) - Format `NdS` (e.g., `1d20`) or single number for sides.
*   **Returns:** Nothing (outputs result to chat).
*   **Error states:** Returns early if cooldown `TUNING.DICE_ROLL_COOLDOWN` is active.

### `rollback`
*   **Description:** Reverts the world to a previous save slot. Requires admin permission or a successful vote.
*   **Parameters:** `numsaves` (number, optional) - Number of saves to go back.
*   **Returns:** Nothing.
*   **Error states:** Server function only. Announces vote result if triggered by admin.

### `regenerate`
*   **Description:** Resets the world generation. Requires admin permission or a successful vote.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Server function only. Announces vote result if triggered by admin.

## Events & listeners
None identified.