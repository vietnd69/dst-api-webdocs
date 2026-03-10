---
id: scheduler
title: Scheduler
description: Manages coroutine-based task scheduling and periodic execution for game logic, supporting both dynamic and static timelines.
tags: [scheduler, coroutine, timing, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 5f343cf2
system_scope: world
---

# Scheduler

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Scheduler` is a core utility that manages coroutine-based asynchronous tasks and periodic callbacks within the game world. It supports two independent timelines: dynamic (`scheduler`) for real-time operations and static (`staticScheduler`) for time-synchronized logic (e.g., world generation, deterministic simulation). The component handles task yielding, sleeping, hibernating, and periodic execution via coroutine resumption and tick-based scheduling. It integrates closely with `TheSim`'s global profiler and `GetTick`/`GetStaticTick` systems.

## Usage example
```lua
-- Start a new asynchronous task
StartThread(function(param)
    Sleep(2) -- wait 2 seconds
    print("Task resumed after sleep:", param)
end, "my_task", "hello")

-- Schedule a periodic callback
local periodic = staticScheduler:ExecutePeriodic(
    5, -- period: run every 5 seconds
    function()
        print("Static periodic callback")
    end,
    3, -- limit: run 3 times
    0, -- initial delay
    "static_timer"
)

-- Cancel the periodic early if needed
periodic:Cancel()
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tasks` | table | `{}` | Maps coroutine references to `Task` objects. |
| `running` | table | `{}` | Set of currently active tasks. |
| `waitingfortick` | table | `{}` | Maps absolute tick values to lists of sleeping tasks. |
| `waking` | table | `{}` | Temporary set of tasks waking up at the current tick. |
| `hibernating` | table | `{}` | Set of tasks in hibernation state. |
| `attime` | table | `{}` | Maps absolute tick values to lists of time-based callbacks (`Periodic` objects). |
| `isstatic` | boolean | `false` | Whether this scheduler uses the static timeline. |

## Main functions
### `AddTask(fn, id, param)`
*   **Description:** Creates and registers a new coroutine-based task. The function is started as a coroutine and can yield via `Sleep`, `Hibernate`, or `Yield`.
*   **Parameters:**  
    - `fn` (function) — The coroutine function to execute.  
    - `id` (string or number, optional) — A user-defined identifier for the task.  
    - `param` (any, optional) — A parameter passed to `fn` on first resume.
*   **Returns:** `Task` — A reference to the created task object.
*   **Error states:** Prints an error and returns early if `task.co` is `nil`.

### `ExecuteInTime(timefromnow, fn, id, ...)`
*   **Description:** Schedules a one-time callback to run at a specified future time.
*   **Parameters:**  
    - `timefromnow` (number) — Delay in seconds before the callback runs.  
    - `fn` (function) — The callback function to execute.  
    - `id` (string or number, optional) — A user-defined identifier for the callback.  
    - `...` — Additional arguments passed to `fn`.
*   **Returns:** `Periodic` — A cancelable reference to the scheduled callback.

### `ExecutePeriodic(period, fn, limit, initialdelay, id, ...)`
*   **Description:** Schedules a repeating callback with a fixed period and optional execution limit.
*   **Parameters:**  
    - `period` (number) — Time interval in seconds between executions.  
    - `fn` (function) — The callback function to execute.  
    - `limit` (number, optional) — Maximum number of executions. `nil` means infinite.  
    - `initialdelay` (number, optional) — Delay before the first execution. Defaults to `period`.  
    - `id` (string or number, optional) — A user-defined identifier for the callback.  
    - `...` — Additional arguments passed to `fn`.
*   **Returns:** `Periodic` — A cancelable reference to the scheduled callback.

### `OnTick(tick)`
*   **Description:** Processes scheduled tasks and callbacks due at the given tick. Must be called once per tick.
*   **Parameters:** `tick` (number) — The current game tick.
*   **Returns:** Nothing.

### `Run()`
*   **Description:** Resumes all running and waking tasks. Handles coroutine states (`dead`, `suspended`) and task transitions (sleeping, hibernating, running).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `KillTask(task)`
*   **Description:** Terminates and removes a specific task from scheduling.
*   **Parameters:** `task` (`Task` or `Periodic`) — The task reference to kill.
*   **Returns:** Nothing.

### `KillTasksWithID(id)`
*   **Description:** Finds and terminates all tasks and periodic callbacks matching the given ID across all queues.
*   **Parameters:** `id` (string or number) — The identifier to match.
*   **Returns:** Nothing.

### `GetCurrentTask()`
*   **Description:** Retrieves the currently running task within the calling coroutine.
*   **Parameters:** None.
*   **Returns:** `Task` or `nil` — The active task associated with the coroutine, or `nil` if none.

### `GetListForTimeFromNow(dt)`
*   **Description:** Calculates the absolute tick for `dt` seconds in the future and returns the corresponding callback list.
*   **Parameters:** `dt` (number) — Time offset in seconds.
*   **Returns:** `table, number` — The callback list for the computed tick and the absolute tick value.

## Events & listeners
- **Listens to:** None (no direct event listeners; scheduling is tick-driven via `OnTick` and `Run`).
- **Pushes:** None (no direct event firing; interaction is via coroutine yielding and return values).