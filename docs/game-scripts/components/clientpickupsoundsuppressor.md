---
id: clientpickupsoundsuppressor
title: Clientpickupsoundsuppressor
description: This component temporarily suppresses an entity's pickup sound on the client, particularly for newly spawned or specific interaction scenarios.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: audio
source_hash: 7d8f002d
---

# Clientpickupsoundsuppressor

## Overview
This component provides functionality to temporarily disable the pickup sound of an entity on the client-side. It is primarily used to prevent unintended pickup sounds when an entity spawns or during specific interactions where a sound would be redundant or incorrect, ensuring a smoother client-side audio experience. The suppression is brief and automatically re-enables the original sound after a short delay.

## Dependencies & Tags
This component relies on the entity having a `pickupsound` property, which it temporarily modifies. It does not add or remove any specific tags.
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `_ignorenext` | `net_bool` | `false` | A network-synchronized boolean that signals whether the next potential pickup sound should be ignored. It also triggers an event listener on client instances when its value changes. |

## Main Functions
### `ClientPickupSoundSuppressor:IgnoreNextPickupSound()`
*   **Description:** Instructs the component to suppress the entity's next pickup sound on clients. It determines if the entity has just spawned and sets the `_ignorenext` network boolean accordingly, which then triggers the actual sound suppression logic on client instances.
*   **Parameters:** None.

## Events & Listeners
*   **Listens For:** `clientpickupsoundsuppressor._ignorenext` (on non-master simulations only)
    *   Triggered when the `_ignorenext` `net_bool` changes its value. This event handler (`OnIgnoreNext`) is responsible for temporarily setting `inst.pickupsound` to "NONE" and scheduling its restoration after a short duration (2 frames). It includes a special check to avoid suppressing sounds if the entity just spawned on the client but isn't a new server spawn, preventing unintended sound loss for valid spawn events.