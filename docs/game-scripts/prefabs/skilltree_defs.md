---
id: skilltree_defs
title: Skilltree Defs
description: Defines the skill tree data structures and utility functions for character progression systems.
tags: [progression, ui, character]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: d399bd99
system_scope: ui
---

# Skilltree Defs

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`skilltree_defs` is a data configuration module that manages character skill tree definitions and provides utility functions for skill validation, tag checking, and lock conditions. It loads character-specific skill data from separate prefab files and aggregates them into centralized tables. The module handles networking constraints (maximum 32 networked skills per character) and validates tree structure integrity during initialization.

## Usage example
```lua
local SkillTreeDefs = require("prefabs/skilltree_defs")

-- Access skill definitions for a character
local wilsonSkills = SkillTreeDefs.SKILLTREE_DEFS["wilson"]

-- Check if a player has a specific skill tag
local hasCombatTag = SkillTreeDefs.FN.HasTag("wilson", "combat", activatedSkills)

-- Count total activated skills
local skillCount = SkillTreeDefs.FN.CountSkills("wilson", activatedSkills)

-- Create a custom lock condition
local fuelWeaverLock = SkillTreeDefs.FN.MakeFuelWeaverLock({ pos = { x = 100, y = 200 } })
```

## Dependencies & tags
**External dependencies:**
- `prefabs/skilltree_<character>` -- character-specific skill data loaded via require()
- `STRINGS.SKILLTREE` -- localization strings for lock descriptions
- `TheGenericKV` -- key-value storage for boss kill tracking (Fuel Weaver, Celestial Champion)
- `GetTableSize` -- utility function for counting table entries
- `table.contains` -- utility function for tag checking
- `deepcopy` -- utility function for duplicating lock tables
- `orderedPairs` -- utility function for deterministic iteration

**Components used:**
None identified

**Tags:**
None identified

## Properties

### Top-level module properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLTREE_DEFS` | table | `{}` | Maps character prefab names to their skill definition tables. |
| `SKILLTREE_METAINFO` | table | `{}` | Contains metadata per character: RPC_LOOKUP, TOTAL_SKILLS_COUNT, TOTAL_LOCKS, BACKGROUND_SETTINGS, modded flag. |
| `SKILLTREE_ORDERS` | table | `{}` | Stores skill ordering data per character. |
| `FN` | table | `{}` | Table of utility functions for skill tree operations. |
| `CUSTOM_FUNCTIONS` | table | `{}` | Stores custom character-specific functions. |
| `CreateSkillTreeFor` | function | --- | Function to create and validate a skill tree for a character. |
| `DEBUG_REBUILD` | function | --- | Debug function to rebuild all skill tree data. |

### Skill record schema fields
Access individual skill definitions via `SKILLTREE_DEFS[character][skill_name].*` where `skill_name` is a dynamic key (string) for each skill in the tree.

| Field | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `defaultfocus` | boolean | --- | Whether this skill is the default focus for controller navigation. |
| `infographic` | boolean | --- | Whether this skill is an infographic (visual-only, no connections). |
| `connects` | table | --- | List of skill names this skill connects to (OR gate unlocking). |
| `locks` | table | --- | List of skill names that must be unlocked to access this skill (AND gate). |
| `lock_open` | function | --- | Function that returns whether the lock is open. |
| `root` | boolean | --- | Whether this skill is a root node in the tree. |
| `rpc_id` | number | --- | Network RPC ID assigned automatically (max 32 per character). |
| `must_have_one_of` | table | --- | Skills where at least one must be activated. |
| `must_have_all_of` | table | --- | Skills where all must be activated. |
| `tags` | table | --- | List of tags associated with this skill. |
| `desc` | string | --- | Description string from STRINGS.SKILLTREE. |
| `group` | string | --- | Skill group identifier (e.g., "allegiance"). |
| `pos` | table | --- | Position data for UI placement. |

### Metadata fields per character
Access via `SKILLTREE_METAINFO[character].*`.

