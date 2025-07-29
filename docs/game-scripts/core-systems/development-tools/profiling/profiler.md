---
id: profiler
title: Profiler
description: Lua code performance profiling system for debugging and optimization analysis
sidebar_position: 1

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Profiler

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `profiler.lua` module provides comprehensive Lua code performance profiling capabilities for Don't Starve Together. Based on the Pepperfish profiler, it enables developers to analyze function execution times, call counts, and performance bottlenecks in Lua scripts. The profiler supports both time-based and call-based profiling methods with detailed reporting functionality.

## Module Structure

The profiler system is built around a global `_profiler` table that contains the core profiling functionality and state management:

```lua
_profiler = {
    -- Core profiling methods
    start = function(self),
    stop = function(self),
    report = function(self, sort_by_total_time),
    prevent = function(self, func, level),
    
    -- Internal state
    running = nil, -- Currently active profiler instance
    prevented_functions = {}, -- Functions excluded from profiling
}
```

## Core Functions

### newProfiler(variant, sampledelay) {#new-profiler}

**Status:** `stable`

**Description:**
Creates a new profiler instance with specified profiling method and sampling configuration.

**Parameters:**
- `variant` (string, optional): Profiling method - "time" (default) or "call"
- `sampledelay` (number, optional): Sample delay for time-based profiling (default: 100000)

**Returns:**
- (table): New profiler instance with profiling methods

**Example:**
```lua
-- Create time-based profiler (recommended)
local profiler = newProfiler("time", 100000)

-- Create call-based profiler
local call_profiler = newProfiler("call")

-- Use default settings
local default_profiler = newProfiler()
```

**Profiling Methods:**
- **"time"**: Real performance-based profiling (recommended)
- **"call"**: Function call-based profiling

### profiler:start() {#profiler-start}

**Status:** `stable`

**Description:**
Starts the profiling session. Only one profiler can be active at a time. Initializes internal state and sets up debug hooks for data collection.

**Parameters:**
- None

**Returns:**
- (void): No return value

**Example:**
```lua
local profiler = newProfiler()
profiler:start()

-- Code to be profiled goes here
some_expensive_function()

profiler:stop()
```

**Internal Operations:**
1. Sets `_profiler.running` to current instance
2. Initializes `rawstats` and `callstack` tables
3. Sets up appropriate debug hook based on profiling variant

### profiler:stop() {#profiler-stop}

**Status:** `stable`

**Description:**
Stops the profiling session and removes debug hooks. Only affects the currently running profiler instance.

**Parameters:**
- None

**Returns:**
- (void): No return value

**Example:**
```lua
profiler:start()
-- Profiled code execution
profiler:stop()

-- Generate and save report
local report = profiler:report()
print(report)
```

### profiler:report(sort_by_total_time) {#profiler-report}

**Status:** `stable`

**Description:**
Generates a comprehensive profiling report with function statistics, timing information, and call hierarchies.

**Parameters:**
- `sort_by_total_time` (boolean, optional): If true, sorts by total time; if false/nil, sorts by self time

**Returns:**
- (string): Formatted profiling report

**Report Contents:**
- Function call/sample counts
- Total time spent in functions
- Time spent in children vs. self
- Per-call/sample timing averages
- Child function call statistics

**Example:**
```lua
-- Basic report sorted by self time
local report = profiler:report()

-- Report sorted by total time
local total_time_report = profiler:report(true)

-- Save to file
local file = io.open("profile_report.txt", "w")
file:write(profiler:report())
file:close()
```

### profiler:prevent(func, level) {#profiler-prevent}

**Status:** `stable`

**Description:**
Excludes specified functions from profiling to reduce overhead or focus analysis on specific code areas.

**Parameters:**
- `func` (function): Function reference to exclude from profiling
- `level` (number, optional): Prevention level (1 = exclude function, 2 = exclude function and children)

**Returns:**
- (void): No return value

**Example:**
```lua
local profiler = newProfiler()

-- Exclude expensive logging function
profiler:prevent(debug_log_function, 1)

-- Exclude entire subsystem
profiler:prevent(render_system_main, 2)

profiler:start()
-- Profiling with exclusions
profiler:stop()
```

