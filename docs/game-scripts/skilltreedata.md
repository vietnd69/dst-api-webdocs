---
id: skilltreedata
title: Skilltreedata
description: Manages persistent skill selection and experience data for player characters, including encoding/decoding, validation, and synchronization.
tags: [skilltree, player, persistence, validation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 44c64bf4
system_scope: player
---

# Skilltreedata

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`SkillTreeData` is a core data component that stores and manages skill activation states and XP progress per character prefab. It provides encoding, decoding, validation, and persistence logic for the skill tree system. It interfaces with `skilltreeupdater.lua` for high-level gameplay operations (e.g., activating/deactivating skills) and reads skill definitions from `skilltree_defs.lua`. The component is designed to support client-server synchronization, offline data preservation, and save-slot integrity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("skilltreedata")
inst.components.skilltreedata:ApplyCharacterData("walrus", "skill1,skill2|50")
inst.components.skilltreedata:ActivateSkill("skill1", "walrus")
local xp = inst.components.skilltreedata:GetSkillXP("walrus")
local points = inst.components.skilltreedata:GetAvailableSkillPoints("walrus")
```

## Dependencies & tags
**Components used:** None (consumes `SKILLTREE_DEFS`, `SKILLTREE_METAINFO`, `TUNING`, `TheSim`, `TheInventory`, `TheNet`, `TheFrontEnd`, `DST_CHARACTERLIST`, and `ThePlayer` from global scope).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `activatedskills` | table of tables | `{}` | Maps characterprefab → set of activated skill names (keys with `true` values). |
| `skillxp` | table | `{}` | Maps characterprefab → total accumulated XP. |
| `NILDATA` | string | Encoded `"!|0"` | Cached encoded representation of empty/invalid skill tree state. |
| `skip_validation` | boolean | `nil` | When true, bypasses validation in `ActivateSkill`/`DeactivateSkill`. |
| `ignorexp` | boolean | `nil` | When true, ignores XP additions (used during backup/handshake). |
| `save_enabled` | boolean | `nil` | Enables/disables writes to persistent storage. |
| `dirty` | boolean | `nil` | Tracks whether `skilltreedata` has pending changes requiring save. |

## Main functions
### `IsActivated(skill, characterprefab)`
*   **Description:** Checks if a given skill is activated for the specified character prefab.
*   **Parameters:**  
    `skill` (string) – The skill identifier.  
    `characterprefab` (string) – The character prefab name (e.g., `"walrus"`).
*   **Returns:** `boolean` – `true` if skill is active, otherwise `false`.
*   **Error states:** Returns `false` if `characterprefab` has no defined skill tree.

### `IsValidSkill(skill, characterprefab)`
*   **Description:** Verifies if a skill exists and is properly defined in the skill tree for the given character.
*   **Parameters:**  
    `skill` (string) – The skill identifier.  
    `characterprefab` (string) – The character prefab name.
*   **Returns:** `boolean` – `true` if `skill` has a non-`nil` `rpc_id`, otherwise `false`.

### `GetSkillXP(characterprefab)`
*   **Description:** Returns the accumulated skill XP for the specified character.
*   **Parameters:**  
    `characterprefab` (string) – The character prefab name.
*   **Returns:** `number` – XP value (always `>= 0`, defaults to `0` if missing).

### `GetMaximumExperiencePoints()`
*   **Description:** Calculates the maximum XP threshold across all tiers defined in `TUNING.SKILL_THRESHOLDS`.
*   **Parameters:** None.
*   **Returns:** `number` – Sum of all XP thresholds.

### `GetPointsForSkillXP(skillxp)`
*   **Description:** Determines how many skill points are available for a given XP amount.
*   **Parameters:**  
    `skillxp` (number) – Total XP to evaluate.
*   **Returns:** `number` – Number of points (i.e., number of skill thresholds passed, capped at `#TUNING.SKILL_THRESHOLDS`).

### `GetAvailableSkillPoints(characterprefab)`
*   **Description:** Computes remaining available skill points for a character (points earned minus points used).
*   **Parameters:**  
    `characterprefab` (string) – The character prefab name.
*   **Returns:** `number` – Available points (`>= 0`), where negative values are clamped to `0`.

### `GetPlayerSkillSelection(characterprefab)`
*   **Description:** Encodes activated skills into a bitfield array for network replication (engine supports only first element, max 32 skills).
*   **Parameters:**  
    `characterprefab` (string) – The character prefab name.
*   **Returns:** `table` – Array with one element: `bitfield` (int32), where bit `rpc_id` is set for each activated skill.

### `GetNamesFromSkillSelection(skillselection, characterprefab)`
*   **Description:** Decodes a `skillselection` bitfield array into a set of active skill names.
*   **Parameters:**  
    `skillselection` (table) – Array of bitfields (only `skillselection[1]` is used).  
    `characterprefab` (string) – The character prefab name.
*   **Returns:** `table` – Set table `{ [skillname] = true, ... }`.

### `ActivateSkill(skill, characterprefab)`
*   **Description:** Activates a skill for a character after validation. Internal use discouraged; prefer `skilltreeupdater`.
*   **Parameters:**  
    `skill` (string) – Skill name.  
    `characterprefab` (string) – Character prefab.
*   **Returns:** `boolean` – `true` if skill was newly activated and passed validation, otherwise `false`.
*   **Error states:** Returns `false` if skill is invalid, already active, or validation fails (reverts activation).

### `DeactivateSkill(skill, characterprefab)`
*   **Description:** Deactivates a skill for a character after validation.
*   **Parameters:**  
    `skill` (string) – Skill name.  
    `characterprefab` (string) – Character prefab.
*   **Returns:** `boolean` – `true` if skill was successfully deactivated, otherwise `false`.
*   **Error states:** Returns `false` if skill is invalid, not active, or validation fails (reverts deactivation).

### `AddSkillXP(amount, characterprefab)`
*   **Description:** Adds XP for a character, clamping to `[0, TUNING.FIXME_DO_NOT_USE_FOR_MODS_OLD_MAX_XP_VALUE]`.
*   **Parameters:**  
    `amount` (number) – XP delta.  
    `characterprefab` (string) – Character prefab.
*   **Returns:** `boolean, number` –  
    - First value: `true` if XP changed and was applied.  
    - Second value: New XP total (or old XP if unchanged).
*   **Error states:** Returns `false, oldskillxp` if XP unchanged or `ignorexp` is set.

### `GetActivatedSkills(characterprefab)`
*   **Description:** Returns the full set of activated skills for a character.
*   **Parameters:**  
    `characterprefab` (string) – Character prefab.
*   **Returns:** `table?` – Set table of skill names, or `nil` if none exist.

### `RespecSkills(characterprefab)`
*   **Description:** Clears all activated skills for the given character (used for respecs).
*   **Parameters:**  
    `characterprefab` (string) – Character prefab.
*   **Returns:** Nothing.

### `ApplyCharacterData(characterprefab, skilltreedata)`
*   **Description:** Applies encoded skill tree string data (e.g., `"skill1,skill2|50"`) for a character after validation.
*   **Parameters:**  
    `characterprefab` (string) – Character prefab.  
    `skilltreedata` (string) – Encoded skill tree string.
*   **Returns:** `boolean` – `true` if valid and applied, otherwise `false`.

### `EncodeSkillTreeData(characterprefab)`
*   **Description:** Serializes skill tree state for a character into a `"skills,comma,separated|xptotal"` string.
*   **Parameters:**  
    `characterprefab` (string) – Character prefab.
*   **Returns:** `string` – Encoded data (e.g., `"!|50"` if no skills, sorted for determinism).

### `DecodeSkillTreeData(data)`
*   **Description:** Parses `"skills|xptotal"` strings into a skill set and XP.
*   **Parameters:**  
    `data` (string) – Encoded skill tree string.
*   **Returns:** `table?, number?` – Activated skills set and XP, or `(nil, nil)` if malformed.

### `Save(force_save, characterprefab)`
*   **Description:** Persists the skill tree data to disk (or skips if `save_enabled` is false or `dirty` is unset).
*   **Parameters:**  
    `force_save` (boolean) – Ignores `save_enabled`/`dirty`.  
    `characterprefab` (string) – Character prefab (special `"LOADFIXUP"` for bulk write).
*   **Returns:** Nothing.

### `Load()`
*   **Description:** Loads skill tree data from persistent storage, with recovery logic for corruption.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateSaveState(characterprefab)`
*   **Description:** Marks state as dirty, updates inventory replication for official characters, and triggers a save.
*   **Parameters:**  
    `characterprefab` (string) – Character prefab.
*   **Returns:** `boolean` – `true` if save was triggered, otherwise `false`.

### `ValidateCharacterData(characterprefab, activatedskills, skillxp)`
*   **Description:** Validates XP, skill count, and skill dependencies (e.g., `must_have_one_of`, `must_have_all_of`).
*   **Parameters:**  
    `characterprefab` (string) – Character prefab.  
    `activatedskills` (table) – Set of skill names.  
    `skillxp` (number) – Total XP.
*   **Returns:** `boolean` – `true` if valid; otherwise logs detailed reason.

### `OPAH_DoBackup()` and `OPAH_Ready()`
*   **Description:** Low-level handshake hooks for preserving client-side data during server sync (`OPAH` = Online Profile Accept/Handshake). Not for general use.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.