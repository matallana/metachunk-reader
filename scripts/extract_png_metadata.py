import os
import pymongo
import png
import hashlib
from PIL import Image

# Connect to MongoDB
def connect_mongo():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["png_metadata"]
    return db["images"]

# Generate a hash for text_chunks using BLAKE2s
def hash_text_chunks(text_chunks):
    if not text_chunks:
        return None  # If no text, do not generate hash
    hash_object = hashlib.blake2s("".join(text_chunks).encode("utf-8"))
    return hash_object.hexdigest()

# Extract metadata from PNG, prioritizing tEXt
def extract_png_info(file_path):
    print(f"\nAnalyzing: {file_path}")

    with open(file_path, 'rb') as f:
        reader = png.Reader(file=f)
        width, height, _, metadata = reader.read()

        img = Image.open(file_path)

        png_metadata = {
            "filename": os.path.basename(file_path),
            "width": width,
            "height": height,
            "format": img.format,
            "mode": img.mode,
            "bit_depth": metadata.get("bitdepth"),
            "color_type": metadata.get("greyscale", False),
            "alpha": metadata.get("alpha", False),
            "text_chunks": [],  # Priority to tEXt
            "text_hash": None,
            "physical_dimensions": None,
            "has_text_metadata": False  # Indicator if tEXt is present
        }

    # Read chunks manually to extract tEXt and pHYs
    with open(file_path, 'rb') as f:
        data = f.read()
        text_chunks = []
        phys_data = None

        pos = 8  # Skip the first 8 bytes of the PNG signature
        while pos < len(data):
            chunk_length = int.from_bytes(data[pos:pos+4], byteorder='big')
            chunk_type = data[pos+4:pos+8].decode("utf-8")
            chunk_data = data[pos+8:pos+8+chunk_length]

            if chunk_type == "tEXt":
                try:
                    text_chunks.append(chunk_data.decode("latin-1"))
                except UnicodeDecodeError:
                    text_chunks.append(chunk_data.hex())

            if chunk_type == "pHYs":
                ppu_x = int.from_bytes(chunk_data[0:4], byteorder="big")
                ppu_y = int.from_bytes(chunk_data[4:8], byteorder="big")
                unit_specifier = chunk_data[8]
                phys_data = {
                    "pixels_per_unit_x": ppu_x,
                    "pixels_per_unit_y": ppu_y,
                    "unit_specifier": "meters" if unit_specifier == 1 else "unknown"
                }

            pos += chunk_length + 12

        # Add extracted data to metadata
        png_metadata["text_chunks"] = text_chunks
        png_metadata["text_hash"] = hash_text_chunks(text_chunks)
        png_metadata["physical_dimensions"] = phys_data
        png_metadata["has_text_metadata"] = len(text_chunks) > 0  # True if tEXt is present

        print("Extracted Metadata:")
        for key, value in png_metadata.items():
            print(f"  {key}: {value}")

        return png_metadata

# Process the folder and store metadata in MongoDB while avoiding duplicates
def process_folder(folder_path, collection):
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".png"):
            file_path = os.path.join(folder_path, filename)
            metadata = extract_png_info(file_path)
            
            # Check if a similar record already exists
            query = {
                "filename": metadata["filename"],
                "width": metadata["width"],
                "height": metadata["height"],
            }
            if metadata["text_hash"]:
                query["text_hash"] = metadata["text_hash"]  # Compare text hash if available

            existing = collection.find(query)
            match_count = sum(1 for _ in existing)  # Count matches
            
            if match_count == 0:  # Only save if no identical entry exists
                collection.insert_one(metadata)
                print(f"Saved to MongoDB: {metadata}")
            else:
                print("Skipping duplicate: ", metadata["filename"])

if __name__ == "__main__":
    folder_path = "./images"
    os.makedirs(folder_path, exist_ok=True)
    collection = connect_mongo()
    process_folder(folder_path, collection)
    print("\n🚀 Metadata extraction and storage completed.")