**Prevention Levels:**
- **Level 1**: Excludes only the specified function
- **Level 2**: Excludes function and all its children (call-based profiling)

## Profiling Methods

### Time-Based Profiling

**Recommended Method:** Provides accurate real-performance measurements.

**Characteristics:**
- Samples based on actual execution time
- Default sample delay: 100,000 opcodes (~2ms intervals)
- Approximately 10% performance overhead
- More accurate for performance optimization

**Configuration:**
```lua
local profiler = newProfiler("time", 50000) -- Higher frequency sampling
profiler:start()
```

**Accuracy Notes:**
- Lower sample delays increase accuracy but reduce performance
- Higher sample delays reduce overhead but may miss short functions
- Default settings provide good balance for most use cases

### Call-Based Profiling

**Alternative Method:** Tracks function calls and returns.

**Characteristics:**
- Profiles every function call and return
- Provides exact call counts
- May heavily bias towards call-heavy code
- Comparable to traditional profilers (gprof)

**Configuration:**
```lua
local profiler = newProfiler("call")
profiler:start()
```

**Bias Considerations:**
- Can show significant bias towards areas with many function calls
- May report inaccurate timing for call-heavy vs. computation-heavy code
- Useful for call count analysis and function coverage

## Internal Architecture

### State Management

```lua
_profiler = {
    running = nil, -- Currently active profiler instance
    prevented_functions = {
        -- Internal profiler functions automatically excluded
        [_profiler.start] = 2,
        [_profiler.stop] = 2,
        [_profiler._internal_profile_by_time] = 2,
        [_profiler._internal_profile_by_call] = 2,
        -- Additional internal functions...
    }
}
```

### Data Collection

#### Time-Based Collection

```lua
function _profiler._internal_profile_by_time(self, action)
    local timetaken = os.clock() - self.lastclock
    
    -- Walk call stack and attribute time to each function
    local depth = 3
    local caller = debug.getinfo(depth)
    while caller do
        -- Update function statistics
        local info = self:_get_func_rec(caller.func, 1, caller)
        info.count = info.count + 1
        info.time = info.time + timetaken
        -- Handle parent-child relationships
        depth = depth + 1
        caller = debug.getinfo(depth)
    end
    
    self.lastclock = os.clock()
end
```

#### Call-Based Collection

```lua
function _profiler._internal_profile_by_call(self, action)
    local caller_info = debug.getinfo(3)
    
    if action == "call" then
        -- Track function entry
        local this_ar = {
            clock_start = os.clock(),
            children = {},
            children_time = {}
        }
        table.insert(self.callstack, this_ar)
    else
        -- Track function exit and calculate timing
        local this_ar = self.callstack[#self.callstack]
        this_ar.this_time = os.clock() - this_ar.clock_start
        -- Update statistics and parent information
        table.remove(self.callstack)
    end
end
```

### Function Record Structure

```lua
local function_record = {
    func = function_reference,
    count = 0, -- Number of calls/samples
    time = 0, -- Total time spent
    anon_child_time = 0, -- Time in anonymous children
    name_child_time = 0, -- Time in named children
    children = {}, -- Child function call counts
    children_time = {}, -- Time spent in each child
    func_info = debug_info -- Function metadata
}
```

## Report Format

### Standard Report Structure

```
---------------------------------------- function_name ----------------------------------------
Sample count:         1234
Time spend total:     123.456ms
Time spent in children: 98.765ms
Time spent in self:   24.691ms
Time spent per sample: 0.10000ms/sample
Time spent in self per sample: 0.02000ms/sample

Child child_function_name               called   567 times. Took 45.67ms
Child another_child                     called   890 times. Took 23.45ms

---------------------------------------- next_function ----------------------------------------
...

Total time spent in profiled functions: 1234.567ms
```

### Report Sections

1. **Function Header**: Function name with decorative separators
2. **Count Statistics**: Number of samples/calls
3. **Time Statistics**: Total, children, self, and per-call timings
4. **Child Statistics**: Time and call counts for child functions
5. **Summary**: Total profiled time

## Usage Patterns

### Basic Profiling Session

