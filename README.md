Plugin interface.
Event bus.
Plugin manager. - implement featuers
Scene manager.
Asset manager.
SDK - What a plugin must implement" (contracts/interfaces).
Backend Core = "How it actually works on the server."
Frontend Core = "How it actually works in the browser."
shared                 <-- Common DTOs/events/messages

                 +----------------------+
                 |        SDK           |
                 |  Interfaces Only     |
                 +----------+-----------+
                            |
                Plugins implement SDK
                            |
      +---------------------+---------------------+
      |                                           |
+-----v----------------+              +-----------v----------+
| Backend Core         |              | Frontend Core        |
|                      |              |                      |
| Plugin Manager       |              | Plugin Manager       |
| Event Bus            |              | Event Bus            |
| Asset Manager        |              | Scene Manager        |
| Database             |              | Rendering            |
| RTSP                 |              | Selection            |
+----------------------+              +----------------------+
               \                          /
                \                        /
                 \                      /
                  +--------------------+
                  |      Plugins       |
                  | Camera Planner     |
                  | RTSP               |
                  | AI Overlay         |
                  | Digital Twin       |
                  +--------------------+


    Layer 0
    ==========

    VisionTwin

    SDK

    Backend Core

    Frontend Core

    Plugins

        (empty)


pip install -e backend
pip list | grep visiontwin

Tool Start
==============
npm run dev
