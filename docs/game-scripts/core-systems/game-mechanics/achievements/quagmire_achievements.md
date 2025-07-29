---
id: quagmire_achievements
title: Quagmire Achievements
description: Achievement system definitions for the Quagmire seasonal event with WXP rewards and completion criteria
sidebar_position: 6

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Quagmire Achievements

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `quagmire_achievements` module defines the achievement system for the Quagmire seasonal event. It provides structured achievement data with WXP (Winter's Feast Experience Points) rewards, completion criteria, and categorized challenges for players participating in the cooking-focused event.

The system tracks various gameplay metrics including cooking performance, resource gathering, farming activities, and team coordination to award achievements that unlock permanent rewards.

## Constants

### WXP Levels

**Status:** `stable`

**Description:** Experience point reward tiers for achievement completion.

- `WXP_LEVEL1` = 500 XP
- `WXP_LEVEL2` = 1000 XP  
- `WXP_LEVEL2_5` = 5000 XP
- `WXP_LEVEL3` = 10000 XP
- `WXP_LEVEL4` = 20000 XP
- `WXP_LEVEL5` = 30000 XP (highest tier)

### meat_ingredients

**Type:** `table`

**Status:** `stable`

**Description:** Array of ingredient names that count as meat products for meat-related achievements.

**Contents:**
```lua
{
    "quagmire_salmon", "quagmire_salmon_cooked",
    "quagmire_crabmeat", "quagmire_crabmeat_cooked", 
    "quagmire_smallmeat", "quagmire_cookedsmallmeat",
    "meat", "cookedmeat"
}
```

## Achievement Categories

### Encore Category

**Status:** `stable`

**Description:** Advanced achievements requiring exceptional skill and coordination.

**Key Achievements:**
- `quag_encore_nomatches` (30000 XP): Win without any successful tributes
- `quag_encore_notrees` (20000 XP): Win without chopping any logs
- `quag_encore_meaty` (20000 XP): Win using only meat-based recipes (excluding syrup)
- `quag_encore_veggie` (20000 XP): Win using only vegetarian recipes
- `quag_encore_allcooks` (5000 XP): All players (3+) must cook at least 2 meals
- `quag_encore_all_stations_large` (5000 XP): Use all 3 cooking stations with large containers
- `quag_encore_tribute_coin3` (5000 XP): Earn 3+ tier-3 coins in tributes
- `quag_encore_tribute_coin2` (1000 XP): Earn 3+ tier-2 coins in tributes

### Victory Category

**Status:** `stable`

**Description:** Win-condition achievements with various constraints and challenges.

**Key Achievements:**
- `quag_win_first` (10000 XP): First victory achievement
- `quag_win_nosilver` (30000 XP): Win without any silvered tributes
- `quag_win_nosalt` (20000 XP): Win without any salted tributes
- `quag_win_perfect` (20000 XP): Win with zero failed tributes
- `quag_win_nodups` (20000 XP): Win without giving duplicate tributes
- `quag_win_noburnt` (10000 XP): Win without any burnt meals
- `quag_win_veryfast` (30000 XP): Win with ≤7 total tributes
- `quag_win_fast` (20000 XP): Win with ≤10 total tributes
- `quag_win_verylong` (30000 XP): Win with ≥18 successful tributes
- `quag_win_long` (20000 XP): Win with ≥15 successful tributes

### Tributes Category

**Status:** `stable`

**Description:** Achievements focused on tribute delivery and coin earning.

**Key Achievements:**
- `tribute_fast` (10000 XP): Deliver 3 tributes within 180 seconds
- `tribute_coin4` (5000 XP): Earn at least one tier-4 coin
- `tribute_coin3` (1000 XP): Earn at least one tier-3 coin
- `tribute_coin2` (500 XP): Earn at least one tier-2 coin
- `tribute_num_high` (5000 XP): Complete ≥9 successful tributes
- `tribute_num_med` (1000 XP): Complete ≥6 successful tributes
- `tribute_num_low` (500 XP): Complete ≥3 successful tributes

### Chef Category

**Status:** `stable`

**Description:** Cooking-focused achievements tracking meal preparation skills.

**Key Achievements:**
- `cook_full_book` (30000 XP): Complete full recipe book (currently disabled)
- `cook_noburnt` (1000 XP): Cook ≥6 meals without burning any
- `cook_first` (500 XP): Cook your first meal
- `cook_large` (500 XP): Cook a 4-ingredient recipe
- `cook_all_stations` (500 XP): Use all 3 cooking stations
- `cook_silver` (500 XP): Successfully cook a silver-quality dish

### Farmer Category

**Status:** `stable`

**Description:** Agricultural achievements for farming and crop management.

**Key Achievements:**
- `farm_sow` (1000 XP): Plant ≥30 crops in a match
- `farm_fertilize` (500 XP): Fertilize 20 times
- `farm_till` (500 XP): Till soil 50 times
- `farm_sow_all` (500 XP): Plant all 7 different seed types

### Gatherer Category

**Status:** `stable`

**Description:** Resource collection achievements for various gathering activities.

**Key Achievements:**
- `gather_crab` (1000 XP): Successfully catch a crab
- `gather_logs` (500 XP): Collect ≥80 logs in a match
- `gather_safe` (500 XP): Successfully open a safe
- `gather_sap` (500 XP): Collect 9 sap from trees
- `gather_spice` (500 XP): Grind 5 spot spice recipes

## Achievement Structure

### Achievement Properties

Each achievement contains these properties:

**Core Properties:**
- `achievementid` (string): Unique identifier for the achievement
- `wxp` (number): WXP reward amount using WXP_LEVEL constants
- `category` (string): Category name (auto-assigned from parent)
- `prefab` (string|nil): Character restriction (nil for any character)

**Testing Functions:**
- `testfn` (function): Real-time progress testing during gameplay
- `endofmatchfn` (function): End-of-match completion validation
- `shared_progress_fn` (function): Shared progress tracking across team

**Special Properties:**
- `nosave` (boolean): Achievement progress not saved between sessions

### Function Signatures

#### testfn(user, data, scratchpad, shared_scratchpad)
Real-time achievement progress testing.

**Parameters:**
- `user` (table): Player information and user ID
- `data` (varies): Context-specific data (recipe, ingredient, etc.)
- `scratchpad` (table): Player-specific progress storage
- `shared_scratchpad` (table): Team-wide progress storage

#### endofmatchfn(user, data, scratchpad, shared_scratchpad)
End-of-match achievement validation.

**Parameters:**
- `user` (table): Player information and user ID
- `data` (table): Match outcome and statistics data
- `scratchpad` (table): Player-specific progress storage
- `shared_scratchpad` (table): Team-wide progress storage

#### shared_progress_fn(data, shared_scratchpad)
Team progress tracking for collaborative achievements.

**Parameters:**
- `data` (table): Event-specific data
- `shared_scratchpad` (table): Team-wide progress storage

## Event Configuration

**Return Structure:**
```lua
{
    seasons = { 1 },
    eventid = "quagmire",
    achievements = Quagmire_Achievements
}
```

**Properties:**
- `seasons`: Array of valid seasons for the event
- `eventid`: Event identifier for the achievement system
- `achievements`: Complete achievement data structure

## Data Analytics Integration

The achievement system integrates with several data tracking systems:

**Analytics Objects:**
- `data.analytics`: Match-level statistics tracking
- `data.statstracker`: Individual player statistics
- `data.outcome`: Match outcome information (won/lost, time)

**Common Analytics Methods:**
- `GetMatchStat(stat_name)`: Retrieve match-level statistics
- `GetStatTotal(stat_name, userid)`: Get player-specific totals
- `GetGaveDuplicateTributed()`: Check for duplicate tribute delivery

## Usage Example

```lua
-- Example of achievement testing in gameplay
local achievement_data = {
    user = { userid = "player123" },
    data = {
        recipe = { station = "cookpot", ingredients = {"meat", "carrot", "potato", "onion"} },
        outcome = { won = true, time = 1800 },
        statstracker = game_stats_tracker,
        analytics = match_analytics
    },
    scratchpad = {},
    shared_scratchpad = {}
}

-- Test large recipe achievement
local cook_large_achievement = achievements.chef.data[4] -- cook_large
local success = cook_large_achievement.testfn(
    achievement_data.user, 
    achievement_data.data, 
    achievement_data.scratchpad
)
-- Returns: true (4 ingredients = large recipe)
```

## Related Modules

- [Event Achievements](./eventachievements.md): Core achievement system handling
- [Player Profile](./playerprofile.md): WXP storage and progression tracking
- [Analytics](./analytics.md): Match and player statistics collection
- [Quagmire Recipe Book](./quagmire_recipebook.md): Recipe discovery system integration
