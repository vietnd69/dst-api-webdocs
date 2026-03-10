---
id: profiler
title: Profiler
description: Provides a Lua-level CPU profiler for performance analysis of game code.
tags: [profiling, performance, debugging]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a7ed1e5f
system_scope: debug
---

# Profiler

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `profiler` component is a standalone Lua profiler implementation used for analyzing runtime performance of game scripts. It instruments code execution using `debug.sethook` to collect timing data either per opcode sample interval (`time` mode) or per function call (`call` mode). It maintains call stack information, function call counts, and timing statistics, then generates human-readable and machine-parseable reports.

The profiler is not attached to entities via the ECS; instead, it operates globally via the `_profiler` table and the `newProfiler()` constructor. It is intended for developer use during optimization and debugging rather than at runtime in shipped gameplay.

## Usage example
```lua
local profiler = newProfiler("time", 100000)
profiler:start()

-- Run game code to profile here

profiler:stop()
local report = profiler:report(false)
print(report)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variant` | string | `"time"` | Profiling mode: `"time"` (sample-based) or `"call"` (call-trace). |
| `sampledelay` | number | `100000` | Opcode count between samples in `"time"` mode. Smaller = higher accuracy, higher overhead. |
| `rawstats` | table | `{}` | Internal storage of per-function profiling statistics. |
| `callstack` | table | `{}` | Current call stack trace during profiling. |
| `prevented_functions` | table | See source | Functions exempted from profiling (set at compile time). |
| `lastclock` | number | `nil` | Timestamp of last sample in `"time"` mode. |

## Main functions
### `newProfiler(variant, sampledelay)`
* **Description:** Creates and returns a new profiler instance. Only one profiler can be active at a time.
* **Parameters:**  
  `variant` (string) — profiling method: `"time"` (default) or `"call"`.  
  `sampledelay` (number) — opcode count per sample; ignored in `"call"` mode.
* **Returns:** Profiler object, or `nil` if invalid variant or a profiler is already running.

### `profiler:start()`
* **Description:** Starts profiling hooks and initializes internal state. Does nothing if a profiler is already running.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `_profiler.running` is already set.

### `profiler:stop()`
* **Description:** Stops profiling and cleans up hooks. Does nothing if the caller is not the active profiler.
* **Parameters:** None.
* **Returns:** Nothing.

### `profiler:report(sort_by_total_time)`
* **Description:** Generates a formatted performance report string.
* **Parameters:**  
  `sort_by_total_time` (boolean) — if `true`, sorts functions by total time; otherwise sorts by self-time (total minus child time).
* **Returns:** string — human-readable profiling report.

### `profiler:lua_report()`
* **Description:** Generates a Lua source file containing raw profiling data (for programmatic analysis).
* **Parameters:** None.
* **Returns:** string — loadable Lua table data with function names, timings, and call relationships.

### `profiler:prevent(func, level)`
* **Description:** Exempts a function from profiling. Level `1` prevents only the function itself; level `2` also excludes its children.
* **Parameters:**  
  `func` (function reference) — function to exclude.  
  `level` (number) — exclusion level: `1` or `2` (default `1`).
* **Returns:** Nothing.

## Events & listeners
None identified — this component is event-agnostic and operates purely via direct function calls and Lua debugging hooks.