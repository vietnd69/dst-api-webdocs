---
id: skilltreedata
title: Skill Tree Data
description: Class for managing character skill tree data including skill activation, experience tracking, validation, and persistence
sidebar_position: 108
slug: api-vanilla/core-systems/skilltreedata
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Skill Tree Data

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **SkillTreeData** class manages character skill tree information including activated skills, experience points, validation logic, and data persistence. It handles skill progression, networking synchronization, and save/load operations for the skill tree system.

## Class Constructor

### SkillTreeData() {#constructor}

**Status:** `stable`

**Description:**
Creates a new SkillTreeData instance with empty skill and experience data.

**Example:**
```lua
local skilltreedata = SkillTreeData()
```

**Initialized Properties:**
- `activatedskills`: Table mapping character prefabs to their activated skills
- `skillxp`: Table mapping character prefabs to their experience points
- `NILDATA`: Cached default encoded data string

## Core Methods

### IsActivated(skill, characterprefab) {#is-activated}

**Status:** `stable`

**Description:**
Checks if a specific skill is activated for a character.

**Parameters:**
- `skill` (string): Skill name to check
- `characterprefab` (string): Character prefab name

**Returns:**
- (boolean): true if skill is activated

**Example:**
```lua
if skilltreedata:IsActivated("wilson_torch", "wilson") then
    print("Wilson has torch skill activated")
end
```

### IsValidSkill(skill, characterprefab) {#is-valid-skill}

**Status:** `stable`

**Description:**
Validates if a skill exists in the character's skill tree definition.

**Parameters:**
- `skill` (string): Skill name to validate
- `characterprefab` (string): Character prefab name

**Returns:**
- (boolean): true if skill is valid for character

**Example:**
```lua
if skilltreedata:IsValidSkill("wilson_torch", "wilson") then
    -- Safe to activate this skill
end
```

### ActivateSkill(skill, characterprefab) {#activate-skill}

**Status:** `stable`

**Description:**
Activates a skill for a character. Performs validation to ensure skill prerequisites are met and available skill points exist.

**Parameters:**
- `skill` (string): Skill name to activate
- `characterprefab` (string): Character prefab name

**Returns:**
- (boolean): true if skill was successfully activated

**Example:**
```lua
local success = skilltreedata:ActivateSkill("wilson_torch", "wilson")
if success then
    print("Torch skill activated for Wilson")
else
    print("Failed to activate skill - check prerequisites or skill points")
end
```

**Validation Performed:**
- Skill exists in character's skill tree
- Character has enough available skill points
- Skill prerequisites are satisfied
- Skill connections (must_have_one_of, must_have_all_of) are valid

### DeactivateSkill(skill, characterprefab) {#deactivate-skill}

**Status:** `stable`

**Description:**
Deactivates a skill for a character. Validates that dependent skills won't become invalid.

**Parameters:**
- `skill` (string): Skill name to deactivate
- `characterprefab` (string): Character prefab name

**Returns:**
- (boolean): true if skill was successfully deactivated

**Example:**
```lua
local success = skilltreedata:DeactivateSkill("wilson_torch", "wilson")
if success then
    print("Torch skill deactivated for Wilson")
end
```

### RespecSkills(characterprefab) {#respec-skills}

**Status:** `stable`

**Description:**
Removes all activated skills for a character, effectively resetting their skill tree.

**Parameters:**
- `characterprefab` (string): Character prefab name

**Example:**
```lua
-- Reset Wilson's entire skill tree
skilltreedata:RespecSkills("wilson")
```

## Experience Management

### GetSkillXP(characterprefab) {#get-skill-xp}

**Status:** `stable`

**Description:**
Gets the current experience points for a character.

**Parameters:**
- `characterprefab` (string): Character prefab name

**Returns:**
- (number): Current experience points (0 if none)

**Example:**
```lua
local xp = skilltreedata:GetSkillXP("wilson")
print("Wilson has", xp, "experience points")
```

