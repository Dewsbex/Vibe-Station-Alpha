import cv2
import numpy as np

def scan_floor(frame):
    # Detect edges of mess
    edges = cv2.Canny(frame, 100, 200)
    
    # Calculate "Mess Density"
    pixel_count = np.sum(edges > 0)
    cleanliness_score = 100 - (pixel_count / 1000)
    
    if cleanliness_score > 90:
        return "STATUS: CLEAN (iPad Unlocked)"
    else:
        return f"STATUS: MESSY (Confidence: {cleanliness_score}%)"

# TODO: Fix the blanket hack
def detect_blanket_hack(depth_map):
    pass
