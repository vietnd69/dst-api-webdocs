---
id: voteutil
title: VoteUtil
description: Utility functions for vote tallying and validation in user vote commands
sidebar_position: 4
slug: game-scripts/core-systems/voteutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# VoteUtil

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `voteutil.lua` module provides utility functions for implementing vote systems in Don't Starve Together. It contains pre-built vote tallying algorithms and validation functions that can be used in user vote commands. The module supports both unanimous and majority vote types, with specialized variants for Yes/No voting patterns.

## Usage Example

```lua
-- Define a custom vote command using VoteUtil functions
AddUserCommand("kickplayer", {
    prettyname = "Kick Player",
    desc = "Vote to kick a player from the server",
    permission = COMMAND_PERMISSION.VOTE,
    vote = true,
    votetimeout = 30,
    voteresultfn = VoteUtil.YesNoMajorityVote,
    votecanstartfn = VoteUtil.DefaultCanStartVote,
    serverfn = function(params)
        -- Implementation when vote passes
    end,
})
```

## Vote Results Data Structure

All vote result functions receive a `voteresults` table with the following structure:

```lua
voteresults = {
    total_not_voted = number,  -- Players who abstained after timeout
    total_voted = number,      -- Players who cast votes
    total = number,           -- Total eligible voters
    options = {
        [1] = number,         -- 'Yes' vote count  
        [2] = number,         -- 'No' vote count
    }
}
```

**Important Notes:**
- Target users who cannot vote are excluded from all counts
- Minimum player count validation is handled elsewhere
- Vote result functions only need to determine the winning outcome

## Vote Result Functions

### DefaultUnanimousVote(params, voteresults) {#defaultunanimousvote}

**Status:** `stable`

**Description:**
Requires all votes to be for the same option. Returns the result only if every vote cast was for the same choice.

**Parameters:**
- `params` (table): Vote command parameters
- `voteresults` (table): Vote tallying results

**Returns:**
- (number, number): Option index and vote count if unanimous, nil otherwise

**Example:**
```lua
-- All 5 players vote 'Yes'
local voteresults = {
    total_voted = 5,
    total_not_voted = 0,
    total = 5,
    options = {5, 0}  -- 5 Yes, 0 No
}

local result, count = VoteUtil.DefaultUnanimousVote({}, voteresults)
-- result = 1, count = 5 (unanimous Yes)

-- Mixed voting scenario
local voteresults2 = {
    total_voted = 5,
    total_not_voted = 0,
    total = 5,
    options = {3, 2}  -- 3 Yes, 2 No
}

local result2, count2 = VoteUtil.DefaultUnanimousVote({}, voteresults2)
-- result2 = nil, count2 = nil (not unanimous)
```

### DefaultMajorityVote(params, voteresults) {#defaultmajorityvote}

**Status:** `stable`

**Description:**
Returns the option with the most votes. In case of a tie, no winner is declared.

**Parameters:**
- `params` (table): Vote command parameters
- `voteresults` (table): Vote tallying results

**Returns:**
- (number, number): Winning option index and vote count, or (nil, nil) for ties

**Example:**
```lua
-- Clear majority
local voteresults = {
    total_voted = 7,
    total_not_voted = 1,
    total = 8,
    options = {5, 2}  -- 5 Yes, 2 No
}

local result, count = VoteUtil.DefaultMajorityVote({}, voteresults)
-- result = 1, count = 5 (Yes wins)

-- Tie scenario
local voteresults2 = {
    total_voted = 6,
    total_not_voted = 0,
    total = 6,
    options = {3, 3}  -- 3 Yes, 3 No
}

local result2, count2 = VoteUtil.DefaultMajorityVote({}, voteresults2)
-- result2 = nil, count2 = nil (tie)
```

### YesNoUnanimousVote(params, voteresults) {#yesnounanimousvote}

**Status:** `stable`

**Description:**
Specialized unanimous vote that only returns a result for 'Yes' outcomes. Useful for votes where only positive consensus should trigger action.