### AddSkillXP(amount, characterprefab) {#add-skill-xp}

**Status:** `stable`

**Description:**
Adds experience points to a character, clamped to maximum allowed value.

**Parameters:**
- `amount` (number): Experience points to add
- `characterprefab` (string): Character prefab name

**Returns:**
- (boolean): true if experience was added
- (number): New total experience amount

**Example:**
```lua
local success, newxp = skilltreedata:AddSkillXP(100, "wilson")
if success then
    print("Added XP. Wilson now has", newxp, "total experience")
end
```

### GetPointsForSkillXP(skillxp) {#get-points-for-skill-xp}

**Status:** `stable`

**Description:**
Calculates how many skill points are available for a given experience amount.

**Parameters:**
- `skillxp` (number): Experience points

**Returns:**
- (number): Available skill points

**Example:**
```lua
local xp = 5000
local points = skilltreedata:GetPointsForSkillXP(xp)
print(xp, "experience grants", points, "skill points")
```

**Algorithm:**
Uses `TUNING.SKILL_THRESHOLDS` to determine skill point progression:
```lua
-- Example threshold progression
TUNING.SKILL_THRESHOLDS = {100, 200, 300, 500, 800, ...}
-- 100 XP = 1 point, 300 XP = 2 points, 600 XP = 3 points, etc.
```

### GetAvailableSkillPoints(characterprefab) {#get-available-skill-points}

**Status:** `stable`

**Description:**
Calculates remaining unspent skill points for a character.

**Parameters:**
- `characterprefab` (string): Character prefab name

**Returns:**
- (number): Available unspent skill points

**Example:**
```lua
local available = skilltreedata:GetAvailableSkillPoints("wilson")
print("Wilson can still activate", available, "more skills")
```

**Calculation:**
```lua
-- available = total_points_from_xp - activated_skills_count
```

### GetMaximumExperiencePoints() {#get-maximum-experience-points}

**Status:** `stable`

**Description:**
Gets the maximum possible experience points based on skill thresholds.

**Returns:**
- (number): Maximum experience points

**Example:**
```lua
local max_xp = skilltreedata:GetMaximumExperiencePoints()
print("Maximum possible XP:", max_xp)
```

## Networking Support

### GetPlayerSkillSelection(characterprefab) {#get-player-skill-selection}

**Status:** `stable`

**Description:**
Converts activated skills to a compact bitfield representation for network transmission.

**Parameters:**
- `characterprefab` (string): Character prefab name

**Returns:**
- (table): Array with bitfield values representing activated skills

**Example:**
```lua
local selection = skilltreedata:GetPlayerSkillSelection("wilson")
-- Returns: {bitfield_value} where bits represent activated skills
```

**Technical Details:**
- Uses skill `rpc_id` values to create bitfield
- Maximum 32 skills per bitfield slot
- Optimized for network bandwidth

### GetNamesFromSkillSelection(skillselection, characterprefab) {#get-names-from-skill-selection}

**Status:** `stable`

**Description:**
Converts network bitfield representation back to skill names table.

**Parameters:**
- `skillselection` (table): Bitfield array from network
- `characterprefab` (string): Character prefab name

**Returns:**
- (table): Table mapping skill names to true for activated skills

**Example:**
```lua
local skills = skilltreedata:GetNamesFromSkillSelection(selection, "wilson")
-- Returns: {wilson_torch = true, wilson_lighter = true, ...}
```

## RPC Helper Methods

### GetSkillNameFromID(characterprefab, skill_rpc_id) {#get-skill-name-from-id}

**Status:** `stable`

**Description:**
Looks up skill name from RPC ID for network message handling.

**Parameters:**
- `characterprefab` (string): Character prefab name
- `skill_rpc_id` (number): RPC identifier for skill

**Returns:**
- (string or nil): Skill name or nil if not found

### GetSkillIDFromName(characterprefab, skill) {#get-skill-id-from-name}

**Status:** `stable`

