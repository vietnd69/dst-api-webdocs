---
id: scheduler
title: Scheduler
description: Thread and task scheduling system for coroutine-based execution control
sidebar_position: 1
slug: gams-scripts/core-systems/scheduler
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Scheduler

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `scheduler` module provides a comprehensive coroutine-based task scheduling system for Don't Starve Together. It manages thread execution, task timing, and periodic operations through two main schedulers: a regular scheduler for game-time operations and a static scheduler for real-time operations.

## Usage Example

```lua
-- Start a simple thread
local task = StartThread(function()
    print("Thread started")
    Sleep(5) -- Sleep for 5 seconds
    print("Thread resumed after 5 seconds")
end, "example_thread")

-- Execute a function after delay
scheduler:ExecuteInTime(2.0, function()
    print("Executed after 2 seconds")
end, "delayed_execution")

-- Execute periodic function
local periodic = scheduler:ExecutePeriodic(1.0, function()
    print("Executed every second")
end, 5, nil, "periodic_task") -- Run 5 times
```

## Global Functions

### StartThread(fn, id, param) {#start-thread}

**Status:** `stable`

**Description:**
Creates and starts a new thread in the main scheduler.

**Parameters:**
- `fn` (function): The function to execute in the thread
- `id` (string): Optional identifier for the thread
- `param` (any): Optional parameter passed to the function

**Returns:**
- (Task): The created task object

**Example:**
```lua
local task = StartThread(function(param)
    print("Thread parameter:", param)
    Sleep(1)
    print("Thread completed")
end, "my_thread", "hello")
```

### StartStaticThread(fn, id, param) {#start-static-thread}

**Status:** `stable`

**Description:**
Creates and starts a new thread in the static scheduler (real-time based).

**Parameters:**
- `fn` (function): The function to execute in the thread
- `id` (string): Optional identifier for the thread
- `param` (any): Optional parameter passed to the function

**Returns:**
- (Task): The created task object

**Example:**
```lua
local static_task = StartStaticThread(function()
    print("Static thread running")
    Sleep(2)
    print("Static thread finished")
end, "static_thread")
```

### Sleep(time) {#sleep}

**Status:** `stable`

**Description:**
Suspends the current thread for the specified time duration.

**Parameters:**
- `time` (number): Time to sleep in seconds

**Example:**
```lua
StartThread(function()
    print("Before sleep")
    Sleep(3.5) -- Sleep for 3.5 seconds
    print("After sleep")
end, "sleep_example")
```

### Hibernate() {#hibernate}

**Status:** `stable`

**Description:**
Puts the current thread into hibernation state until explicitly woken.

**Example:**
```lua
local hibernating_task = StartThread(function()
    print("Going to hibernate")
    Hibernate()
    print("Woken from hibernation")
end, "hibernate_example")

-- Wake the task later
WakeTask(hibernating_task)
```

### Wake() {#wake}

**Status:** `stable`

**Description:**
Wakes the current hibernating thread and moves it to running state.

**Example:**
```lua
StartThread(function()
    Hibernate()
    Wake() -- Wake self
    print("Self-woken thread")
end, "self_wake")
```

### WakeTask(task) {#wake-task}

**Status:** `stable`

**Description:**
Wakes a specific hibernating task.

**Parameters:**
- `task` (Task): The task to wake up

**Example:**
```lua
local sleeping_task = StartThread(function()
    print("Going to hibernate")
    Hibernate()
    print("I've been woken up!")
end, "sleeping_task")

-- Wake it after 2 seconds
scheduler:ExecuteInTime(2.0, function()
    WakeTask(sleeping_task)
end, "wake_caller")
```

### KillThread(task) {#kill-thread}

**Status:** `stable`

**Description:**
Forcibly terminates a running task.

**Parameters:**
- `task` (Task): The task to terminate

**Example:**
```lua
local long_task = StartThread(function()
    while true do
        print("Running...")
        Sleep(1)
    end
end, "long_running")

-- Kill it after 5 seconds
scheduler:ExecuteInTime(5.0, function()
    KillThread(long_task)
    print("Long task terminated")
end, "killer")
```

### KillThreadsWithID(id) {#kill-threads-with-id}

**Status:** `stable`

**Description:**
Terminates all threads with the specified ID.

**Parameters:**
- `id` (string): The ID of threads to terminate

**Example:**
```lua
-- Start multiple threads with same ID
for i = 1, 3 do
    StartThread(function()
        while true do
            print("Worker", i)
            Sleep(1)
        end
    end, "worker_threads")
end

-- Kill all worker threads
KillThreadsWithID("worker_threads")
```

### Yield() {#yield}

**Status:** `stable`

**Description:**
Yields execution to allow other threads to run, resuming on the next tick.

**Example:**
```lua
StartThread(function()
    for i = 1, 5 do
        print("Iteration", i)
        Yield() -- Let other threads run
    end
end, "yielding_thread")
```

## Global Objects

### scheduler {#scheduler-global}

**Type:** `Scheduler`

**Status:** `stable`

**Description:** The main game-time scheduler instance.

### staticScheduler {#static-scheduler-global}

**Type:** `Scheduler`

**Status:** `stable`

**Description:** The static real-time scheduler instance.

## Classes

### Task {#task-class}

**Status:** `stable`

**Description:**
Represents a single threaded task with coroutine execution.

#### Properties
- `guid` (number): Unique identifier for the task
- `id` (string): User-defined task identifier
- `fn` (function): The function being executed
- `co` (coroutine): The coroutine object
- `param` (any): Parameter passed to the function
- `list` (table): Current list containing this task

