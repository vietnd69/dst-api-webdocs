---
id: wintertreegiftable
title: Wintertreegiftable
description: Tracks the last world cycle on which a gift was given to a Wintertree to enforce seasonal gift cooldowns.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 80d35032
---

# Wintertreegiftable

## Overview
This component manages the timing state for gift-giving events to Wintertrees by recording the last world cycle a gift was given and providing methods to query the elapsed time or update the recorded day.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to (assigned in constructor). |
| `previousgiftday` | `number` | `-100` | The last world cycle (day count) when a gift was given to the Wintertree. |

## Main Functions
### `GetDaysSinceLastGift()`
* **Description:** Returns the number of world cycles that have passed since the last gift was given.
* **Parameters:** None.

### `OnGiftGiven()`
* **Description:** Updates the internal timestamp to the current world cycle, recording that a gift was just given.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a serializable table containing the `previousgiftday` value for world save persistence.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the `previousgiftday` value from saved data during world load.
* **Parameters:**  
  * `data` (table?): A table containing the `previousgiftday` field; may be `nil` if no prior data exists.

## Events & Listeners
None.