| Field | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RPC_LOOKUP` | table | --- | Maps RPC IDs to skill names. |
| `TOTAL_SKILLS_COUNT` | number | --- | Total count of networked skills. |
| `TOTAL_LOCKS` | number | --- | Total count of lock conditions. |
| `BACKGROUND_SETTINGS` | table | --- | Background visual settings for the skill tree UI. |
| `modded` | boolean | --- | Flag set when skill tree is modified via metatable. |

## Main functions
### `CreateSkillTreeFor(characterprefab, skills)`
* **Description:** Creates and validates a skill tree for a character. Assigns RPC IDs, validates connections and locks, and populates SKILLTREE_DEFS and SKILLTREE_METAINFO. Prints FIXME warnings for validation errors.
* **Parameters:**
  - `characterprefab` -- string prefab name of the character
  - `skills` -- table of skill definitions keyed by skill name
* **Returns:** None
* **Error states:** None

### `FN.CountSkills(prefab, activatedskills)`
* **Description:** Returns the total count of activated skills for a character. Runs on both server and client.
* **Parameters:**
  - `prefab` -- string character prefab name
  - `activatedskills` -- table of activated skill names or nil
* **Returns:** Number of activated skills, or `0` if activatedskills is nil.
* **Error states:** None

### `FN.HasTag(prefab, targettag, activatedskills)`
* **Description:** Checks if any activated skill for a character has the specified tag. Runs on both server and client.
* **Parameters:**
  - `prefab` -- string character prefab name
  - `targettag` -- string tag to search for
  - `activatedskills` -- table of activated skill names or nil
* **Returns:** `true` if any activated skill has the tag, `false` otherwise.
* **Error states:** None

### `FN.CountTags(prefab, targettag, activatedskills)`
* **Description:** Counts how many activated skills for a character have the specified tag. Runs on both server and client.
* **Parameters:**
  - `prefab` -- string character prefab name
  - `targettag` -- string tag to count
  - `activatedskills` -- table of activated skill names or nil
* **Returns:** Number of skills with the tag, or `0` if activatedskills is nil.
* **Error states:** None

### `FN.SkillHasTags(skill, tag, prefabname)`
* **Description:** Checks if a specific skill definition has a particular tag.
* **Parameters:**
  - `skill` -- string skill name
  - `tag` -- string tag to check
  - `prefabname` -- string character prefab name
* **Returns:** `true` if the skill has the tag, `nil` otherwise (tag not found or skill/prefab not found).
* **Error states:** None

### `FN.MakeFuelWeaverLock(extra_data, not_root)`
* **Description:** Creates a lock condition that opens after the Fuel Weaver boss is killed. Returns a lock table with lock_open function checking TheGenericKV.
* **Parameters:**
  - `extra_data` -- table with optional pos, connects, group overrides or nil
  - `not_root` -- boolean, if true the lock is not a root node
* **Returns:** Lock table with desc, root, group, tags, lock_open function, and optional pos/connects.
* **Error states:** None

### `FN.MakeNoShadowLock(extra_data, not_root)`
* **Description:** Creates a lock condition that opens only if no shadow_favor tag skills are activated. Returns nil from lock_open to indicate locked state.
* **Parameters:**
  - `extra_data` -- table with optional pos, connects, group overrides or nil
  - `not_root` -- boolean, if true the lock is not a root node
* **Returns:** Lock table with lock_open function that returns true if no shadow_favor skills, nil otherwise.
* **Error states:** None

### `FN.MakeCelestialChampionLock(extra_data, not_root)`
* **Description:** Creates a lock condition that opens after the Celestial Champion boss is killed. Returns a lock table with lock_open function checking TheGenericKV.
* **Parameters:**
  - `extra_data` -- table with optional pos, connects, group overrides or nil
  - `not_root` -- boolean, if true the lock is not a root node
* **Returns:** Lock table with desc, root, group, tags, lock_open function, and optional pos/connects.
* **Error states:** None

### `FN.MakeNoLunarLock(extra_data, not_root)`
* **Description:** Creates a lock condition that opens only if no lunar_favor tag skills are activated. Returns nil from lock_open to indicate locked state.
* **Parameters:**
  - `extra_data` -- table with optional pos, connects, group overrides or nil
  - `not_root` -- boolean, if true the lock is not a root node
* **Returns:** Lock table with lock_open function that returns true if no lunar_favor skills, nil otherwise.
* **Error states:** None

### `FN.MakePurelyVisualLock(skills, locknametoreplicate, locknamesuffix)`
* **Description:** Creates a visual-only lock by duplicating an existing lock and removing connections. Used for UI display without functional locking.
* **Parameters:**
  - `skills` -- table of skill definitions to modify
  - `locknametoreplicate` -- string name of the lock to duplicate
  - `locknamesuffix` -- string suffix to append to the new lock name
* **Returns:** The created lock table
* **Error states:** Errors if `locknametoreplicate` does not exist in `skills` table (nil dereference on deepcopy).

### `DEBUG_REBUILD()`
* **Description:** Rebuilds all skill tree data by clearing loaded character modules and calling BuildAllData again. Pushes debug_rebuild_skilltreedata event. For debugging purposes only, no safety checks.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Pushes:** `debug_rebuild_skilltreedata` - fired when DEBUG_REBUILD() completes rebuilding all skill tree data.