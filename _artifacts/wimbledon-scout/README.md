# 🎾 Wimbledon Scout

**Status:** Beta (v0.2)  
**Stack:** Python, Beautiful Soup, OpenAI API, Twilio

### The Problem
Finding science activities for a 6-year-old in SW19 involves trawling through 15 different "Mummy Blogs," 3 broken council websites, and a newsletter that hasn't been updated since 2019. It is an unstructured data problem.

### The Fix
A Python script that runs every Friday at 09:00. It:
1. **Scrapes** the Merton Council "Events" PDF and local theatre listings.
2. **Filters** for keywords: "Science," "Robot," "Space," "Mud."
3. **Validates** against the "Nap Time" logic gate (13:00 - 15:00 is a hard block).
4. **Delivers** a curated SMS to me with only high-signal events.

### How it Works (The Logic)
```python
def filter_event(event):
    if event.category != "STEM":
        return False # Reject: Not Educational
    if event.time_start >= 1300 and event.time_end <= 1500:
        return False # Reject: Nap Time Conflict
    if event.distance_from_station > 2.0:
        return False # Reject: Too far for little legs
    return True # Accept
```

### Current Bugs (Help Wanted)
[ ] The "Yoga" Incident: The agent currently thinks "Yoga" is a STEM activity because the description contained the word "Biology." Need better negative prompting in the LLM.

[ ] PDF Parsing: Fails on the new library newsletter layout (column shift).

### Steal This Code
Change the coordinates in config.py to your local postcode. If you fix the Yoga bug, please submit a PR.
