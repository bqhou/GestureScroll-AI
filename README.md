<div align="center">
<!-- <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /> -->
 <!-- Run and deploy your AI Studio app
This contains everything you need to run your app locally. View your app in AI Studio: https://ai.studio/apps/drive/1MfeBsPwPqiOTmL3oY_YoBeolr43ywt7Z -->
</div>

### GestureScroll AI
is a cutting-edge Human-Computer Interaction (HCI) tool that transforms your webcam into a spatial controller for hands-free browser navigation.
By leveraging Gemini 2.5 Flash, the application interprets your hand's vertical position in real-time to provide a fluid, "joystick-style" scrolling experience similar to flicking a page on an iPad or smartphone.

### Key Features:
Proportional Control: Unlike discrete "up/down" gestures, the scroll speed is determined by how far your hand moves from the center. The further you move toward the edges of the camera frame, the faster the content scrolls.

Intelligent Neutral Zone: A calibrated center area allows you to hold your hand still to pause scrolling, preventing "jitter" and accidental movement.

Visual HUD (Heads-Up Display): Real-time overlays on the camera feed show exactly where your hand is relative to the "Scroll Up" and "Scroll Down" zones.

Customizable Sensitivity: An integrated slider lets you tune the scroll velocity to match your personal preference or the length of the article you're reading.

Privacy-Conscious Processing: Uses snapshot-based analysis rather than continuous video streaming, optimized for low-latency feedback using Google's fastest multimodal model.

### Best For:
Accessibility: Users with limited motor skills who find traditional mice or keyboards challenging.
Hands-Free Utility: Perfect for following recipes in the kitchen, reading schematics in a workshop, or scrolling through sheet music while playing an instrument.
Futuristic Browsing: A demonstration of how Large Multimodal Models (LMMs) are moving beyond chat boxes and into functional system control.



## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
