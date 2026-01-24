import requests
from datetime import datetime

class ScoutAgent:
    def __init__(self, location="SW19"):
        self.location = location
        self.banned_keywords = ["ballet", "soft play", "yoga"]
        
    def scan_local_events(self):
        print(f"> INIT: Scanning {self.location} vectors...")
        # Placeholder for scraping logic
        return ["Rocket Building", "Toddler Yoga"]

    def filter_noise(self, events):
        clean_list = []
        for event in events:
            if any(x in event.lower() for x in self.banned_keywords):
                print(f"> REJECTED: {event} (Low Signal)")
            else:
                clean_list.append(event)
        return clean_list

if __name__ == "__main__":
    agent = ScoutAgent()
    events = agent.scan_local_events()
    print(agent.filter_noise(events))
