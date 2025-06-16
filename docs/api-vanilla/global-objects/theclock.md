---
id: theclock
title: TheClock
sidebar_position: 10
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# TheClock

TheClock is the global object that provides timing and day/night cycle information in Don't Starve Together. It manages the game's time system, including day phases, season transitions, and precise time tracking.

## Basic Usage

```lua
-- Get the current game time (in seconds)
local current_time = TheClock:GetTotalTime()

-- Get the time of the current day (seconds since day began)
local day_time = TheClock:GetTimeOfDay()

-- Get the current day number
local current_day = TheClock:GetNumCycles()

-- Get normalized time of day (0-1 representing progress through day)
local normalized_time = TheClock:GetNormTime()
```

## Day Phase Information

```lua
-- Get the current day phase ("day", "dusk", or "night")
local phase = TheClock:GetPhase()

-- Check if it's currently a specific phase
local is_day = TheClock:IsDay()
local is_dusk = TheClock:IsDusk()
local is_night = TheClock:IsNight()

-- Get the time remaining in the current phase
local time_left = TheClock:GetTimeInPhase()

-- Get the total length of the current phase
local phase_length = TheClock:GetPhaseLength()
```

## Phase Transitions

```lua
-- Get time until next phase
local time_until_next = TheClock:GetTimeUntilPhase("day") -- Can be "day", "dusk", or "night"

-- Get a normalized value (0-1) of progress through current phase
local phase_progress = TheClock:GetNormPhase()

-- Add a callback for phase changes
TheClock:AddPhaseChangeCallback(function(phase)
    print("Phase changed to: " .. phase)
end)

-- Check if the upcoming phase is a specific one
local is_next_night = TheClock:IsNextPhaseName("night")
```

## Time Manipulation

```lua
-- Set the current time of day
TheClock:SetTimeOfDay(time) -- time is in seconds

-- Set the current cycle (day) number
TheClock:SetNumCycles(day_number)

-- Set the length of a particular phase in this world
TheClock:SetDayLength(day_length) -- in seconds
TheClock:SetDuskLength(dusk_length) -- in seconds
TheClock:SetNightLength(night_length) -- in seconds

-- Force an immediate phase change
TheClock:ForcePhase("night")
```

## Moon Phases

```lua
-- Get current moon phase
local moon_phase = TheClock:GetMoonPhase()
-- 0: New Moon
-- 1: Quarter Moon (waxing)
-- 2: Half Moon (waxing)
-- 3: Three Quarter Moon (waxing)
-- 4: Full Moon
-- 5: Three Quarter Moon (waning)
-- 6: Half Moon (waning)
-- 7: Quarter Moon (waning)

-- Check if tonight is a full moon
local is_full_moon = TheClock:GetMoonPhase() == 4

-- Check if the moon will be visible tonight
local moon_visible = TheClock:IsMoonVisible()
```

## Season Integration

```lua
-- Get remaining time in the current season
local time_left = TheClock:GetSeasonLength()

-- Get elapsed time in the current season
local time_elapsed = TheClock:GetSeasonElapsed()

-- Get a normalized value (0-1) of progress through the current season
local season_progress = TheClock:GetNormSeason()
```

## Real-Time Conversion

```lua
-- Convert real seconds to game time
local game_time = TheClock:ToGameTime(real_seconds)

-- Convert game time to real seconds
local real_time = TheClock:ToRealTime(game_time)

-- Get the ratio of game time to real time
local time_ratio = TheClock:GetTimeScale()
```

## Important Considerations

1. **Server Authority**: On multiplayer games, the server has authority over time - client-side changes may not persist
2. **Performance Impact**: Frequent time queries in tight loops can impact performance
3. **Time Scale**: Game time passes much faster than real time (typically about 20x faster)
4. **Event Synchronization**: Important time-based events should be synchronized with TheClock phases
5. **Persistence**: Time settings persist with the world save file

## Integration with Other Global Objects

TheClock often works with other global objects:

- **[TheWorld](/docs/api-vanilla/global-objects/theworld)**: For world state that depends on time
- **[TheShard](/docs/api-vanilla/global-objects/theshard)**: For synchronizing time across server shards
- **[TheNet](/docs/api-vanilla/global-objects/thenet)**: For network time synchronization

## Common Use Cases

- **Day/Night Mechanics**: Creating mechanics that depend on the time of day
- **Scheduled Events**: Triggering events at specific times or phases
- **Time-Based Resources**: Controlling resource spawns based on day/night
- **Moon Phase Effects**: Creating effects that depend on the lunar cycle
- **Time-Sensitive Creatures**: Managing creature behavior based on day/night 
