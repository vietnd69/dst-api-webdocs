---
id: snowmandecor
title: Snowmandecor
description: A minimal placeholder component that serves as a marker or hook for external action definitions in componentactions.lua.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 063ac314
---

# Snowmandecor

## Overview
`Snowmandecor` is a lightweight, marker-style component that attaches to an entity and holds no internal state or logic. Its sole purpose is to exist as a dependency or identifier for action registration in `componentactions.lua`, enabling context-sensitive interactions (e.g., decoration or interaction triggers) without modifying the core entity behavior.

## Dependencies & Tags
None identified.

## Properties
No public properties were clearly identified from the source. The constructor (`_ctor`) only assigns the `inst` reference and does not define or initialize any additional fields.

## Main Functions
No main functional methods are defined. This component contains no public methods beyond its constructor.

## Events & Listeners
None. This component does not register event listeners or push events.