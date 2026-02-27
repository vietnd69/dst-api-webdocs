---
id: vaultmusiclistener
title: Vaultmusiclistener
description: Monitors world region transitions to automatically trigger and stop vault-themed music when the player enters or leaves a vault area.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 179bad17
---

# Vaultmusiclistener

## Overview
This component listens for area changes (e.g., player movement between zones) and manages the playback of vault-specific ambient music by responding to transitions into and out of vault-map regions. It uses a delayed trigger mechanism to ensure music only starts after confirming stable presence in a vault.

## Dependencies & Tags
* **Event Listened:** `changearea`
* **Event Pushed:** `triggeredevent` (with `{ name = "vault", duration = 5 }`)
* **Updates Managed:** Begins/stops component update loop via `StartUpdatingComponent`/`StopUpdatingComponent`
* **No other components or tags are added or required.**

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(not assigned)* | Reference to the entity the component is attached to (typically the player). Set once during construction. |
| `delay` | `number?` | `nil` | Countdown timer used to defer music trigger until the player is confirmed inside the vault. Non-`nil` indicates a pending music start. |

## Main Functions

### `StartVaultMusic()`
* **Description:** Initiates the delayed vault music trigger. If no music is currently pending, sets the countdown delay to 3.5 seconds, starts the component update loop, and schedules the first update.
* **Parameters:** None.

### `StopVaultMusic()`
* **Description:** Cancels any pending vault music trigger by clearing the delay and stopping the update loop.
* **Parameters:** None.

### `IsMusicPlaying()`
* **Description:** Returns whether vault music is currently playing (i.e., the delay countdown is active).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.delay` is non-`nil`, otherwise `false`.

### `OnUpdate(dt)`
* **Description:** Handles timed updates during the delay countdown. If the countdown completes (`dt >= delay`), emits a `triggeredevent` with `name = "vault"` and `duration = 5`, and resets the delay to 1 second for continued playback. Otherwise, decrements the remaining delay.
* **Parameters:**
  * `dt` (`number`) — Time elapsed since the last update.

## Events & Listeners
* **Listens to:**
  * `"changearea"` — Triggers `OnChangeArea` on world region transitions (e.g., moving between map zones).
* **Triggers:**
  * `"triggeredevent"` with payload `{ name = "vault", duration = 5 }` — Sent when the delay completes, indicating vault music should begin.
* **Internal cleanup:**
  * `"changearea"` callback is removed on component removal via `OnRemoveFromEntity`.