**Description:**
Gets RPC ID for a skill name for network message creation.

**Parameters:**
- `characterprefab` (string): Character prefab name
- `skill` (string): Skill name

**Returns:**
- (number or nil): RPC ID or nil if not found

## Data Persistence

### EncodeSkillTreeData(characterprefab) {#encode-skill-tree-data}

**Status:** `stable`

**Description:**
Encodes skill tree data into a compact string format for storage.

**Parameters:**
- `characterprefab` (string): Character prefab name (optional)

**Returns:**
- (string): Encoded skill tree data

**Format:**
```lua
-- Format: "skill1,skill2,skill3|experience"
-- Example: "wilson_torch,wilson_lighter|1500"
-- No skills: "!|1500"
```

**Example:**
```lua
local encoded = skilltreedata:EncodeSkillTreeData("wilson")
-- Returns: "wilson_torch,wilson_lighter|1500"
```

### DecodeSkillTreeData(data) {#decode-skill-tree-data}

**Status:** `stable`

**Description:**
Decodes skill tree data from string format back to tables.

**Parameters:**
- `data` (string): Encoded skill tree data string

**Returns:**
- (table or nil): Activated skills table
- (number or nil): Experience points

**Example:**
```lua
local skills, xp = skilltreedata:DecodeSkillTreeData("wilson_torch,wilson_lighter|1500")
-- skills = {wilson_torch = true, wilson_lighter = true}
-- xp = 1500
```

### Save(force_save, characterprefab) {#save}

**Status:** `stable`

**Description:**
Saves skill tree data to persistent storage.

**Parameters:**
- `force_save` (boolean): Force save even if not dirty
- `characterprefab` (string): Character prefab for special save modes

**Example:**
```lua
-- Save if data has changed
skilltreedata:Save()

-- Force immediate save
skilltreedata:Save(true)
```

**Storage Format:**
```lua
-- JSON format with full data structure
{
    activatedskills = {wilson = {wilson_torch = true}},
    skillxp = {wilson = 1500}
}
```

### Load() {#load}

**Status:** `stable`

**Description:**
Loads skill tree data from persistent storage with validation and error recovery.

**Example:**
```lua
skilltreedata:Load()
```

**Error Recovery:**
1. Validates loaded data structure
2. Checks each character's skill state
3. Clears invalid configurations
4. Falls back to online profile data if local data is corrupted
5. Saves corrected data back to storage

## Validation System

### ValidateCharacterData(characterprefab, activatedskills, skillxp) {#validate-character-data}

**Status:** `stable`

**Description:**
Comprehensive validation of character skill tree state.

**Parameters:**
- `characterprefab` (string): Character prefab name
- `activatedskills` (table): Skills to validate
- `skillxp` (number): Experience points

**Returns:**
- (boolean): true if configuration is valid

**Validation Checks:**
1. **Character has skill tree**: Prefab exists in SKILLTREE_DEFS
2. **Experience range**: XP >= 0 and within limits
3. **Point allocation**: Activated skills <= available points from XP
4. **Skill existence**: All activated skills exist in character's tree
5. **Prerequisites**: `must_have_one_of` dependencies satisfied
6. **Requirements**: `must_have_all_of` dependencies satisfied
7. **Unlock conditions**: Custom `lock_open` functions validated

**Example:**
```lua
local valid = skilltreedata:ValidateCharacterData(
    "wilson",
    {wilson_torch = true, wilson_lighter = true},
    1500
)
if not valid then
    print("Invalid skill configuration detected")
end
```

## Online Profile Integration

### ApplyOnlineProfileData() {#apply-online-profile-data}

**Status:** `stable`

**Description:**
Synchronizes with Steam/online profile skill tree data.

**Returns:**
- (boolean): true if online data was successfully applied

**Example:**
```lua
if skilltreedata:ApplyOnlineProfileData() then
    print("Synchronized with online profile")
end
```

