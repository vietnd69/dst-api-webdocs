---
id: core-systems-stats
title: Stats
description: Statistics and metrics collection system for tracking game events and performance data
sidebar_position: 1
slug: api-vanilla/core-systems/stats
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Stats

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Stats` module provides a comprehensive system for collecting, organizing, and transmitting game statistics and metrics data in Don't Starve Together. It handles event tracking, timing measurements, profile statistics, session data, and automated metrics reporting to servers for analytics purposes.

The system is designed to capture both user-facing gameplay statistics and internal performance metrics while respecting privacy settings and enabling/disabling based on configuration.

## Usage Example

```lua
-- Track a simple event
ProfileStatsAdd("items_collected", 1)

-- Track an event with specific value
ProfileStatsAdd("damage_dealt", 25)

-- Set a specific stat value
ProfileStatsSet("current_level", 10)

-- Track nested statistics
ProfileStatsAddToField("combat.weapons.spear", 1)

-- Send custom metrics event
PushMetricsEvent("player_death", ThePlayer, {
    cause = "monster",
    location = "forest"
})

-- Check if super user commands were used
if WasSuUsed() then
    print("Debug commands were used this session")
end
```

## Core Functionality

### Statistics Categories

The stats system handles several categories of data:

- **Profile Stats**: Persistent player statistics across sessions
- **Tracking Events**: Discrete event occurrences during gameplay
- **Timing Stats**: Performance and duration measurements
- **Game Stats**: Session-specific gameplay data
- **Main Menu Stats**: Frontend usage statistics

### Data Collection Flow

1. **Event Recording**: Game events are captured via various `ProfileStats*` functions
2. **Context Building**: Player and session context is automatically added
3. **Data Aggregation**: Statistics are accumulated and organized
4. **Transmission**: Data is periodically sent to analytics servers
5. **Privacy Handling**: User data is anonymized or filtered based on settings

## Global Variables

### STATS_ENABLE

**Type:** `boolean`

**Status:** `stable`

**Description:**
Global flag that enables or disables the entire statistics system. Based on `METRICS_ENABLED` setting.

### ProfileStats

**Type:** `table`

**Status:** `stable`

**Description:**
Global table containing accumulated profile statistics for the current session.

### TrackingEventsStats

**Type:** `table`

**Status:** `stable`

**Description:**
Global table tracking discrete events that occurred during gameplay.

### TrackingTimingStats

**Type:** `table`

**Status:** `stable`

**Description:**
Global table containing timing and performance measurements.

## Core Functions

### ProfileStatsAdd(item, value) {#profilestatsadd}

**Status:** `stable`

**Description:**
Adds a value to a profile statistic, creating the statistic if it doesn't exist.

**Parameters:**
- `item` (string): Name of the statistic to increment
- `value` (number): Value to add (defaults to 1 if nil)

**Example:**
```lua
-- Increment by 1
ProfileStatsAdd("monsters_killed")

-- Increment by specific amount
ProfileStatsAdd("experience_gained", 150)
```

### ProfileStatsSet(item, value) {#profilestatsset}

**Status:** `stable`

**Description:**
Sets a profile statistic to a specific value, overwriting any existing value.

**Parameters:**
- `item` (string): Name of the statistic to set
- `value` (any): Value to assign to the statistic

**Example:**
```lua
ProfileStatsSet("current_day", 25)
ProfileStatsSet("favorite_character", "wilson")
```

### ProfileStatsGet(item) {#profilestatsget}

**Status:** `stable`

**Description:**
Retrieves the current value of a profile statistic.

**Parameters:**
- `item` (string): Name of the statistic to retrieve

**Returns:**
- (any): Current value of the statistic, or nil if not set

**Example:**
```lua
local current_day = ProfileStatsGet("current_day")
if current_day and current_day > 100 then
    -- Player has survived over 100 days
end
```

### ProfileStatsAddItemChunk(item, chunk) {#profilestatsadditemchunk}

**Status:** `stable`

**Description:**
Adds a chunk-based statistic, useful for categorizing items or events into groups.

**Parameters:**
- `item` (string): Main category name
- `chunk` (string): Subcategory or chunk name

**Example:**
```lua
-- Track items by type
ProfileStatsAddItemChunk("items_crafted", "tools")
ProfileStatsAddItemChunk("items_crafted", "weapons")

