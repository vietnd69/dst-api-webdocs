---
id: globalvariableoverrides-pax-server
title: Global Variable Overrides (PAX Server)
description: Server configuration for PAX event environments with timed shutdown
sidebar_position: 8
slug: core-systems-globalvariableoverrides-pax-server
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Global Variable Overrides (PAX Server)

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `globalvariableoverrides_pax_server.lua` file provides specialized configuration for PAX (Penny Arcade Expo) event servers. It includes automatic server termination and mod warning suppression for public demonstration environments.

## Configuration Variables

### DISABLE_MOD_WARNING

**Value:** `true`

**Status:** `stable`

**Description:** Disables mod-related warning messages to provide a cleaner experience for PAX attendees and demonstrators.

**Purpose:**
- Reduces console noise during public demonstrations
- Prevents mod warnings from interfering with gameplay showcases
- Creates a professional presentation environment
- Eliminates technical distractions for event attendees

### SERVER_TERMINATION_TIMER

**Value:** `60*60*2` (7200 seconds / 2 hours)

**Status:** `stable`

**Description:** Sets an automatic server shutdown timer to 2 hours. This ensures PAX demo servers don't run indefinitely and allows for regular resets during events.

**Calculation:**
- `60` seconds per minute
- `60` minutes per hour  
- `2` hours total
- **Result:** 7200 seconds (2 hours)

**Purpose:**
- Prevents servers from running indefinitely at events
- Allows for regular server resets and maintenance
- Manages resource usage during busy convention periods
- Ensures fresh server instances for each demo session

## Usage Example

```lua
-- Content of globalvariableoverrides_pax_server.lua
DISABLE_MOD_WARNING = true
SERVER_TERMINATION_TIMER = 60*60*2 -- 60 sec in min, 60 min in hour, 2 hr timer
```

## Implementation Details

### PAX Event Environment
This configuration creates an environment optimized for:

#### Public Demonstrations
- **Clean Experience**: No technical warnings visible to attendees
- **Timed Sessions**: Automatic restart every 2 hours
- **Resource Management**: Prevents resource exhaustion during events
- **Professional Presentation**: Clean, polished demo environment

#### Event Management
```lua
-- Timer calculation breakdown
local seconds_per_minute = 60
local minutes_per_hour = 60
local hours_per_session = 2

SERVER_TERMINATION_TIMER = seconds_per_minute * minutes_per_hour * hours_per_session
-- Result: 7200 seconds (2 hours)
```

### Server Lifecycle

| Phase | Duration | Purpose |
|-------|----------|---------|
| Startup | 0 minutes | Server initialization |
| Demo Session | 0-120 minutes | Active gameplay demonstrations |
| Shutdown Warning | 115-120 minutes | Notification of impending restart |
| Automatic Termination | 120 minutes | Server shuts down automatically |
| Reset Cycle | 120+ minutes | New server instance starts |

## Use Cases

### Event Applications

1. **Convention Demos**: PAX gaming convention demonstrations
2. **Trade Shows**: Professional gaming showcases
3. **Public Events**: Community demonstration servers
4. **Time-Limited Testing**: Controlled duration testing sessions

### Demo Session Management

#### Convention Floor Setup
```lua
-- Ideal for:
-- - High-traffic demo stations
-- - Multiple demo sessions per day
-- - Resource-constrained environments
-- - Public-facing demonstrations
```

#### Presentation Environment
```lua
-- Benefits:
-- - Clean user experience
-- - Predictable session timing
-- - Automatic maintenance cycles
-- - Professional appearance
```

## Configuration Management

### When to Use PAX Server Overrides

1. **Public Events**: Gaming conventions and trade shows
2. **Demo Stations**: Public-facing gameplay demonstrations
3. **Time-Limited Sessions**: Environments requiring automatic resets
4. **Resource Management**: Preventing long-running server issues

### Event Setup

#### Pre-Event Configuration
```bash
# Deploy PAX server configuration
cp globalvariableoverrides_pax_server.lua globalvariableoverrides.lua

# Verify timer setting
grep "SERVER_TERMINATION_TIMER" globalvariableoverrides.lua

# Confirm warning suppression
grep "DISABLE_MOD_WARNING" globalvariableoverrides.lua
```

#### Event Monitoring
- **Session Tracking**: Monitor 2-hour cycles
- **Restart Verification**: Confirm clean server restarts
- **Performance Monitoring**: Track resource usage patterns
- **User Experience**: Ensure smooth demo transitions

## Timer Configuration

### Time Calculation Details

```lua
-- Timer breakdown for different durations
local function calculate_timer(hours)
    local seconds_per_minute = 60
    local minutes_per_hour = 60
    return seconds_per_minute * minutes_per_hour * hours
end

-- Current PAX setting: 2 hours
SERVER_TERMINATION_TIMER = calculate_timer(2) -- 7200 seconds

-- Alternative configurations:
-- 1 hour demo: calculate_timer(1) -- 3600 seconds
-- 3 hour demo: calculate_timer(3) -- 10800 seconds
-- 30 minute demo: calculate_timer(0.5) -- 1800 seconds
```

### Customization Options

| Duration | Timer Value | Use Case |
|----------|-------------|----------|
| 30 minutes | `60*30` | Quick demos |
| 1 hour | `60*60` | Standard sessions |
| 2 hours | `60*60*2` | PAX standard |
| 3 hours | `60*60*3` | Extended demos |
| 4 hours | `60*60*4` | Full event blocks |

## Best Practices

### Event Management

1. **Pre-Event Testing**: Test configuration before public events
2. **Backup Planning**: Have fallback configurations ready
3. **Monitor Sessions**: Track server performance during events
4. **User Communication**: Inform users about session time limits
5. **Clean Transitions**: Ensure smooth restarts between sessions

### Warning Suppression Impact

#### Suppressed Elements
With `DISABLE_MOD_WARNING = true`:
- Mod loading notifications hidden from attendees
- Technical warnings removed from public view
- Development messages suppressed
- Clean, professional presentation maintained

#### Monitoring Considerations
- **Backend Logging**: Ensure warnings are still logged for troubleshooting
- **Technical Staff**: Provide separate monitoring tools for event staff
- **Issue Detection**: Maintain ability to identify problems during events
- **Post-Event Analysis**: Review suppressed warnings for improvements

## Related Configuration Files

- [Base Overrides](./globalvariableoverrides.md): Standard configuration template
- [Clean Overrides](./globalvariableoverrides_clean.md): Minimal override configuration
- [Monkey Overrides](./globalvariableoverrides_monkey.md): Mod development configuration

## Integration with Event Systems

### Server Management
```lua
-- How PAX overrides integrate with server systems
if SERVER_TERMINATION_TIMER then
    -- Automatic shutdown scheduling enabled
    -- Resource cleanup after timer expiration
    -- Predictable restart cycles
end

if DISABLE_MOD_WARNING then
    -- Clean presentation mode active
    -- Technical messages suppressed
    -- Professional demo environment
end
```

### Event Infrastructure
- **Load Balancers**: Work with timed server restarts
- **Monitoring Systems**: Track 2-hour server cycles
- **User Management**: Handle session transitions gracefully
- **Resource Allocation**: Plan for predictable restart patterns