**Parameters:**
- `params` (table): Vote command parameters
- `voteresults` (table): Vote tallying results

**Returns:**
- (number, number): Returns (1, count) for unanimous Yes, nil otherwise

**Example:**
```lua
-- Unanimous Yes
local voteresults = {
    total_voted = 4,
    total_not_voted = 0,
    total = 4,
    options = {4, 0}  -- 4 Yes, 0 No
}

local result, count = VoteUtil.YesNoUnanimousVote({}, voteresults)
-- result = 1, count = 4 (action will be taken)

-- Unanimous No
local voteresults2 = {
    total_voted = 4,
    total_not_voted = 0,
    total = 4,
    options = {0, 4}  -- 0 Yes, 4 No
}

local result2, count2 = VoteUtil.YesNoUnanimousVote({}, voteresults2)
-- result2 = nil, count2 = nil (no action taken)
```

### YesNoMajorityVote(params, voteresults) {#yesnomajorityvote}

**Status:** `stable`

**Description:**
Specialized majority vote that only returns a result for 'Yes' outcomes. The vote must have both a majority AND that majority must be 'Yes'.

**Parameters:**
- `params` (table): Vote command parameters
- `voteresults` (table): Vote tallying results

**Returns:**
- (number, number): Returns (1, count) for Yes majority, nil otherwise

**Example:**
```lua
-- Yes majority
local voteresults = {
    total_voted = 7,
    total_not_voted = 1,
    total = 8,
    options = {5, 2}  -- 5 Yes, 2 No
}

local result, count = VoteUtil.YesNoMajorityVote({}, voteresults)
-- result = 1, count = 5 (action will be taken)

-- No majority
local voteresults2 = {
    total_voted = 7,
    total_not_voted = 1,
    total = 8,
    options = {2, 5}  -- 2 Yes, 5 No
}

local result2, count2 = VoteUtil.YesNoMajorityVote({}, voteresults2)
-- result2 = nil, count2 = nil (no action taken)
```

## Vote Validation Functions

### DefaultCanStartVote(command, caller, targetid) {#defaultcanstartvote}

**Status:** `stable`

**Description:**
Default validation function that always allows votes to start. This is used as a base implementation for custom vote validation logic.

**Parameters:**
- `command` (string): The vote command being started
- `caller` (string): Player ID of the vote initiator
- `targetid` (string): Target player ID (if applicable)

**Returns:**
- (boolean, string): Success flag and optional failure reason

**Example:**
```lua
local can_start, reason = VoteUtil.DefaultCanStartVote("kickplayer", "KU_player1", "KU_player2")
-- can_start = true, reason = nil (always allows)
```

## Custom Vote Validation

You can create custom vote validation functions by following the same pattern:

```lua
-- Example: Prevent votes during night
function CannotStartVoteAtNight(command, caller, targetid)
    if TheWorld.state.isnight then
        return false, "NIGHT"  -- Custom fail reason for UI tooltip
    end
    return true, nil
end

-- Add custom tooltip for the fail reason
STRINGS.UI.PLAYERSTATUSSCREEN.VOTECANNOTSTART["NIGHT"] = "Can't start a vote at night."
```

**Important Constraints:**
- Validation logic **MUST** be valid on clients
- Do not re-validate minimum player count (handled elsewhere)
- Use only game state that is synchronized to clients

## Vote Command Integration

### Complete Vote Command Example

```lua
AddUserCommand("restartserver", {
    prettyname = "Restart Server",
    desc = "Vote to restart the server",
    permission = COMMAND_PERMISSION.VOTE,
    vote = true,
    votetimeout = 45,
    minplayers = 3,
    voteresultfn = VoteUtil.YesNoUnanimousVote,  -- Requires unanimous Yes
    votecanstartfn = function(command, caller, targetid)
        -- Custom validation: only during day
        if TheWorld.state.isnight then
            return false, "NIGHT"
        end
        return true, nil
    end,
    serverfn = function(params)
        print("Server restart vote passed - restarting...")
        c_shutdown(true)  -- Restart server
    end,
})
```

