Day 1

Only

Plugin Manager

Event Bus

Plugin Interface
Day 2

Only

Scene Manager

Asset Manager
Day 3

Only

Three.js Viewer
Day 4

Only

Scene Editor Plugin
Day 5

Only

Camera Planner Plugin

See how nice the dependency graph becomes.

             Application

                  │

          Plugin Manager

                  │

    ┌─────────────┼──────────────┐

 Scene Manager   Event Bus   Asset Manager

    │                 │              │

    └─────────────┬──────────────┘

                  │

              Plugins

     Scene Editor

     Camera Planner

     RTSP

     AI Overlay

     Digital Twin

Sprint 1 (Core Foundation)
===========================
IPlugin (SDK)
PluginManager (Backend)
EventBus (Backend)
PluginManager (Frontend)
EventBus (Frontend)

Sprint 1 Deliverables
===================
Backend

IPlugin

PluginManager

EventBus

PluginLoader


Frontend

IPlugin

PluginManager

EventBus


Plugin Manifest

plugin.json

Sprint 2 (Scene Core)
================
SceneManager
AssetManager
CommandManager
SelectionManager

Sprint 3 (First Real Plugin)
====================
Scene Editor Plugin


backend/app/

    core/

        plugin_manager.py

        event_bus.py

        plugin_loader.py

    sdk/

        interfaces/

            plugin.py

        events/

            event.py

    frontend/src/

    core/

        PluginManager.ts

        EventBus.ts

    sdk/

        interfaces/

            IPlugin.ts

        events/

            Event.ts