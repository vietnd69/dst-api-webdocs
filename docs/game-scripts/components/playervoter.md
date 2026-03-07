---
id: playervoter
title: Playervoter
description: Manages player vote state and submission for shared world voting systems.
tags: [network, player, voting]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 46c3072d
system_scope: network
---

# Playervoter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerVoter` is a client-server synchronized component that manages a player's participation in world-level voting operations, such as leader elections or mode choices. It maintains local state and synchronizes vote selection with a remote `player_classified` component, handling vote submission, validation, and expiration via periodic refresh. The component is designed to align with `worldvoter.lua` and `shard_worldvoter.lua` in the codebase.

## Usage example
```lua
local inst = TheWorld
inst:AddComponent("playervoter")

-- On the client:
inst.components.playervoter:SetSelection(2)
inst.components.playervoter:SubmitVote(2)

-- Querying state:
if inst.components.playervoter:CanVote() then
    print("Player can vote.")
end

if inst.components.playervoter:HasVoted() then
    print("Player has submitted a vote.")
end
```

## Dependencies & tags
**Components used:** `player_classified` (accessed via `inst.player_classified`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity that owns this component (set during construction). |
| `classified` | `Component?` | `nil` | Reference to the attached `player_classified` component; used to read/write vote state. |
| `_refreshtask` | `Task?` | `nil` | Pending timer task used to auto-reset vote state after a timeout. |
| `ismastersim` | `boolean` | inferred | Set on the server/master simulation entity only. Controls authoritative vote state. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and resets internal state when the component is removed from its entity. Prevents memory leaks and orphaned callbacks.
* **Parameters:** None.
* **Returns:** Nothing.

### `AttachClassified(classified)`
* **Description:** Attaches the `player_classified` component, registering handlers for vote changes and detachment.
* **Parameters:** `classified` (Component) — the `player_classified` component instance to synchronize with.
* **Returns:** Nothing.

### `DetachClassified()`
* **Description:** Removes references and event callbacks to the `player_classified` component.
* **Parameters:** None.
* **Returns:** Nothing.

### `SubmitVote(sel)`
* **Description:** Submits a vote selection to the network (via `TheNet:Vote`) and updates local state if the vote is valid and not yet cast. Starts a refresh timer to clear stale votes after `TIMEOUT` seconds.
* **Parameters:** `sel` (number) — vote index; must be `> CANNOT_VOTE` and `< VOTE_PENDING`.
* **Returns:** Nothing.
* **Error states:** No-op if `sel` is invalid, `classified` is `nil`, or the player has already voted.

### `SetSelection(sel)`
* **Description:** Directly sets the vote selection on the authoritative (server) side.
* **Parameters:** `sel` (number) — valid vote index.
* **Returns:** Nothing.
* **Error states:** No-op if `classified` is `nil` or the entity is not the master simulation.

### `GetSelection()`
* **Description:** Returns the currently selected vote index, or `nil` if no valid vote is held.
* **Parameters:** None.
* **Returns:** `number?` — vote selection if valid and set; otherwise `nil`.

### `HasVoted()`
* **Description:** Returns whether the player has an active (non-pending, non-invalid) vote.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a vote is currently selected.

### `CanVote()`
* **Description:** Returns whether the player is eligible to vote (i.e., vote selection is pending).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if vote is pending.

### `SetSquelched(val)`
* **Description:** Sets the squelch state on the server (e.g., prevents voting updates or UI prompts).
* **Parameters:** `val` (boolean) — whether to squelch voting.
* **Returns:** Nothing.

### `IsSquelched()`
* **Description:** Returns whether voting is currently squelched for the player.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if squelched or `classified` is not attached.

## Events & listeners
- **Listens to:**
  - `onremove` (from `player_classified`) — triggers `DetachClassified` to clean up references.
  - `voteselectiondirty` (from `player_classified`) — triggers `OnVoteChanged` to propagate vote updates.
- **Pushes:**
  - `playervotechanged` — fired whenever vote state changes; payload contains:
    - `selection`: valid vote index or `nil`
    - `canvote`: boolean indicating if vote is still pending