```lua
-- Create and configure profiler
local profiler = newProfiler("time", 100000)

-- Start profiling
profiler:start()

-- Execute code to be profiled
game_update_loop()
render_frame()
process_ai()

-- Stop profiling
profiler:stop()

-- Generate and save report
local report = profiler:report()
local file = io.open("performance_profile.txt", "w")
file:write(report)
file:close()
```

### Focused Profiling

```lua
local profiler = newProfiler("time")

-- Exclude logging and debug functions
profiler:prevent(log_debug, 1)
profiler:prevent(log_info, 1)
profiler:prevent(assert_check, 2)

-- Profile only critical game systems
profiler:start()
update_world_simulation()
update_character_ai()
process_combat_systems()
profiler:stop()

local focused_report = profiler:report()
```

### Comparative Analysis

```lua
-- Profile different algorithms
local algorithms = {
    algorithm_a = function() --[[ implementation ]] end,
    algorithm_b = function() --[[ implementation ]] end,
    algorithm_c = function() --[[ implementation ]] end
}

for name, algorithm in pairs(algorithms) do
    local profiler = newProfiler("time")
    profiler:start()
    
    -- Run algorithm multiple times for statistical accuracy
    for i = 1, 1000 do
        algorithm()
    end
    
    profiler:stop()
    
    local report = profiler:report()
    local file = io.open("profile_" .. name .. ".txt", "w")
    file:write(report)
    file:close()
end
```

## Performance Considerations

### Profiling Overhead

| Method | Sample Delay | Overhead | Accuracy |
|--------|--------------|----------|----------|
| Time | 100,000 | ~10% | Good |
| Time | 50,000 | ~15% | Better |
| Time | 200,000 | ~5% | Lower |
| Call | N/A | Variable | Call counts accurate |

### Optimization Guidelines

1. **Use time-based profiling** for performance optimization
2. **Adjust sample delay** based on accuracy vs. performance needs
3. **Exclude frequently called utility functions** to reduce noise
4. **Profile representative workloads** for meaningful results
5. **Run multiple profiling sessions** to account for variance

## Error Handling

### Common Issues

```lua
-- Attempt to start when profiler already running
local profiler1 = newProfiler()
local profiler2 = newProfiler()

profiler1:start()
profiler2:start() -- This will silently fail

-- Check for running profiler
if not _profiler.running then
    profiler:start()
end
```

### Validation

```lua
-- Validate profiler method
local profiler = newProfiler("invalid_method") -- Returns nil with error message

-- Safe profiler creation
local function create_safe_profiler(method)
    local profiler = newProfiler(method)
    if not profiler then
        print("Failed to create profiler with method:", method)
        return newProfiler("time") -- Fallback to default
    end
    return profiler
end
```

## Integration with DST

### Game Loop Profiling

```lua
-- Profile main game update cycle
local game_profiler = newProfiler("time")

function profile_frame()
    game_profiler:start()
    -- Game frame execution
    game_profiler:stop()
    
    -- Periodic reporting
    if frame_count % 3600 == 0 then -- Every minute at 60 FPS
        local report = game_profiler:report()
        save_profile_report(report)
        game_profiler = newProfiler("time") -- Reset for next period
    end
end
```

### Mod Development

```lua
-- Profile mod initialization
local mod_profiler = newProfiler("call")
mod_profiler:start()

-- Load mod components
load_mod_assets()
register_mod_prefabs()
setup_mod_systems()

mod_profiler:stop()
local mod_report = mod_profiler:report()
print("Mod loading profile:", mod_report)
```

## Related Modules

- [`debugtools`](./debugtools.md): Development and debugging utilities
- [`debughelpers`](./debughelpers.md): Helper functions for debugging
- [`main`](./main.md): Main game loop integration points
- [`perfutil`](./perfutil.md): Performance utility functions

## Notes

- Only one profiler can be active at a time globally
- The profiler automatically excludes its own internal functions from measurement
- Time-based profiling is recommended for most performance analysis needs
- Call-based profiling is useful for understanding function call patterns
- Reports can be saved to files for detailed analysis
- Sample delay affects both accuracy and performance overhead
- The profiler uses `debug.sethook()` and may interfere with other debugging tools
- Profiling results should be validated across multiple runs for statistical significance