### ApplyCharacterData(characterprefab, skilltreedata) {#apply-character-data}

**Status:** `stable`

**Description:**
Applies encoded skill tree data for a specific character with validation.

**Parameters:**
- `characterprefab` (string): Character prefab name
- `skilltreedata` (string): Encoded skill tree data

**Returns:**
- (boolean): true if data was successfully applied

**Example:**
```lua
local success = skilltreedata:ApplyCharacterData("wilson", "wilson_torch|1500")
```

## OPAH (Online Profile Access Handler) Methods

### OPAH_DoBackup() {#opah-do-backup}

**Status:** `stable` - Internal Method

**Description:**
Backs up local skill data before receiving server synchronization. Used during multiplayer session startup.

**Internal Process:**
1. Disables save operations
2. Backs up current activated skills
3. Sends local XP to server
4. Enables skip validation mode

### OPAH_Ready() {#opah-ready}

**Status:** `stable` - Internal Method

**Description:**
Completes server synchronization process and restores local data if needed.

**Internal Process:**
1. Compares server data with backed up local data
2. Restores local skills if they differ from server
3. Re-enables save operations and validation
4. Triggers XP update notifications

## Data Structures

### Internal Properties

#### activatedskills
```lua
-- Structure: {characterprefab = {skillname = true, ...}, ...}
{
    wilson = {
        wilson_torch = true,
        wilson_lighter = true
    },
    willow = {
        willow_ignition = true
    }
}
```

#### skillxp
```lua
-- Structure: {characterprefab = experience_points, ...}
{
    wilson = 1500,
    willow = 2300
}
```

### External Dependencies
- `SKILLTREE_DEFS`: Skill tree definitions from prefabs/skilltree_defs
- `SKILLTREE_METAINFO`: Metadata including RPC lookups
- `TUNING.SKILL_THRESHOLDS`: Experience point thresholds for skill points

## Common Usage Patterns

### Basic Skill Management
```lua
local skilltree = SkillTreeData()

-- Check if skill can be activated
if skilltree:GetAvailableSkillPoints("wilson") > 0 and
   skilltree:IsValidSkill("wilson_torch", "wilson") then
    
    -- Activate the skill
    if skilltree:ActivateSkill("wilson_torch", "wilson") then
        print("Skill activated successfully")
    end
end
```

### Experience and Point Calculation
```lua
-- Add experience and check new available points
local old_points = skilltree:GetAvailableSkillPoints("wilson")
local success, new_xp = skilltree:AddSkillXP(500, "wilson")
local new_points = skilltree:GetAvailableSkillPoints("wilson")

if new_points > old_points then
    print("Gained", new_points - old_points, "skill points!")
end
```

### Skill Tree Reset
```lua
-- Complete character respec
local character = "wilson"
skilltree:RespecSkills(character)
print("Reset all skills for", character)
print("Available points:", skilltree:GetAvailableSkillPoints(character))
```

### Network Synchronization
```lua
-- Prepare data for network transmission
local selection = skilltree:GetPlayerSkillSelection("wilson")
-- ... send selection over network ...

-- Receive and apply network data
local received_skills = skilltree:GetNamesFromSkillSelection(selection, "wilson")
```

## Error Handling

The class includes comprehensive error handling:

- **Invalid Skills**: Prints warnings for non-existent skills
- **Validation Failures**: Detailed error messages for validation issues
- **Corrupt Data**: Automatic recovery from corrupted save files
- **Network Sync**: Backup/restore during multiplayer synchronization

## Related Modules

- [**Skill Tree Definitions**](../prefabs/skilltree_defs.md): Contains skill tree structure definitions
- [**Skill Tree Updater**](../components/skilltreeupdater.md): Component that uses this class for skill management
- [**Player Profile**](./playerprofile.md): Handles profile-level skill tree persistence
- [**Network Client RPC**](./networkclientrpc.md): Network communication for skill tree updates
- [**Tuning**](./constants.md): Contains skill-related constants and thresholds
