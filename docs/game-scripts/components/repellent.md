---
id: repellent
title: Repellent
description: This component manages repulsion logic for entities, such as驱逐 followers or nearby combatants based on tag matching and configurable rules.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0cd23b65
---

# Repellent

## Overview
The `Repellent` component enables an entity to repel other entities—specifically followers of a leader or any entities within a radius—that match or exclude certain tags. It supports both targeted follower ejection and radius-based crowd repulsion (e.g., pushing away hostile entities), optionally consuming finite uses (e.g., smokebomb-like behavior).

## Dependencies & Tags
- `self.inst.components.leader` (used conditionally when `onlyfollowers` is true)
- `self.inst.components.finiteuses` (used optionally during repel action)
- Tags added to internal tracking: `repel_tags` (explicitly managed), `ignore_tags` (default: `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed via constructor) | Reference to the entity instance the component is attached to. |
| `onlyfollowers` | `boolean` | `false` | If `true`, only repels entities following a leader (i.e., using the `follower` component). Otherwise, repels entities in a radius. |
| `repel_tags` | `table<string>` | `{}` | List of tags that *must all be present* on a target entity for it to be repelled (AND logic). |
| `ignore_tags` | `table<string>` | `{"FX", "NOCLICK", "DECOR", "INLIMBO"}` | List of tags that, if present on a target, exclude it from repulsion. |

## Main Functions

### `ValidateTargetTags(target)`
* **Description:** Checks whether the given `target` entity matches the current `repel_tags` (all must be present) and does *not* match any `ignore_tags`. (Note: Ignore-tag validation is commented out in current code.)
* **Parameters:**
  * `target` (`Entity`): The entity to validate.

### `AddRepelTag(tag)`
* **Description:** Adds a tag to the `repel_tags` list, ensuring uniqueness.
* **Parameters:**
  * `tag` (`string`): The tag to add.

### `RemoveRepelTag(tag)`
* **Description:** Removes a tag from the `repel_tags` list.
* **Parameters:**
  * `tag` (`string`): The tag to remove.

### `AddIgnoreTag(tag)`
* **Description:** Adds a tag to the `ignore_tags` list, ensuring uniqueness.
* **Parameters:**
  * `tag` (`string`): The tag to add.

### `RemoveIgnoreTag(tag)`
* **Description:** Removes a tag from the `ignore_tags` list.
* **Parameters:**
  * `tag` (`string`): The tag to remove.

### `SetRadius(radius)`
* **Description:** Sets the radius around the entity within which non-follower targets are repelled (used when `onlyfollowers` is `false`).
* **Parameters:**
  * `radius` (`number`): The search radius (world units).

### `SetUseAmount(amount)`
* **Description:** Configures the number of uses to consume when `Repel()` is called and the entity has a `finiteuses` component.
* **Parameters:**
  * `amount` (`number`): Number of uses to consume (default used if not set: `1`).

### `SetOnRepelFollowerFn(fn)`
* **Description:** Registers a callback function invoked whenever a follower is successfully repelled.
* **Parameters:**
  * `fn` (`function`): Signature: `fn(repeller_entity, repelled_follower_entity)`.

### `SetOnlyRepelsFollowers(enabled)`
* **Description:** Toggles whether the component only repels followers (when `true`) or also repels nearby entities by radius (when `false`).
* **Parameters:**
  * `enabled` (`boolean`): Enable (true) or disable (false) follower-only mode.

### `Repel(doer)`
* **Description:** Executes the core repulsion logic. If `onlyfollowers` is true, it iterates over `doer`’s followers and repels matching ones. If false, it also searches the area for matching combat entities and makes them drop their targets. Optionally consumes finite uses.
* **Parameters:**
  * `doer` (`Entity`): The entity that triggered or is affected by the repulsion (typically the leader in follower repulsion context).

## Events & Listeners
* Listens for no events directly.
* Triggers:
  * Calls `follower:StopFollowing()` on repelled followers.
  * Invokes `onrepelfollowerfn` callback (if set) for repelled followers.
  * Calls `combat:DropTarget()` on matched combat entities in radius.
  * Calls `finiteuses:Use(amount)` if `finiteuses` component exists.