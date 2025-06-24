---
id: lavaarena-communityprogression
title: Lava Arena Community Progression
description: Manages community-wide progression tracking and unlock system for Lava Arena events
sidebar_position: 5
slug: core-systems-lavaarena-communityprogression
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Lava Arena Community Progression

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `lavaarena_communityprogression` module manages the community-wide progression system for Lava Arena events. It handles server queries for progression data, tracks unlockable content, manages quest data, and synchronizes progression between different game modes (frontend, client, server).

## Usage Example

```lua
-- Create community progression instance
local progression = CommunityProgression()
progression:RegisterForWorld()

-- Check if content is unlocked
if progression:IsUnlocked("trails") then
    -- Trails creature is available
end

-- Request updated data
progression:RequestAllData(false, TheNet:GetUserID())
```

## Constants

### Operation Modes

#### IS_FRONTEND

**Value:** `0`

**Status:** stable

**Description:** Frontend mode for main menu and pre-game screens.

#### IS_CLIENT_ONLY

**Value:** `1`

**Status:** stable

**Description:** Client-only mode for players joining dedicated servers.

#### IS_DEDICATED_SERVER

**Value:** `2`

**Status:** stable

**Description:** Dedicated server mode handling multiple clients.

#### IS_CLIENT_HOSTED

**Value:** `3`

**Status:** stable

**Description:** Client-hosted mode where one player hosts the game.

### Configuration

#### PROGRESSION_QUERY_EXPIRY

**Value:** `600` (10 minutes)

**Status:** stable

**Description:** Time in seconds before progression data expires and needs refresh.

#### NUM_RETRIES

**Value:** `4`

**Status:** stable

**Description:** Number of retry attempts for failed server queries.

#### FINAL_UNLOCK_DATA

**Status:** stable

**Description:** Complete unlock data when all content is available.

**Structure:**
```lua
{
    level = 10,
    percent = 1.0,
    unlock_order = {
        "trails", "book_elemental", "boarrior", "lavaarena_firebomb",
        "lavaarena_armor_hpextraheavy", "lavaarena_armor_hpdamager",
        "rhinodrill", "lavaarena_heavyblade", "lavaarena_armor_hprecharger",
        "lavaarena_armor_hppetmastery", "beetletaur"
    }
}
```

## Class: CommunityProgression

### Constructor

```lua
local progression = CommunityProgression()
```

**Description:**
Creates a new community progression instance with default values.

**Initial State:**
- Mode: `IS_FRONTEND`
- Progression level: 1
- No unlocked content
- Empty quest data

## Methods

### GetUnlockData(id) {#get-unlock-data}

**Status:** stable

**Description:**
Retrieves unlock data for a specific item or creature.

**Parameters:**
- `id` (string): Unlock identifier or alias

**Returns:**
- (table): Unlock data containing id, style, atlas, icon, and other properties

**Example:**
```lua
local trails_data = progression:GetUnlockData("trails")
-- Returns: {id = "trails", style = "creature", atlas = "images/lavaarena_unlocks.xml", ...}
```

### IsLocked(id) / IsUnlocked(id) {#is-locked}

**Status:** stable

**Description:**
Checks whether specific content is locked or unlocked.

**Parameters:**
- `id` (string): Content identifier

**Returns:**
- (boolean): Lock status

**Example:**
```lua
if progression:IsUnlocked("boarrior") then
    print("Boarrior boss is available!")
end
```

### GetProgression() {#get-progression}

**Status:** stable

**Description:**
Gets current community progression status.

**Returns:**
- (table): Table with `level` and `percent` fields

**Example:**
```lua
local progress = progression:GetProgression()
print("Level:", progress.level, "Progress:", progress.percent * 100 .. "%")
```

### GetLastSeenProgression() {#get-last-seen-progression}

**Status:** stable

**Description:**
Gets the last seen progression data for comparison.

**Returns:**
- (table): Previous progression data

### IsNewUnlock(id) {#is-new-unlock}

**Status:** stable

**Description:**
Checks if an unlock is newly available since last seen progression.

**Parameters:**
- `id` (string): Content identifier

**Returns:**
- (boolean): True if newly unlocked

**Example:**
```lua
if progression:IsNewUnlock("rhinodrill") then
    -- Show unlock notification
end
```

### RequestProgressionData(force, time) {#request-progression-data}

**Status:** stable

**Description:**
Requests updated progression data from the server.

**Parameters:**
- `force` (boolean): Whether to force refresh regardless of expiry
- `time` (number): Timestamp for the request

**Example:**
```lua
progression:RequestProgressionData(true, os.time())
```

### RequestQuestData(force, userid, time) {#request-quest-data}

**Status:** stable

**Description:**
Requests quest data for a specific user.

**Parameters:**
- `force` (boolean): Whether to force refresh
- `userid` (string): User identifier (optional, defaults to current user)
- `time` (number): Timestamp for the request

**Example:**
```lua
progression:RequestQuestData(false, TheNet:GetUserID(), os.time())
```

### RequestAllData(force, userid) {#request-all-data}

**Status:** stable

**Description:**
Requests both progression and quest data simultaneously.

**Parameters:**
- `force` (boolean): Whether to force refresh
- `userid` (string): User identifier for quest data

**Example:**
```lua
progression:RequestAllData(false, TheNet:GetUserID())
```

