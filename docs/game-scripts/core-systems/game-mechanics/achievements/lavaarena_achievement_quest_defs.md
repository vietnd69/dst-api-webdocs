---
id: lavaarena-achievement-quest-defs
title: Lava Arena Achievement Quest Definitions
description: Defines achievement quest categories and progression system for Lava Arena events
sidebar_position: 4
slug: core-systems-lavaarena-achievement-quest-defs
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Lava Arena Achievement Quest Definitions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `lavaarena_achievement_quest_defs` module defines the quest and achievement system for the Lava Arena event. It organizes achievements into categories with different experience point rewards and provides testing functions for quest completion validation.

## Usage Example

```lua
-- Quest definitions are automatically loaded during Lava Arena events
local quest_data = event_server_data("lavaarena", "lavaarena_achievement_quest_defs")
local achievements = quest_data.achievements
```

## Constants

### WXP_DAILY_WIN

**Value:** `5000`

**Status:** stable

**Description:** Experience points awarded for daily win achievements.

### WXP_DAILY_MATCH

**Value:** `500`

**Status:** stable

**Description:** Experience points awarded for daily match participation achievements.

### WXP_QUESTS_BASIC

**Value:** `500`

**Status:** stable

**Description:** Experience points awarded for basic quest completion.

### WXP_QUESTS_CHALLENGE

**Value:** `2500`

**Status:** stable

**Description:** Experience points awarded for challenge quest completion.

### WXP_QUESTS_SPECIALIZED

**Value:** `1500`

**Status:** stable

**Description:** Experience points awarded for specialized character quest completion.

## Functions

### TestMatchTime(user, data, max_time) {#test-match-time}

**Status:** stable

**Description:**
Tests whether a match was won within the specified time limit.

**Parameters:**
- `user` (table): Player user data
- `data` (table): Match outcome data containing `outcome.won` and `outcome.time`
- `max_time` (number): Maximum allowed time in seconds

**Returns:**
- (boolean): True if match was won within time limit

**Example:**
```lua
local result = TestMatchTime(user, data, 30*60) -- Test for 30 minute win
```

### TestForVictory(user, data) {#test-for-victory}

**Status:** stable

**Description:**
Tests whether the player achieved victory in the match.

**Parameters:**
- `user` (table): Player user data
- `data` (table): Match outcome data containing `outcome.won`

**Returns:**
- (boolean): True if player won the match

**Example:**
```lua
local won = TestForVictory(user, data)
```

## Achievement Categories

### quests_daily

**Status:** stable

**Description:**
Daily recurring achievements that reset each day.

**Achievements:**
- `laq_dailywin`: Daily victory achievement (5000 WXP)
- `laq_dailymatch`: Daily match participation (500 WXP)

**Properties:**
- `daily = true`: Marks achievements as daily recurring
- `wxp`: Experience points awarded

### quests_basic

**Status:** stable

**Description:**
Basic achievements accessible to all players with standard difficulty.

**Category WXP:** 500

**Sample Achievements:**
- `laq_battlestandards`: Battle standard related achievements
- `laq_reviver`: Revival related achievements
- `laq_specials_veryfast`: Fast special attack achievements
- `laq_outofharmsway`: Damage avoidance achievements
- `laq_nodeath_solo_easy`: Solo no-death achievements (easy mode)

**Properties:**
- `team = true`: Some achievements require team coordination

### quests_challenge

**Status:** stable

**Description:**
High-difficulty achievements requiring skilled play and coordination.

**Category WXP:** 2500

**Sample Achievements:**
- `laq_nodeath_r2` through `laq_nodeath_r6`: No-death achievements for rounds 2-6
- `laq_wintime_30`, `laq_wintime_25`, `laq_wintime_20`: Time-based victory achievements
- `laq_spinners_hard`: Advanced spinner-related challenges
- `laq_rhinodrill_hard`: Advanced rhinodrill challenges

**Properties:**
- `team = true`: All challenge achievements require team coordination

### quests_specialized

**Status:** stable

**Description:**
Character-specific achievements that require playing specific characters.

**Category WXP:** 1500

**Character Sets:**
- Combat characters: `{"wolfgang", "wathgrithr"}`
- Magic users: `{"waxwell", "wickerbottom"}`
- Support characters: `{"wilson", "winona"}`
- Specialists: Individual character requirements

**Sample Achievements:**
- `laq_guardsbroken`: Guard-breaking achievements for specific characters
- `laq_hammer`: Hammer-related achievements
- `laq_petrify`: Petrification achievements (Waxwell specific)
- `laq_meteorkill`: Meteor kill achievements
- `laq_defeat_*`: Boss defeat achievements available to all characters

## Achievement Properties

### achievementid

**Type:** `string`

**Status:** stable

**Description:** Unique identifier for the achievement.

### wxp

**Type:** `number`

**Status:** stable

**Description:** Experience points awarded upon completion. Can be set per achievement or inherited from category.

### daily

**Type:** `boolean`

**Status:** stable

**Description:** Whether the achievement resets daily.

### team

**Type:** `boolean`

**Status:** stable

**Description:** Whether the achievement requires team coordination.

### character_set

**Type:** `table`

**Status:** stable

**Description:** Array of character names that can complete this achievement. If nil, available to all characters.

## Data Structure

### Achievement Definition

```lua
{
    achievementid = "unique_id",
    wxp = 500,              -- Experience points (optional if category_wxp set)
    daily = true,           -- Daily reset flag (optional)
    team = true,            -- Team achievement flag (optional)  
    character_set = {"wilson", "willow"} -- Allowed characters (optional)
}
```

### Category Definition

```lua
{
    category = "category_name",
    category_wxp = 500,     -- Default WXP for all achievements in category
    data = {
        -- Array of achievement definitions
    }
}
```

## Event Configuration

### seasons

**Value:** `{ 2 }`

**Status:** stable

**Description:** Array of seasons when these achievements are active.

### eventid

**Value:** `"lavaarena"`

**Status:** stable

**Description:** Event identifier for the Lava Arena event.

## Related Modules

- [Lava Arena Achievements](./lavaarena_achievements.md): Individual character achievement definitions
- [Lava Arena Community Progression](./lavaarena_communityprogression.md): Community-wide progression system
- [Event Achievements](./eventachievements.md): General event achievement framework
