---
id: plantresearchable
title: Plantresearchable
description: Marks an entity as a researchable plant and provides methods to retrieve, check, and signal plant research progress.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ee7d6cbb
---

# Plantresearchable

## Overview
This component enables an entity (typically a plant) to be recognized as researchable in the game, allowing other systems (e.g., the Blueprint or Science Machine UI) to query its research information and track progression through research stages. It assigns the `"plantresearchable"` tag and supports custom research metadata via a configurable callback.

## Dependencies & Tags
- **Tags Added:** `"plantresearchable"`
- **Dependencies:** None (does not require or initialize other components directly)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(constructor parameter)* | Reference to the entity this component is attached to. |
| `reasearchinfofn` | `function` | `nil` | Callback function used to retrieve research data (`plant` name and `stage` index) for the entity. |

> **Note:** The property name `reasearchinfofn` appears to be a typo for `researchinfofn`, but is preserved as written in the source.

## Main Functions

### `SetResearchFn(fn)`
* **Description:** Sets the callback function used to retrieve research information (plant name and stage) when `GetResearchInfo()` is called.
* **Parameters:**
  * `fn` (*function*) — A function that takes the entity (`inst`) as an argument and returns a table `{ plant = <string>, stage = <number> }`, or `nil` to indicate no researchable data.

### `GetResearchInfo()`
* **Description:** Invokes the stored research function (if set) and returns its result.
* **Parameters:** None.

### `IsRandomSeed()`
* **Description:** Returns `true` if the entity is considered a random seed (i.e., `GetResearchInfo()` returns `nil`), indicating no fixed research identity.
* **Parameters:** None.

### `LearnPlant(doer)`
* **Description:** Triggers the `"learnplantstage"` event on the `doer` (typically a player) with the plant name and current research stage, if research info is available.
* **Parameters:**
  * `doer` (*Entity*) — The entity (usually the player) performing the research action. Must support receiving the `"learnplantstage"` event.

## Events & Listeners
- **Listens For:** None.
- **Emits:**  
  - `"learnplantstage"` — Pushed on the `doer` entity with payload `{ plant = <string>, stage = <number> }` inside `LearnPlant()`.