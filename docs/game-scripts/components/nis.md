---
id: nis
title: Nis
description: Manages non-interactive cinematic sequences, including script execution, skip handling, and cleanup.
tags: [cinematic, cutscene, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 04850956
system_scope: ui
---

# Nis

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Nis` (short for *Non-Interactive Sequence*) is a component that orchestrates cinematic or cutscene sequences in DST. It handles sequence execution via a script function, supports skipability (via user input), and manages cleanup (including entity removal and thread termination). It is typically attached to a temporary, high-priority entity used solely during a cinematic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("nis")
inst.components.nis:SetName("intro_sequence")
inst.components.nis:SetScript(function(nis, data, lines) 
    -- cinematic logic here
end)
inst.components.nis:SetInit(function(data) 
    -- initialization logic
end)
inst.components.nis:SetCancel(function(data) 
    -- abort/cleanup logic
end)
inst.components.nis.skippable = true
inst.components.nis:Play(lines)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `cinematic`; removes itself on finish.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `playing` | boolean | `false` | Whether the cinematic sequence is currently active. |
| `skippable` | boolean | `false` | Whether user input can cancel the sequence. |
| `data` | table | `{}` | User-provided data passed to `init`, `script`, and `cancel` functions. |
| `name` | string | `""` | Human-readable identifier for the sequence. |
| `script` | function? | `nil` | Main sequence logic; signature: `(nis, data, lines) -> void`. |
| `init` | function? | `nil` | Initialization callback; signature: `(data) -> void`. |
| `cancel` | function? | `nil` | Termination/cleanup callback; signature: `(data) -> void`. |

## Main functions
### `OnRemoveEntity()`
*   **Description:** Called when the owning entity is removed. Cleans up all registered input handlers to prevent dangling references.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetName(name)`
*   **Description:** Sets the human-readable name of the sequence.
*   **Parameters:** `name` (string) — identifier for the sequence.
*   **Returns:** Nothing.

### `SetScript(fn)`
*   **Description:** Assigns the main cinematic script function to execute.
*   **Parameters:** `fn` (function) — the script to run; receives `nis`, `self.data`, and `lines` as arguments.
*   **Returns:** Nothing.

### `SetInit(fn)`
*   **Description:** Assigns the initialization callback to run before script execution.
*   **Parameters:** `fn` (function) — initialization callback; receives `self.data` as argument.
*   **Returns:** Nothing.

### `SetCancel(fn)`
*   **Description:** Assigns the cancellation callback to run when the sequence is skipped.
*   **Parameters:** `fn` (function) — cleanup callback; receives `self.data` as argument.
*   **Returns:** Nothing.

### `OnFinish()`
*   **Description:** Marks the sequence as finished, cancels the thread, and removes the owning entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Cancel()`
*   **Description:** Immediately terminates the sequence: kills the running thread, invokes the `cancel` callback (if defined), then calls `OnFinish`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClick()`
*   **Description:** Handles input events. If `skippable` is true, calls `Cancel()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Play(lines)`
*   **Description:** Starts the cinematic sequence: runs `init`, then spawns a thread to execute the `script`.
*   **Parameters:** `lines` (any) — arbitrary data passed to the script (e.g., dialogue, animation cues).
*   **Returns:** Nothing.
*   **Error states:** If `script` is not set, `OnFinish()` is called immediately.

## Events & listeners
- **Listens to:** `OnRemoveEntity` — internal call via `OnRemoveEntity()` to clean up input handlers.
- **Pushes:** None.