#### Methods

##### task:SetList(list) {#task-set-list}

**Description:**
Moves the task to a different execution list.

**Parameters:**
- `list` (table): The target list or nil to remove from current list

### Periodic {#periodic-class}

**Status:** `stable`

**Description:**
Represents a periodic task that executes at regular intervals.

#### Properties
- `fn` (function): Function to execute periodically
- `period` (number): Time interval between executions
- `limit` (number): Maximum number of executions (nil for infinite)
- `nexttick` (number): Next tick when the function will execute
- `onfinish` (function): Callback when periodic task completes

#### Methods

##### periodic:Cancel() {#periodic-cancel}

**Description:**
Cancels the periodic task and removes it from scheduling.

**Example:**
```lua
local periodic = scheduler:ExecutePeriodic(1.0, function()
    print("Periodic task")
end, nil, nil, "cancelable_task")

-- Cancel after 5 seconds
scheduler:ExecuteInTime(5.0, function()
    periodic:Cancel()
    print("Periodic task cancelled")
end, "canceller")
```

##### periodic:NextTime() {#periodic-next-time}

**Description:**
Returns the game time when this periodic task will next execute.

**Returns:**
- (number): Next execution time in game seconds

### Scheduler {#scheduler-class}

**Status:** `stable`

**Description:**
The main scheduler class that manages task execution and timing.

#### Methods

##### scheduler:AddTask(fn, id, param) {#scheduler-add-task}

**Description:**
Creates and adds a new task to the scheduler.

**Parameters:**
- `fn` (function): Function to execute
- `id` (string): Task identifier
- `param` (any): Parameter for the function

**Returns:**
- (Task): The created task

##### scheduler:ExecuteInTime(timefromnow, fn, id, ...) {#scheduler-execute-in-time}

**Description:**
Executes a function once after the specified delay.

**Parameters:**
- `timefromnow` (number): Delay in seconds
- `fn` (function): Function to execute
- `id` (string): Optional identifier
- `...`: Additional arguments for the function

**Returns:**
- (Periodic): Periodic object representing the scheduled execution

**Example:**
```lua
scheduler:ExecuteInTime(3.0, function(message)
    print("Delayed message:", message)
end, "delayed_print", "Hello World!")
```

##### scheduler:ExecutePeriodic(period, fn, limit, initialdelay, id, ...) {#scheduler-execute-periodic}

**Description:**
Executes a function periodically at specified intervals.

**Parameters:**
- `period` (number): Time between executions in seconds
- `fn` (function): Function to execute
- `limit` (number): Maximum executions (nil for infinite)
- `initialdelay` (number): Delay before first execution (defaults to period)
- `id` (string): Optional identifier
- `...`: Additional arguments for the function

**Returns:**
- (Periodic): Periodic object for controlling the execution

**Example:**
```lua
local counter = 0
local periodic = scheduler:ExecutePeriodic(1.0, function()
    counter = counter + 1
    print("Count:", counter)
end, 10, 0.5, "counter_task") -- Run 10 times, start after 0.5 seconds
```

##### scheduler:KillTasksWithID(id) {#scheduler-kill-tasks-with-id}

**Description:**
Terminates all tasks with the specified identifier.

**Parameters:**
- `id` (string): The identifier of tasks to kill

##### scheduler:GetCurrentTask() {#scheduler-get-current-task}

**Description:**
Returns the currently executing task within a thread context.

**Returns:**
- (Task): The current task or nil if not in a thread

**Example:**
```lua
StartThread(function()
    local current = scheduler:GetCurrentTask()
    print("Current task ID:", current.id)
end, "self_aware_task")
```

## Constants

### HIBERNATE {#hibernate-constant}

**Value:** `"hibernate"`

**Status:** `stable`

**Description:** Yield type constant for hibernating threads.

### SLEEP {#sleep-constant}

**Value:** `"sleep"`

**Status:** `stable`

**Description:** Yield type constant for sleeping threads.

## Common Usage Patterns

### Delayed Execution
```lua
-- Execute something after a delay
scheduler:ExecuteInTime(5.0, function()
    print("5 seconds have passed")
end, "timer")
```

### Periodic Tasks
```lua
-- Health regeneration every 2 seconds, 10 times
local regen = scheduler:ExecutePeriodic(2.0, function(inst)
    if inst.components.health then
        inst.components.health:DoDelta(5)
    end
end, 10, nil, "health_regen", inst)
```

### Thread Communication
```lua
local worker_task = StartThread(function()
    print("Worker starting")
    Hibernate() -- Wait for signal
    print("Worker received signal")
end, "worker")

-- Signal the worker after some condition
scheduler:ExecuteInTime(3.0, function()
    WakeTask(worker_task)
end, "signaler")
```

### Cleanup Pattern
```lua
local cleanup_tasks = {}

-- Start multiple tasks
for i = 1, 5 do
    cleanup_tasks[i] = StartThread(function()
        -- Do work
        while true do
            print("Working", i)
            Sleep(1)
        end
    end, "cleanup_example")
end

-- Clean them all up later
scheduler:ExecuteInTime(10.0, function()
    for _, task in ipairs(cleanup_tasks) do
        KillThread(task)
    end
end, "cleanup")
```

## Related Modules

- [Class](./class.md): Base class system used by scheduler components
- [Main Functions](./mainfunctions.md): Core game loop that drives scheduler execution
