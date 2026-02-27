---
id: skilltreeupdater
title: Skilltreeupdater
description: Manages player-specific skill progression, including activation, XP gain, and network synchronization for the Don't Starve Together skill tree system.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 1f40b1d4
---

# Skilltreeupdater

## Overview
This component acts as the primary interface for handling player skill progression in the game's Entity Component System. It wraps lower-level `skilltreedata` logic and ensures consistent behavior across client and server, including RPC network communication, skill activation/deactivation callbacks, and save/load state persistence. It is attached to player entities and coordinates with the global `TheSkillTree` system only after player activation.

## Dependencies & Tags
- **Component Dependencies:**
  - Relies on the entity having `userid` (for dedicated/multiplayer RPC targets).
  - Uses global `TheSkillTree` and `ThePlayer` references only after player activation.
  - Uses `TheNet:IsDedicated()` and `TheWorld.ismastersim` for logic branching.
  - Interacts with RPC endpoints: `RPC.SetSkillActivatedState`, `RPC.AddSkillXP`, and `CLIENT_RPC.SetSkillActivatedState`.
- **Tags Added:** None
- **Tags Removed:** None

## Properties
The following public properties are initialized during construction or dynamically.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity (player) this component belongs to. |
| `skilltree` | `skilltreedata` | `require("skilltreedata")()` | Internal data store managing skill states, XP, and selections per character prefab. |
| `silent` | `boolean`/`nil` | `nil` | When true, suppresses network updates and callbacks (used during batch operations like load). |
| `skilltreeblob` | `table`/`nil` | `nil` | Encoded skill tree state loaded from save data; cleared after successful decode and validation. |
| `skilltreeblobprefab` | `string`/`nil` | `nil` | Character prefab name associated with `skilltreeblob`; used for validation during load. |

## Main Functions

### `IsActivated(skill)`
* **Description:** Checks whether a given skill is currently activated for the entity’s character prefab.
* **Parameters:**
  - `skill` (`string`): The skill identifier.

### `IsValidSkill(skill)`
* **Description:** Verifies whether a given skill is defined for the entity’s character prefab.
* **Parameters:**
  - `skill` (`string`): The skill identifier.

### `GetSkillXP()`
* **Description:** Returns the total XP accumulated for the entity’s character prefab.
* **Parameters:** None.

### `GetPointsForSkillXP(skillxp)`
* **Description:** Computes the number of available skill points corresponding to a given XP amount.
* **Parameters:**
  - `skillxp` (`number`): XP value.

### `GetAvailableSkillPoints()`
* **Description:** Returns the number of unspent skill points for the entity’s character prefab.
* **Parameters:** None.

### `GetPlayerSkillSelection()`
* **Description:** Returns an array table of bitfield-encoded activated skill IDs.
* **Parameters:** None.

### `GetNamesFromSkillSelection(skillselection)`
* **Description:** Converts an array of bitfield-encoded skill IDs into a table of skill names.
* **Parameters:**
  - `skillselection` (`table`): Array of bitfield-encoded skill IDs.

### `GetActivatedSkills()`
* **Description:** Returns a table of skill names currently activated for the entity’s character prefab.
* **Parameters:** None.

### `CountSkillTag(tag)`
* **Description:** Counts how many activated skills match a given tag (via `skilltreedefs.FN.CountTags`).
* **Parameters:**
  - `tag` (`string`): The tag to count.

### `HasSkillTag(tag)`
* **Description:** Returns true if at least one activated skill matches the given tag.
* **Parameters:**
  - `tag` (`string`): The tag to check.

### `ActivateSkill(skill, prefab, fromrpc)`
* **Description:** Activates a skill, updating local state, invoking server/client callbacks, and broadcasting the change via RPC when appropriate. Ignores `prefab` parameter (deprecated); uses `self.inst.prefab`.
* **Parameters:**
  - `skill` (`string`): Skill identifier.
  - `prefab` (`string`, ignored): Previously used by frontend; now ignored.
  - `fromrpc` (`boolean`, optional): If true, prevents redundant RPC transmission.

### `DeactivateSkill(skill, prefab, fromrpc)`
* **Description:** Deactivates a skill, updating local state, invoking callbacks, and broadcasting via RPC. Does not recursively deactivate dependent skills (see FIXME).
* **Parameters:**
  - `skill` (`string`): Skill identifier.
  - `prefab` (`string`, ignored): Deprecated; ignored.
  - `fromrpc` (`boolean`, optional): Prevents redundant RPC if true.

### `AddSkillXP(amount, prefab, fromrpc)`
* **Description:** Adds XP to a skill for the entity’s character prefab, updates state, triggers events, and networks changes. Also triggers the `newskillpointupdated` event locally if points become available.
* **Parameters:**
  - `amount` (`number`): XP amount to add.
  - `prefab` (`string`, ignored): Deprecated; ignored.
  - `fromrpc` (`boolean`, optional): Skips redundant RPC if true.

### `SetSilent(silent)`
* **Description:** Enables/disables "silent mode," which suppresses network updates and callbacks (e.g., during bulk loading).
* **Parameters:**
  - `silent` (`boolean`): If truthy, sets silent mode.

### `SetSkipValidation(skip)`
* **Description:** Enables/disables skill validation checks in the underlying `skilltreedata` object.
* **Parameters:**
  - `skip` (`boolean`): If truthy, skips validation.

### `OnSave()`
* **Description:** Returns a table containing encoded skill tree data for persistence.
* **Parameters:** None.

### `TransferComponent(newinst)`
* **Description:** Transfers the current skill tree blob to a new component instance (e.g., during entity replacement).
* **Parameters:**
  - `newinst` (`Entity`): Target entity instance.

### `SetPlayerSkillSelection(skillselection)`
* **Description:** Applies a pre-encoded skill selection array (bitfield IDs), activating all skills silently and without network sync. Updates internal blob after.
* **Parameters:**
  - `skillselection` (`table`): Array of bitfield-encoded skill IDs.

### `SendFromSkillTreeBlob(inst)`
* **Description:** Processes and validates saved skill data blob (e.g., on load). Deactivates then reactivates skills after validation. Clears blob on success.
* **Parameters:**
  - `inst` (`Entity`): Unused parameter (legacy).

### `OnLoad(data)`
* **Description:** Loads skill tree blob data from save.
* **Parameters:**
  - `data` (`table`): Save data table with `skilltreeblob` and `skilltreeblobprefab` keys.

## Events & Listeners

### Listeners:
- `"playeractivated"` → calls `onplayeractivated`, which initializes `self.skilltree` with `TheSkillTree` and disables saving until handshake complete.

### Events Pushed:
- `"onactivateskill_client"`
- `"onactivateskill_server"`
- `"ondeactivateskill_client"`
- `"ondeactivateskill_server"`
- `"onaddskillxp_client"`
- `"onaddskillxp_server"`
- `"newskillpointupdated"` (local player only, when new XP grants points)
- `"onsetskillselection_server"` (called at the end of `SendFromSkillTreeBlob`)
- `"onactivateskill"` and `"ondeactivateskill"` are *not* directly used; the component uses prefixed variants (`_client`/`_server`).