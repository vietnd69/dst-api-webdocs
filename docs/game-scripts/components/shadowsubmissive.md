---
id: shadowsubmissive
title: Shadowsubmissive
description: This component enables an entity to recognize and respond to shadow dominance, temporarily removing the shadowdominance tag upon being attacked and restoring it after a delay if the attacker still meets dominance criteria.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0e644a7e
---

# Shadowsubmissive

## Overview
The `ShadowSubmissive` component manages the behavioral and tag-based response of an entity to entities bearing shadow dominance. It listens for attack events, removes the `shadowdominance` tag from the attacker upon being attacked, schedules reapplication of the tag after a configurable delay (default 12 seconds), and provides utility methods to check dominance relationships.

## Dependencies & Tags
- **Tags added by this component:** `shadowsubmissive` (applied to the entity using this component)
- **Tags checked/modified by this component:** `shadowdominance`, `inherentshadowdominance`
- **Component dependency:** Uses `attacker.components.inventory` if present (only during `OnReactivate` or `TargetHasDominance` checks)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forgetattackertime` | number | 12 | Time (in seconds) to wait before reapplying the `shadowdominance` tag to an attacker after being attacked. |
| `inst` | Entity | — | Reference to the entity instance this component is attached to. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from its entity. Removes the `shadowsubmissive` tag and unregisters the `"attacked"` event listener.
* **Parameters:** None.

### `ShouldSubmitToTarget(target)`
* **Description:** Determines whether the component's owner should submit to a given target based solely on the target possessing the `shadowdominance` tag.
* **Parameters:**
  * `target` (Entity or nil): The target entity to evaluate.

### `TargetHasDominance(target)`
* **Description:** Checks whether a given target holds dominance by verifying presence of the `shadowdominance` tag, either via equip (via `inventory:EquipHasTag`) or the `inherentshadowdominance` tag.
* **Parameters:**
  * `target` (Entity or nil): The target entity to evaluate.

## Events & Listeners
- **Listens to:**
  - `"attacked"` → triggers `OnAttacked` callback
- **Triggers (via internal logic):**
  - `data.attacker:RemoveTag("shadowdominance")`
  - `data.attacker:AddTag("shadowdominance")` (scheduled via `DoTaskInTime`)
  - `data.attacker._shadowdsubmissive_task:Cancel()` (if task exists)