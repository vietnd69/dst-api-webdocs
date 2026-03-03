---
id: skilltreeupdater
title: Skilltreeupdater
description: Manages player skill tree activation, XP progression, and network synchronization across client and server.
tags: [skill_tree, progression, network, player]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1f40b1d4
system_scope: player
---

# Skilltreeupdater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SkillTreeUpdater` is a player-owned component that provides a client-server abstraction layer for managing character skill tree state. It wraps lower-level operations from `skilltreedata` and ensures proper networking, validation, and event propagation when skills are activated/deactivated or XP is modified. It is typically attached to player entities and coordinates with the global `TheSkillTree` system during activation.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("skilltreeupdater")

-- Add XP to a skill
inst.components.skilltreeupdater:AddSkillXP(100)

-- Activate a skill
inst.components.skilltreeupdater:ActivateSkill("agility")

-- Check if a skill is activated
if inst.components.skilltreeupdater:IsActivated("agility") then
    print("Agility skill is active!")
end

-- Get available skill points
print("Available points:", inst.components.skilltreeupdater:GetAvailableSkillPoints())
```

## Dependencies & tags
**Components used:** None (uses `skilltreedata` via `require`, but does not directly access other components via `inst.components.X`).

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skilltree` | `skilltreedata` instance | Created in constructor | Internal data store for skill state (XP, activation, points). |
| `silent` | boolean (or `nil`) | `nil` | When `true`, suppresses networking and event callbacks for skill operations. |
| `skilltreeblob` | table or `nil` | `nil` | Encoded skill tree state persisted from save/load. |
| `skilltreeblobprefab` | string or `nil` | `nil` | Character prefab associated with `skilltreeblob` for validation. |

## Main functions
### `IsActivated(skill)`
*   **Description:** Checks if the given skill is currently activated for this character.
*   **Parameters:** `skill` (string) — The skill identifier (key in `SKILLTREE_DEFS`).
*   **Returns:** `boolean` — `true` if activated, `false` otherwise.

### `IsValidSkill(skill)`
*   **Description:** Validates whether the given skill exists and is valid for this character's prefab.
*   **Parameters:** `skill` (string) — The skill identifier.
*   **Returns:** `boolean` — `true` if valid, `false` otherwise.

### `GetSkillXP()`
*   **Description:** Returns total XP accumulated across all skills for this character.
*   **Parameters:** None.
*   **Returns:** `number` — Total XP value.

### `GetPointsForSkillXP(skillxp)`
*   **Description:** Calculates how many skill points correspond to a given amount of XP.
*   **Parameters:** `skillxp` (number) — XP amount.
*   **Returns:** `number` — Number of skill points.

### `GetAvailableSkillPoints()`
*   **Description:** Returns the number of unspent skill points for this character.
*   **Parameters:** None.
*   **Returns:** `number` — Available points.

### `GetActivatedSkills()`
*   **Description:** Gets the list of currently activated skill names (keys).
*   **Parameters:** None.
*   **Returns:** `table` — Array-like table of skill names (strings).

### `CountSkillTag(tag)`
*   **Description:** Counts how many activated skills carry a specific tag.
*   **Parameters:** `tag` (string) — The tag to count (e.g., `"melee"`, `"magic"`).
*   **Returns:** `number` — Number of activated skills with the tag.

### `HasSkillTag(tag)`
*   **Description:** Checks if at least one activated skill carries a specific tag.
*   **Parameters:** `tag` (string) — The tag to check.
*   **Returns:** `boolean` — `true` if any skill has the tag.

### `ActivateSkill(skill, prefab, fromrpc)`
*   **Description:** Activates a skill with proper client-server syncing and callbacks. **Do not use `prefab`** — it is ignored and retained for compatibility.
*   **Parameters:**  
  • `skill` (string) — Skill key to activate.  
  • `prefab` (string, unused) — Obsolete; pass `nil`.  
  • `fromrpc` (boolean, optional) — If `true`, suppresses redundant RPC calls.
*   **Returns:** Nothing.
*   **Error states:** No-op if `skill` is invalid or `self.silent` is `true`.

### `DeactivateSkill(skill, prefab, fromrpc)`
*   **Description:** Deactivates a skill with proper client-server syncing and callbacks. **Do not use `prefab`** — it is ignored.
*   **Parameters:**  
  • `skill` (string) — Skill key to deactivate.  
  • `prefab` (string, unused) — Obsolete; pass `nil`.  
  • `fromrpc` (boolean, optional) — If `true`, suppresses redundant RPC calls.
*   **Returns:** Nothing.
*   **Error states:** No-op if `skill` is invalid or `self.silent` is `true`.

### `AddSkillXP(amount, prefab, fromrpc)`
*   **Description:** Adds XP to the skill tree and handles updating available points and UI state (e.g., showing the new skill point popup).
*   **Parameters:**  
  • `amount` (number) — XP to add.  
  • `prefab` (string, unused) — Obsolete; pass `nil`.  
  • `fromrpc` (boolean, optional) — If `true`, suppresses redundant RPC calls.
*   **Returns:** Nothing.
*   **Error states:** No-op if `amount` is `nil` or `self.inst ~= ThePlayer` and XP would trigger local UI updates.

### `SetSilent(silent)`
*   **Description:** Sets whether to suppress networking, callbacks, and validation during skill operations.
*   **Parameters:** `silent` (boolean) — `true` to silence events and syncing.
*   **Returns:** Nothing.

### `SetSkipValidation(skip)`
*   **Description:** Skips skill validation checks (e.g., prerequisite checks) in `skilltreedata`.
*   **Parameters:** `skip` (boolean) — `true` to skip validation.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Encodes and returns the current skill tree state for saving to disk.
*   **Parameters:** None.
*   **Returns:** `table` — `nil` if no data; otherwise `{skilltreeblob = ..., skilltreeblobprefab = ...}`.

### `OnLoad(data)`
*   **Description:** Loads persisted skill tree state from save data into the component.
*   **Parameters:** `data` (table) — Data returned from `OnSave()`.
*   **Returns:** Nothing.

### `SetPlayerSkillSelection(skillselection)`
*   **Description:** Instantly applies a raw bitfield-based skill selection array (typically from frontend or modding tools), bypassing validation and networking.
*   **Parameters:** `skillselection` (table) — Array of bitfield entries representing activated skills.
*   **Returns:** Nothing.

### `SendFromSkillTreeBlob(inst)`
*   **Description:** Applies skill activation state from `skilltreeblob` after validating against current XP and prefab. Typically invoked on client connection or post-load.
*   **Parameters:** `inst` — The entity instance (unused internally).
*   **Returns:** Nothing.
*   **Note:** Pushes `"onsetskillselection_server"` after completion.

## Events & listeners
- **Listens to:**  
  `playeractivated` — When the local player activates, initializes `TheSkillTree` with owner and disables saving until handshake completes.
- **Pushes (server):**  
  `onactivateskill_server`, `ondeactivateskill_server`, `onaddskillxp_server`, `onsetskillselection_server`, `newskillpointupdated` (via `ThePlayer`).  
- **Pushes (client):**  
  `onactivateskill_client`, `ondeactivateskill_client`, `onaddskillxp_client`.  
- **Notes:** Client and server variants exist but are internal — the public `ActivateSkill`, `DeactivateSkill`, `AddSkillXP` methods handle invoking both.
