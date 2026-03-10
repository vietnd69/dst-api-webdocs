---
id: voteutil
title: Voteutil
description: Provides utility functions for implementing and resolving player voting systems, including vote result calculation and vote-start validation.
tags: [network, ui, multiplayer]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 2cd92a7b
system_scope: network
---

# Voteutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`voteutil` exports a set of reusable functions for defining how votes are tallied and whether a vote can be initiated. It is intended for use in custom user commands that involve player voting, such as kicking a player or selecting a map. The module supports multiple voting rules (unanimous, majority, and yes-only variants) and includes a default check for vote initiability. All logic is designed to be valid on both server and client.

## Usage example
```lua
local voteutil = require "voteutil"

-- Define a vote command using the YesNoMajorityVote rule
local my_vote_command = {
    voteresultfn = voteutil.YesNoMajorityVote,
    votecanstartfn = voteutil.DefaultCanStartVote,
    -- ... other command fields
}
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `DefaultUnanimousVote(params, voteresults)`
* **Description:** Determines if the vote result is unanimous (all votes are for a single option with no abstentions). Returns the index of the winning option if unanimous, otherwise `nil`.
* **Parameters:**  
  `params` (table) — unused, included for compatibility.  
  `voteresults` (table) — vote tally table with fields: `total_not_voted`, `total_voted`, `total`, and `options` (array of vote counts per option).
* **Returns:**  
  `result` (number or `nil`) — 1-indexed option number if unanimous, otherwise `nil`.  
  `count` (number or `nil`) — number of votes for the unanimous option if applicable.

### `DefaultMajorityVote(params, voteresults)`
* **Description:** Determines the majority-winner option (option with strictly more votes than any other). Returns `nil` on tie.
* **Parameters:**  
  `params` (table) — unused, included for compatibility.  
  `voteresults` (table) — same structure as above.
* **Returns:**  
  `result` (number or `nil`) — index of the majority option, or `nil` if no clear majority (including ties).  
  `count` (number or `nil`) — vote count for the winning option, only if `result ~= nil`.

### `YesNoUnanimousVote(params, voteresults)`
* **Description:** Wraps `DefaultUnanimousVote` but only returns a result if the unanimous option is `"Yes"` (i.e., option index `1`). Otherwise returns `nil`.
* **Parameters:** Same as `DefaultUnanimousVote`.
* **Returns:** Same as `DefaultUnanimousVote`, but only `1` is returned as a valid option index.

### `YesNoMajorityVote(params, voteresults)`
* **Description:** Wraps `DefaultMajorityVote` but only returns a result if the majority option is `"Yes"` (i.e., option index `1`). Otherwise returns `nil`.
* **Parameters:** Same as `DefaultMajorityVote`.
* **Returns:** Same as `DefaultMajorityVote`, but only `1` is returned as a valid option index.

### `DefaultCanStartVote(command, caller, targetid)`
* **Description:** Default predicate allowing any player to start a vote. Used as the fallback when no custom start-check is needed.
* **Parameters:**  
  `command` (string) — name of the command being voted on.  
  `caller` (Entity or `nil`) — the entity initiating the vote.  
  `targetid` (number or `nil`) — the player ID targeted by the vote.
* **Returns:**  
  `can_start` (boolean) — always `true`.  
  `fail_reason` (`nil`) — no failure reason.

## Events & listeners
None identified