-- Results in ProfileStats["items_crafted"]["tools"] = 1
--                ProfileStats["items_crafted"]["weapons"] = 1
```

### ProfileStatsAddToField(field, value) {#profilestatsaddtofield}

**Status:** `stable`

**Description:**
Adds a value to a nested field using dot notation, creating intermediate tables as needed.

**Parameters:**
- `field` (string): Dot-separated field path (e.g., "combat.weapons.spear")
- `value` (number): Value to add (defaults to 1 if nil)

**Example:**
```lua
-- Create nested statistics
ProfileStatsAddToField("survival.food.berries", 5)
ProfileStatsAddToField("survival.food.meat", 3)
ProfileStatsAddToField("combat.damage.dealt", 100)

-- Results in nested table structure:
-- ProfileStats.survival.food.berries = 5
-- ProfileStats.survival.food.meat = 3
-- ProfileStats.combat.damage.dealt = 100
```

### ProfileStatsSetField(field, value) {#profilestatssetfield}

**Status:** `stable`

**Description:**
Sets a nested field to a specific value using dot notation.

**Parameters:**
- `field` (string): Dot-separated field path
- `value` (any): Value to assign

**Returns:**
- (any): The assigned value, or nil if field parameter is invalid

**Example:**
```lua
ProfileStatsSetField("player.status.health", 100)
ProfileStatsSetField("world.settings.difficulty", "survival")
```

### ProfileStatsAppendToField(field, value) {#profilestatsappendtofield}

**Status:** `stable`

**Description:**
Appends a value to an array field, creating the array if it doesn't exist.

**Parameters:**
- `field` (string): Dot-separated field path
- `value` (any): Value to append to the array

**Example:**
```lua
-- Build a list of achievements
ProfileStatsAppendToField("achievements.unlocked", "first_winter")
ProfileStatsAppendToField("achievements.unlocked", "monster_slayer")

-- Results in ProfileStats.achievements.unlocked = {"first_winter", "monster_slayer"}
```

## Advanced Functions

### PushMetricsEvent(event_id, player, values, is_only_local_users_data) {#pushmetricsevent}

**Status:** `stable`

**Description:**
Sends a custom metrics event with player context and additional data to the analytics system.

**Parameters:**
- `event_id` (string): Identifier for the type of event
- `player` (Entity|string): Player entity or user ID
- `values` (table): Optional additional data to include
- `is_only_local_users_data` (boolean): Whether to restrict to local user data only

**Example:**
```lua
-- Track player death with context
PushMetricsEvent("player_death", ThePlayer, {
    cause = "starving",
    day = TheWorld.state.cycles,
    location = TheWorld.Map:GetTileAtPoint(ThePlayer.Transform:GetWorldPosition())
})

-- Track world generation completion
PushMetricsEvent("world_generated", TheNet:GetUserID(), {
    world_size = "default",
    generation_time = 45.2
})
```

### BuildContextTable(player) {#buildcontexttable}

**Status:** `stable`

**Description:**
Constructs a standardized context table with player, session, and world information for metrics.

**Parameters:**
- `player` (Entity|string): Player entity or user ID

**Returns:**
- (table): Context table with standardized fields

**Example:**
```lua
local context = BuildContextTable(ThePlayer)
-- Contains: user, build, install_id, session_id, save_id, world_time, etc.
```

## Super User Functions

### SuUsed(item, value) {#suused}

**Status:** `stable`

**Description:**
Records that a super user (debug) command was used and logs the statistic.

**Parameters:**
- `item` (string): Name of the debug command or action
- `value` (any): Associated value or parameter

**Example:**
```lua
-- Called automatically when debug commands are used
SuUsed("god_mode_enabled", true)
SuUsed("items_spawned", "beefalo")
```

### SuUsedAdd(item, value) {#suusedadd}

**Status:** `stable`

**Description:**
Adds to a super user statistic, marking the session as having used debug commands.

**Parameters:**
- `item` (string): Name of the statistic
- `value` (number): Value to add

### SetSuper(value) {#setsuper}

**Status:** `stable`

**Description:**
Explicitly sets the super user flag for the current session.

**Parameters:**
- `value` (boolean): Whether super user mode is active

### WasSuUsed() {#wassuused}

**Status:** `stable`

**Description:**
Checks if any super user commands were used during the current session.

**Returns:**
- (boolean): True if super user commands were used

**Example:**
```lua
if WasSuUsed() then
    -- Disable achievements or mark save as debug
    print("Debug commands used - achievements disabled")
