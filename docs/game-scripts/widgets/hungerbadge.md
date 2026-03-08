---
id: hungerbadge
title: Hungerbadge
description: Renders a visual hunger status indicator with directional animation (increasing, decreasing, or neutral) based on the owner's hunger state.
tags: [ui, hunger, status, overlay, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 5420565a
system_scope: ui
---

# Hungerbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`HungerBadge` is a UI widget that displays the owner entity's current hunger level with contextual animation feedback. It extends `Badge` and dynamically updates the underlying arrow animation based on whether the owner is gaining, losing, or maintaining hunger. It reads replicated hunger data (`self.owner.replica.hunger`) to determine state and handles networked scenarios where exact tick-level changes aren’t immediately visible.

## Usage example
```lua
local inst = TheSim:FindFirstEntityWithTag("player")
if inst and inst.components.hunger then
    inst:AddWidget("hungerbadge")
    -- The badge automatically starts updating and showing hunger status
end
```

## Dependencies & tags
**Components used:** None (uses `replica.hunger` from owner’s network component; does not directly add or modify components on owner).  
**Tags:** Checks `wintersfeastbuff`, `hungerregenbuff`, `sleeping`, `swimming_floater`, `wonkey_run`, `gallop_run` on owner; checks `floating_predict_move`, `monkey_predict_run`, `gallop_predict_run` on owner’s state graph.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hungerarrow` | `UIAnim` | `nil` | Child animation widget showing hunger direction (increase/decrease/neutral). |
| `arrowdir` | string | `nil` | Stores the current animation name to prevent redundant animation updates. |
| `tracking` | table | `nil` | Internal circular buffer used to infer net hunger change when both gain and drain are active. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Updates the hunger indicator animation based on the owner’s current hunger status. It evaluates hunger gain vs. drain using tags and, when both are possible, uses a rolling history to detect recent changes.
* **Parameters:** `dt` (number) — Delta time since last frame; ignored if server is paused.
* **Returns:** Nothing.
* **Error states:** Early exit if `TheNet:IsServerPaused()` is `true`. Does not crash if `self.owner` or `self.owner.replica.hunger` is `nil`.

## Events & listeners
None.  
The component relies on periodic `OnUpdate` calls (likely from being added as a widget to an entity with update hooks), not event listeners.
