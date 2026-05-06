---
id: skilltreeupdater
title: SkillTreeUpdater
description: Manages skill tree state, XP progression, and network synchronization for character skills.
tags: [progression, skills, network]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: dcf4bdcc
system_scope: entity
---

# SkillTreeUpdater

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`SkillTreeUpdater` manages the skill tree state for a character entity. It tracks experience points (XP), available skill points, and activated skills. It handles the synchronization of skill changes between client and server, ensuring consistent state across the network. It relies on `SkillTreeData` for core logic and `skilltree_defs` for skill definitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("skilltreeupdater")

-- Grant XP
inst.components.skilltreeupdater:AddSkillXP(100)

-- Activate a skill
inst.components.skilltreeupdater:ActivateSkill("strength_boost")

-- Check available points
local points = inst.components.skilltreeupdater:GetAvailableSkillPoints()
```

## Dependencies & tags
**External dependencies:**
- `prefabs/skilltree_defs` -- provides skill definitions and tag counting utilities
- `skilltreedata` -- core data logic for skill tree state management

**Components used:**
- `skilltreeupdater` -- self-reference for component access

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component. |
| `skilltree` | SkillTreeData | `nil` | Instance of SkillTreeData handling core logic. |
| `silent` | boolean/nil | `nil` | If true, suppresses networking and callbacks during skill changes. |
| `skilltreeblob` | string/nil | `nil` | Cached save data blob for the skill tree. |
| `skilltreeblobprefab` | string/nil | `nil` | Prefab name associated with the cached save data blob. |

## Main functions
### `IsActivated(skill)`
* **Description:** Checks if a specific skill is currently activated for the entity's prefab.
* **Parameters:** `skill` -- string skill name or ID.
* **Returns:** boolean -- true if activated, false otherwise.
* **Error states:** None

### `IsValidSkill(skill)`
* **Description:** Validates if a skill exists and is valid for the entity's prefab.
* **Parameters:** `skill` -- string skill name or ID.
* **Returns:** boolean -- true if valid, false otherwise.
* **Error states:** None

### `GetSkillXP()`
* **Description:** Retrieves the total accumulated skill XP for the entity's prefab.
* **Parameters:** None
* **Returns:** number -- total XP value.
* **Error states:** None

### `GetPointsForSkillXP(skillxp)`
* **Description:** Calculates the number of skill points available for a given XP amount.
* **Parameters:** `skillxp` -- number -- XP value to calculate points for.
* **Returns:** number -- available skill points.
* **Error states:** None

### `GetAvailableSkillPoints()`
* **Description:** Gets the number of unspent skill points available for the entity's prefab.
* **Parameters:** None
* **Returns:** number -- available points.
* **Error states:** None

### `GetPlayerSkillSelection()`
* **Description:** Returns an array table of bitfield entries representing all activated skills.
* **Parameters:** None
* **Returns:** table -- array of bitfield entries.
* **Error states:** None

### `GetNamesFromSkillSelection(skillselection)`
* **Description:** Converts an array of skill bitfield entries into a table of skill name keys.
* **Parameters:** `skillselection` -- table -- array of bitfield entries.
* **Returns:** table -- key-value table of skill names.
* **Error states:** None

### `GetActivatedSkills()`
* **Description:** Gets the table of skill name keys for all currently activated skills.
* **Parameters:** None
* **Returns:** table -- skill name keys.
* **Error states:** None

### `CountSkillTag(tag)`
* **Description:** Counts the number of activated skills that possess a specific tag.
* **Parameters:** `tag` -- string -- tag to search for.
* **Returns:** number -- count of skills with the tag.
* **Error states:** None

### `HasSkillTag(tag)`
* **Description:** Checks if the entity has any activated skills with the specified tag.
* **Parameters:** `tag` -- string -- tag to check.
* **Returns:** boolean -- true if at least one skill has the tag.
* **Error states:** None

### `ActivateSkill_Client(skill)`
* **Description:** Client-side handler for skill activation. Pushes local event. Internal use preferred via `ActivateSkill`.
* **Parameters:** `skill` -- string -- skill name to activate.
* **Returns:** None
* **Error states:** Errors if `ThePlayer` is nil when called on client.

### `ActivateSkill_Server(skill)`
* **Description:** Server-side handler for skill activation. Triggers onactivate callback and pushes server event. Internal use preferred via `ActivateSkill`.
* **Parameters:** `skill` -- string -- skill name to activate.
* **Returns:** None
* **Error states:** Errors if `skilltreedefs.SKILLTREE_DEFS` does not contain the skill for the prefab.

### `ActivateSkill(skill, prefab, fromrpc)`
* **Description:** Main entry point for activating a skill. Handles networking and validation.
* **Parameters:**
  - `skill` -- string -- skill name to activate
  - `prefab` -- string/nil -- unused parameter (kept for signature compatibility)
  - `fromrpc` -- boolean/nil -- true if triggered via RPC
* **Returns:** None
* **Error states:** None

### `DeactivateSkill_Client(skill)`
* **Description:** Client-side handler for skill deactivation. Pushes local event. Internal use preferred via `DeactivateSkill`.
* **Parameters:** `skill` -- string -- skill name to deactivate.
* **Returns:** None
* **Error states:** Errors if `ThePlayer` is nil when called on client.

### `DeactivateSkill_Server(skill)`
* **Description:** Server-side handler for skill deactivation. Triggers ondeactivate callback and pushes server event. Internal use preferred via `DeactivateSkill`.
* **Parameters:** `skill` -- string -- skill name to deactivate.
* **Returns:** None
* **Error states:** Errors if `skilltreedefs.SKILLTREE_DEFS` does not contain the skill for the prefab.

### `DeactivateSkill(skill, prefab, fromrpc)`
* **Description:** Main entry point for deactivating a skill. Handles networking and validation.
* **Parameters:**
  - `skill` -- string -- skill name to deactivate
  - `prefab` -- string/nil -- unused parameter (kept for signature compatibility)
  - `fromrpc` -- boolean/nil -- true if triggered via RPC
* **Returns:** None
* **Error states:** None

### `AddSkillXP_Client(amount, total)`
* **Description:** Client-side handler for XP addition. Pushes local event. Internal use preferred via `AddSkillXP`.
* **Parameters:**
  - `amount` -- number -- XP amount added
  - `total` -- number -- new total XP
* **Returns:** None
* **Error states:** Errors if `ThePlayer` is nil when called on client.

### `AddSkillXP_Server(amount, total)`
* **Description:** Server-side handler for XP addition. Pushes server event. Internal use preferred via `AddSkillXP`.
* **Parameters:**
  - `amount` -- number -- XP amount added
  - `total` -- number -- new total XP
* **Returns:** None
* **Error states:** None

### `AddSkillXP(amount, prefab, fromrpc)`
* **Description:** Main entry point for adding skill XP. Handles networking and UI notifications.
* **Parameters:**
  - `amount` -- number -- XP amount to add
  - `prefab` -- string/nil -- unused parameter (kept for signature compatibility)
  - `fromrpc` -- boolean/nil -- true if triggered via RPC
* **Returns:** None
* **Error states:** None

### `SetSilent(silent)`
* **Description:** Toggles silent mode. If true, suppresses networking and callbacks during skill changes.
* **Parameters:** `silent` -- boolean/nil -- true to enable silent mode.
* **Returns:** None
* **Error states:** None

### `SetSkipValidation(skip)`
* **Description:** Toggles skill validation skipping. Use with caution.
* **Parameters:** `skip` -- boolean/nil -- true to skip validation.
* **Returns:** None
* **Error states:** None

### `OnSave()`
* **Description:** Serializes skill tree data for saving.
* **Parameters:** None
* **Returns:** table -- save data containing `skilltreeblob` and `skilltreeblobprefab`, or `nil` if no data.
* **Error states:** None

### `TransferComponent(newinst)`
* **Description:** Transfers skill tree save data to a new entity instance.
* **Parameters:** `newinst` -- Entity -- target entity to receive data.
* **Returns:** None
* **Error states:** Errors if `newinst` does not have a `skilltreeupdater` component.

### `SetPlayerSkillSelection(skillselection)`
* **Description:** Applies a skill selection from bitfield entries without networking. Used for loading or admin tools.
* **Parameters:** `skillselection` -- table -- array of bitfield entries.
* **Returns:** None
* **Error states:** None

### `SendFromSkillTreeBlob(inst)`
* **Description:** Validates and applies saved skill tree blob data. Clears cache if validation fails.
* **Parameters:** `inst` -- Entity -- target entity (usually self).
* **Returns:** None
* **Error states:** None

### `OnLoad(data)`
* **Description:** Loads skill tree data from save blob.
* **Parameters:** `data` -- table -- save data containing `skilltreeblob` and `skilltreeblobprefab`.
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `playeractivated` -- initializes skill tree owner on player activation.
- **Pushes:**
  - `onactivateskill_client` -- fired on client when skill is activated.
  - `onactivateskill_server` -- fired on server when skill is activated.
  - `ondeactivateskill_client` -- fired on client when skill is deactivated.
  - `ondeactivateskill_server` -- fired on server when skill is deactivated.
  - `onaddskillxp_client` -- fired on client when XP is added.
  - `onaddskillxp_server` -- fired on server when XP is added.
  - `newskillpointupdated` -- fired when available skill points increase.
  - `onsetskillselection_server` -- fired after skill selection is restored from blob.
  - `self.inst._skilltreeactivatedany` -- pushed on server skill activation.