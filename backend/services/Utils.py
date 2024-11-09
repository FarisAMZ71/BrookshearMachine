import os
# Description: This file contains utility functions that are used in the models.
class Utils:
# This function cycles an 8-bit string to the right n times
    def bit_cycle_right(self, bit_string: int, n: int) -> int:
        return (bit_string >> n) | (bit_string << (8 - n)) & 0xFF
    
    def get_file_path(self, file_name: str) -> str:
        directory = os.path.join(os.path.dirname(__file__), '../static/programs')
        os.makedirs(directory, exist_ok=True)
        return os.path.join(directory, file_name)