### IsQueryActive() {#is-query-active}

**Status:** stable

**Description:**
Checks if any server queries are currently active.

**Returns:**
- (boolean): True if queries are in progress

### GetCurrentQuestData(userid) {#get-current-quest-data}

**Status:** stable

**Description:**
Gets current quest data for a user.

**Parameters:**
- `userid` (string): User identifier

**Returns:**
- (table): Quest data including daily and regular quests

**Structure:**
```lua
{
    version = 1,
    event_day = 5,
    quest_day = 12,
    daily_win = {quest = "laq_dailywin", daily = true},
    daily_match = {quest = "laq_dailymatch", daily = true},
    basic = {quest = "laq_battlestandards"},
    challenge = {quest = "laq_nodeath_r3"},
    special1 = {character = "wilson", quest = "wilson_reviver"},
    special2 = {character = "willow", quest = "willow_meteor"},
    daily_expiry = timestamp,
    quest_expiry = timestamp
}
```

### RegisterForWorld() {#register-for-world}

**Status:** stable

**Description:**
Registers the progression system for the current world context and sets up appropriate event listeners.

**Example:**
```lua
progression:RegisterForWorld()
```

### Load() / Save() {#load-save}

**Status:** stable

**Description:**
Loads progression data from persistent storage or saves current data.

**Example:**
```lua
progression:Load()  -- Load on startup
progression:Save()  -- Save when data changes
```

## Unlock System

### Unlock Types

#### Creatures

**Style:** `"creature"`

**Description:** Enemy creatures that become available in matches.

**Examples:**
- `trails`: Trail creatures
- `rhinodrill`: Rhinoceros drill creatures

#### Items

**Style:** `"item"`

**Description:** Equipment and consumable items.

**Examples:**
- `book_elemental`: Elemental spellbook
- `lavaarena_firebomb`: Fire bomb weapon
- `lavaarena_heavyblade`: Heavy blade weapon
- `lavaarena_armor_*`: Various armor types

#### Bosses

**Style:** `"boss"`

**Description:** Major boss enemies.

**Examples:**
- `boarrior`: Boar warrior boss
- `beetletaur`: Beetle centaur boss

### Unlock Properties

#### id

**Type:** `string`

**Status:** stable

**Description:** Unique identifier for the unlock.

#### alias

**Type:** `string`

**Status:** stable

**Description:** Alternative identifier (optional).

#### progression_key

**Type:** `boolean`

**Status:** stable

**Description:** Whether this unlock represents a major progression milestone.

#### style

**Type:** `string`

**Status:** stable

**Description:** Visual category: "creature", "item", or "boss".

#### atlas

**Type:** `string`

**Status:** stable

**Description:** Texture atlas path for the unlock icon.

#### icon

**Type:** `string`

**Status:** stable

**Description:** Icon texture name within the atlas.

## Server Communication

### Progression Endpoint

**URL:** `https://theforge.kleientertainment.com/wins`

**Method:** GET

**Description:** Retrieves community progression data.

**Response Format:**
```json
{
    "level": 4,
    "percent": 0.65,
    "unlock_order": ["trails", "book_elemental", "boarrior"]
}
```

### Quest Endpoint

**URL:** `https://theforge.kleientertainment.com/quest?userid={userid}&date={timestamp}`

**Method:** GET

**Description:** Retrieves user-specific quest data.

**Response Format:**
```json
{
    "version": 1,
    "event_day": 5,
    "quest_day": 12,
    "d_win": "laq_dailywin",
    "d_match": "laq_dailymatch",
    "basic": {"quest": "laq_battlestandards"},
    "challenge": {"quest": "laq_nodeath_r3"},
    "special1": {"character": "wilson", "quest": "wilson_reviver"},
    "special2": {"character": "willow", "quest": "willow_meteor"},
    "daily_expiry": 1640995200,
    "quest_expiry": 1641081600
}
```

## Events

### "community_clientdata_updated"

**Status:** stable

**Description:**
Fired when client receives updated progression or quest data.

**Example:**
```lua
TheGlobalInstance:ListenForEvent("community_clientdata_updated", function()
    -- Refresh UI with new data
end)
```

### "community_progression_request_complete"

**Status:** stable

**Description:**
Fired when server completes progression data request.

### "community_quest_request_complete"

**Status:** stable

**Parameters:**
- `data.userid` (string): User ID for completed quest request

**Description:**
Fired when server completes quest data request.

## Error Handling

### Progression Errors

**Error Codes:**
- `"Not Set"`: Initial state, no data requested
- `"Progression Query Failed: {code}"`: Server request failed
- `"Failed to parse progression json"`: JSON parsing error

### Quest Errors

**Error Codes:**
- `"Quest Query Failed: {code}"`: Server request failed  
- `"Failed to parse quest json for {userid}"`: JSON parsing error

### Retry Logic

The system automatically retries failed requests up to `NUM_RETRIES` times before reporting permanent failure.

## Related Modules

- [Lava Arena Achievements](./lavaarena_achievements.md): Character-specific achievement system
- [Lava Arena Achievement Quest Definitions](./lavaarena_achievement_quest_defs.md): Quest-based achievement definitions
- [Event Achievements](./eventachievements.md): General event achievement framework
- [Festival Events](./festivalevents.md): Event activation and management
