import base64
import os

# Use the absolute path directly
image_path = os.path.join('e:\\', 'Study Space', 'Python Workspace', 'ELastic Search', "images", "panda.jpg")

# Verify the path exists
print(f"Full path to image: {image_path}")
print(f"Image exists: {os.path.exists(image_path)}")

# Read and encode the image
with open(image_path, "rb") as f:
    image_data = f.read()
    image_base64 = base64.b64encode(image_data).decode("utf-8")

print(f"Image base64 encoded (first 50 characters): {image_base64[:50]}...")
print(f"Total length of base64 encoded image: {len(image_base64)} characters")