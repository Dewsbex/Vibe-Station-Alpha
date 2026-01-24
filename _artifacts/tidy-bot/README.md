# 🤖 Tidy Bot v4

**Status:** Experimental  
**Hardware:** Raspberry Pi 4 + Camera Module  
**Stack:** OpenCV, Python, TensorFlow Lite

### The Mission
My son hates cleaning. I love systems. This project attempts to bridge that gap by turning his floor into a video game level. 

### The System
A camera mounted on the bookshelf scans the floor every 60 seconds.
1. **Detects** objects using a custom trained model (Socks, Lego, Books).
2. **Assigns XP** based on difficulty (Lego = 50XP, Socks = 10XP).
3. **Verifies** "Clean State" when the floor polygon is >90% clear.
4. **Unlocks** the iPad when XP target is met.

### The "Drudgery Tax"
The goal isn't just a clean room. It's to teach the concept of **Technical Debt**: If you leave the Lego until Friday, the "Processing Cost" (cleaning time) compounds exponentially.

### Known Issues
- **False Positives:** The model currently identifies the patterned rug as "Scattered Lego."
- **The "Blanket Hack":** My son discovered that throwing a duvet over the mess registers as 100% Clean. I am currently patching this with a "Volume Detection" check.

### Roadmap
- [ ] Migrate to YOLOv8 for faster inference.
- [ ] Add "Hazard Detection" audio warnings for stepping on Lego.