end
```

## Utility Functions

### GetClientMetricsData() {#getclientmetricsdata}

**Status:** `stable`

**Description:**
Retrieves client-side metrics data including play instance and install ID.

**Returns:**
- (table): Client metrics data, or nil if Profile is unavailable

### PrefabListToMetrics(list) {#prefablisttometrics}

**Status:** `stable`

**Description:**
Converts a list of prefab entities into a metrics-friendly format with counts.

**Parameters:**
- `list` (table): Array of entity objects with prefab names

**Returns:**
- (table): Array of {prefab, count} pairs

**Example:**
```lua
local inventory_items = ThePlayer.components.inventory:GetItems()
local metrics = PrefabListToMetrics(inventory_items)
-- Returns: {{prefab="log", count=20}, {prefab="rocks", count=15}, ...}
```

## Session Management

### RecordSessionStartStats() {#recordsessionstartstats}

**Status:** `stable`

**Description:**
Records statistics when a new game session begins, including mod information and startup context.

### RecordGameStartStats() {#recordgamestartstats}

**Status:** `stable`

**Description:**
Records statistics when the game application starts, including platform and permission information.

### ClearProfileStats() {#clearprofilestats}

**Status:** `stable`

**Description:**
Clears all accumulated profile statistics, typically called when starting a new session.

## Configuration

### Statistics Control

The stats system respects several configuration options:

- **STATS_ENABLE**: Master enable/disable flag
- **METRICS_ENABLED**: Base configuration for metrics collection
- **Privacy Settings**: User privacy preferences affect data collection

### Data Privacy

- User IDs are anonymized in production builds
- Local-only data can be flagged to prevent transmission
- Debug builds may include additional user identification

## Integration Points

### Automatic Tracking

The stats system automatically tracks:

- Session start/stop events
- Game launch completion
- Network connection success
- Mod usage during sessions

### Manual Integration

Game systems can integrate by calling:

- `ProfileStatsAdd()` for incremental statistics
- `PushMetricsEvent()` for significant events
- Super user functions when debug features are used

## Best Practices

### Performance Considerations

- Statistics are accumulated in memory and sent in batches
- Avoid excessive granular tracking that could impact performance
- Use timing stats judiciously for critical performance metrics

### Data Organization

- Use hierarchical field names for related statistics
- Group similar events under common categories
- Maintain consistent naming conventions across the codebase

### Privacy Compliance

- Always check `STATS_ENABLE` before collecting data
- Use appropriate privacy flags when sending sensitive data
- Respect user preferences for data collection

## Common Usage Patterns

### Basic Event Tracking
```lua
-- Simple counters
ProfileStatsAdd("trees_chopped")
ProfileStatsAdd("rocks_mined")
ProfileStatsAdd("monsters_killed")
```

### Categorized Statistics
```lua
-- Group related stats
ProfileStatsAddToField("crafting.tools.axe", 1)
ProfileStatsAddToField("crafting.tools.pickaxe", 1)
ProfileStatsAddToField("crafting.food.jerky", 5)
```

### Performance Metrics
```lua
-- Track timing data (usually done internally)
local start_time = GetTime()
-- ... perform operation ...
local duration = GetTime() - start_time
ProfileStatsAddToField("performance.world_gen_time", duration)
```

### Custom Events
```lua
-- Significant gameplay events
PushMetricsEvent("boss_defeated", ThePlayer, {
    boss_type = "deerclops",
    player_level = 25,
    time_to_defeat = 120.5
})
```

## Related Modules

- [Profile](./profile.md): Player profile and persistence system
- [NetVar](./netvars.md): Network variable system for multiplayer stats
- [ModManager](./mods.md): Mod system integration for tracking mod usage
- [Config](./config.md): Configuration system for stats preferences
