---
id: playervoter
title: Playervoter
description: Manages player voting state and actions by synchronizing with a player classified component and handling vote submission, validation, and UI updates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 46c3072d
---

# Playervoter

## Overview
The `PlayerVoter` component manages a player's voting behavior within the Entity Component System. It acts as a bridge between the player entity and the `player_classified` component, handling vote selection, submission, validation, and synchronization with the server via `TheNet:Vote`. It supports both client and server (mastersim) roles, ensuring consistent voting state across the network. Voting actions are debounced via a short timeout refresh mechanism to prevent spam and coordinate with world vote changes.

## Dependencies & Tags
- **Component Dependencies**: Relies on the presence of `player_classified` component on the same entity (`inst.player_classified`).
- **Tags**: None explicitly added/removed by this component.
- **Event Listeners**: Internally listens for `"onremove"` and `"voteselectiondirty"` events on the `classified` object; `"onremove"` on the parent entity is handled in cleanup.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to (passed in constructor). |
| `_refreshtask` | `Task?` | `nil` | Optional delayed task used to refresh vote state after submission; cancelled on vote change or component removal. |
| `classified` | `Classified?` | `nil` | Reference to the `player_classified` component instance; `nil` until attached or initialized. |
| `ismastersim` | `boolean` | inferred from `TheWorld.ismastersim` | True if running on the server (host) in DST; affects behavior like direct state modification and vote broadcasting. |

## Main Functions

### `OnVoteChanged(self, sel)`
* **Description:** Internal helper used when a vote selection changes. Cancels any pending refresh task and pushes a `"playervotechanged"` event to the entity, conveying the new selection and whether the player can vote (`canvote` flag).
* **Parameters:**
  - `sel`: The new vote selection index. Must be an integer; values outside valid range are normalized.

### `Refresh(inst, self)`
* **Description:** Resets and re-evaluates the current vote state after a timeout (e.g., post-submission). Sets `_refreshtask` to `nil` and calls `OnVoteChanged` with the current `classified.voteselection` value (or `CANNOT_VOTE` if classified is missing).
* **Parameters:**
  - `inst`: Entity instance (ignored in practice; unused in DST code style).
  - `self`: Component instance.

### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed. Cancels the pending refresh task, detaches from the `classified` component, and removes associated event callbacks.
* **Parameters:** None.

### `AttachClassified(classified)`
* **Description:** Attaches to a `player_classified` instance, registering local callbacks for `"onremove"` and `"voteselectiondirty"` events to maintain sync. Stores the classified reference and callback closures.
* **Parameters:**
  - `classified`: The `player_classified` component instance to bind to.

### `DetachClassified()`
* **Description:** Removes the attachment to the `classified` component, unregisters event callbacks, and clears local references to prevent memory leaks.
* **Parameters:** None.

### `SubmitVote(sel)`
* **Description:** Attempts to submit a valid vote for this player. Validates that `sel` is within range, the player hasn’t voted yet (`canvote` state), and `classified` exists. If valid, updates local state, schedules a refresh task, and broadcasts the vote to the server via `TheNet:Vote`.
* **Parameters:**
  - `sel`: Integer vote selection index; must be greater than `CANNOT_VOTE` and less than `VOTE_PENDING`.

### `SetSelection(sel)`
* **Description:** Directly sets the vote selection on the `classified` component (server-side only). Calls `OnVoteChanged` to propagate the change locally.
* **Parameters:**
  - `sel`: Integer vote selection index; must be valid and `TheWorld.ismastersim` must be true.

### `GetSelection()`
* **Description:** Returns the current valid vote selection if one exists, otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `number?` — The vote selection index if valid, otherwise `nil`.

### `HasVoted()`
* **Description:** Checks whether the player has submitted a valid vote (i.e., `classified.voteselection` is set to a value within the valid range).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a valid vote exists, `false` otherwise.

### `CanVote()`
* **Description:** Checks if the player is currently able to submit a vote (i.e., `classified.voteselection == VOTE_PENDING`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the player can vote, `false` otherwise.

### `SetSquelched(val)`
* **Description:** Sets the `votesquelched` state on the `classified` component (server-side only). A squelched player cannot vote.
* **Parameters:**
  - `val`: Boolean value indicating whether the player’s vote should be squelched.

### `IsSquelched()`
* **Description:** Returns whether the player’s vote is currently squelched. Returns `true` if `classified` is missing (default squelch behavior) or if the `votesquelched` flag is `true`.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if squelched, `false` otherwise.

## Events & Listeners
- **Listens for:**
  - `"onremove"` on `self.classified` → triggers `self.ondetachclassified` (which calls `DetachClassified()`).
  - `"voteselectiondirty"` on `self.classified` → triggers `self.onvoteselectiondirty` (which calls `OnVoteChanged` with new selection).
  - `"onremove"` on `self.inst` → handled via `OnRemoveFromEntity` (calls cleanup logic).
- **Triggers (Pushes):**
  - `"playervotechanged"` event on `self.inst` with payload `{ selection = <value or nil>, canvote = <boolean> }` when vote state changes.