---
id: strongman
title: Strongman
description: Manages a character's gym workout session, pausing mightiness while active and resuming it upon completion.
tags: [combat, gym, workout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cbd0b9e1
system_scope: entity
---

# Strongman

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Strongman` manages a character's workout session at a gym structure. It coordinates with the `mightiness` component to temporarily pause damage-draining effects during the workout, and applies the `ingym` tag to indicate the character is currently exercising. This component is designed for use with gym-related mechanics, likely tied to a "strongman" character or gym furniture.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("strongman")
inst:AddComponent("mightiness")
-- When entering a gym:
inst.components.strongman:DoWorkout(gym_structure)
-- When leaving the gym:
inst.components.strongman:StopWorkout()
```

## Dependencies & tags
**Components used:** `mightiness`  
**Tags:** Adds `ingym` during workout; removes `ingym` on workout结束.

## Properties
No public properties

## Main functions
### `DoWorkout(gym)`
*   **Description:** Starts a gym workout session. Pauses the `mightiness` component and adds the `ingym` tag to the entity.
*   **Parameters:** `gym` (entity reference) – the gym structure or object the character is working out at.
*   **Returns:** Nothing.
*   **Error states:** Assumes `mightiness` component exists on `inst`; will error if missing.

### `StopWorkout()`
*   **Description:** Ends the gym workout session. Removes the `ingym` tag and resumes the `mightiness` component. Clears internal reference to the gym.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Assumes `mightiness` component exists on `inst`; will error if missing.

## Events & listeners
None identified.