### Vote Command Properties

When using VoteUtil functions, your vote command should include:

- `vote = true`: Mark as a vote command
- `votetimeout`: Duration in seconds (typically 30-60)
- `minplayers`: Minimum players required to start vote
- `voteresultfn`: One of the VoteUtil result functions
- `votecanstartfn`: Validation function (optional)
- `serverfn`: Action to take when vote passes

## Common Usage Patterns

### Player Management Votes
```lua
-- Kick player vote
AddUserCommand("kick", {
    prettyname = "Kick Player",
    desc = "Vote to kick a player",
    permission = COMMAND_PERMISSION.VOTE,
    vote = true,
    votetimeout = 30,
    minplayers = 3,
    voteresultfn = VoteUtil.YesNoMajorityVote,
    votecanstartfn = VoteUtil.DefaultCanStartVote,
    serverfn = function(params)
        TheNet:Kick(params.target)
    end,
})
```

### Server Management Votes
```lua
-- Pause/unpause vote
AddUserCommand("pause", {
    prettyname = "Pause Game",
    desc = "Vote to pause/unpause the game", 
    permission = COMMAND_PERMISSION.VOTE,
    vote = true,
    votetimeout = 20,
    voteresultfn = VoteUtil.DefaultMajorityVote,
    serverfn = function(params)
        TheNet:SetServerPaused(not TheNet:GetServerIsPaused())
    end,
})
```

### World State Votes
```lua
-- Skip day/night vote
AddUserCommand("skiptime", {
    prettyname = "Skip Time",
    desc = "Vote to skip to next day/night",
    permission = COMMAND_PERMISSION.VOTE,
    vote = true,
    votetimeout = 25,
    voteresultfn = VoteUtil.YesNoMajorityVote,
    votecanstartfn = function(command, caller, targetid)
        -- Prevent spam voting
        if GetTime() - (last_time_vote or 0) < 300 then  -- 5 minute cooldown
            return false, "COOLDOWN"
        end
        return true, nil
    end,
    serverfn = function(params)
        last_time_vote = GetTime()
        if TheWorld.state.isday then
            TheWorld:PushEvent("ms_advanceseason", {amount = 0.75})  -- Skip to night
        else
            TheWorld:PushEvent("ms_advanceseason", {amount = 0.25})  -- Skip to day
        end
    end,
})
```

## Vote Result Decision Matrix

| Vote Type | All Yes | All No | Mixed | Tie | No Votes |
|-----------|---------|--------|-------|-----|----------|
| DefaultUnanimousVote | Yes ✓ | No ✓ | nil | nil | nil |
| DefaultMajorityVote | Yes ✓ | No ✓ | Winner ✓ | nil | nil |
| YesNoUnanimousVote | Yes ✓ | nil | nil | nil | nil |
| YesNoMajorityVote | Yes ✓ | nil | Yes/nil | nil | nil |

## Best Practices

### Vote Function Selection
- Use **YesNoUnanimousVote** for critical actions (restarts, major changes)
- Use **YesNoMajorityVote** for player management (kicks, bans)  
- Use **DefaultMajorityVote** for binary choices where either outcome is valid
- Use **DefaultUnanimousVote** for consensus-required decisions

### Custom Validation Guidelines
- Keep validation logic simple and fast
- Only use game state available on clients
- Provide clear, translatable failure reasons
- Consider implementing cooldowns to prevent vote spam
- Test validation logic on both server and client

### Vote Timeout Recommendations
- Player kicks: 30-45 seconds
- Server restarts: 45-60 seconds
- Minor changes: 20-30 seconds
- Emergency actions: 15-20 seconds

## Related Modules

- [UserCommands](./usercommands.md): Command system that integrates with vote utilities
- [Networking](./networking.md): Client-server synchronization for vote state
- [Constants](./constants.md): Command permission levels and vote constants
