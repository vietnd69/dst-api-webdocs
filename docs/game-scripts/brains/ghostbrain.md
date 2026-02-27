---
id: ghostbrain
title: Ghostbrain
description: Manages the behavior tree logic for ghost entities to pursue or wander based on proximity to living characters and game rules.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 40303f08
---

# Ghostbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`GhostBrain` is a behavior tree (`BT`) implementation that defines how ghost entities (e.g., `ghost`) decide whether to follow or wander. It prioritizes chasing a valid living character within range, but retreats or dissipates if no suitable target is found. The brain uses the behavior tree framework to orchestrate state-driven actions: a high-priority follow action while a target exists, and a fallback wander-then-dissipate sequence otherwise.

Key relationships:
- Uses `Combat` component (`ghost.components.combat:TargetIs`) to determine active targeting state.
- Uses `Health` component (`target.components.health:IsDead()`) to verify target viability.

## Dependencies & Tags

- **Components used:**
  - `health`: Checked via `IsDead()` for target validation.
  - `combat`: Checked via `TargetIs()` for mutual targeting during ghost-friendly interactions.
- **Tags:**
  - `TARGET_MUST_TAGS = \{"character"\}`: Targets must have this tag.
  - `TARGET_CANT_TAGS = \{"INLIMBO", "noauradamage"\}`: Targets with these tags are excluded.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `followtarget` | `GameObject?` | `nil` | Holds the currently selected character to follow; cleared if target becomes invalid (e.g., dead, out of range, or invisible). |

## Main Functions

### `GhostBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Sets up a priority-based behavior: first attempts to follow a valid target if found, otherwise executes a sequence of waiting 10 seconds while wandering, then dissipating (transitioning to `"dissipate"` state in the SG).
* **Parameters:** None.
* **Returns:** None.

### `GetFollowTarget(ghost)`
* **Description:** Calculates and updates the ghost's current follow target. Clears `ghost.brain.followtarget` if it becomes invalid, then searches for the first living `character` within 10 units (by distance squared `TUNING.GHOST_FOLLOW_DSQ`) that meets targeting rules. Respects ghost-friendly tags (`"ghostlyfriend"` or `"abigail"`), requiring mutual targeting before following them. Non-ghost-friendly characters are followed unconditionally if alive and visible.
* **Parameters:**
  - `ghost`: `GameObject` — The ghost entity whose brain is computing the target.
* **Returns:** `GameObject?` — The selected target if found, otherwise `nil`.

## Events & Listeners

None. `GhostBrain` does not register or dispatch events; it operates solely via behavior tree evaluation.