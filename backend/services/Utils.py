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
    
    def decode_8bit_floating_point(self, fp):
        """
        Decodes an 8-bit floating-point number (1-bit sign, 3-bit exponent, 4-bit mantissa)
        into a Python float.
        """
        # Extract components
        sign = (fp >> 7) & 0b1          # 1-bit sign
        exponent = (fp >> 4) & 0b111    # 3-bit exponent
        mantissa = fp & 0b1111          # 4-bit mantissa

        # Interpret the exponent (bias = 3 for 3-bit exponent)
        bias = 3
        if exponent == 0:
            # Denormalized number
            true_exponent = -bias + 1
            normalized_mantissa = mantissa / 16.0  # Divide by 2^4
        else:
            # Normalized number
            true_exponent = exponent - bias
            normalized_mantissa = 1 + (mantissa / 16.0)  # Implicit leading 1

        # Compute the floating-point value
        float_value = ((-1) ** sign) * (2 ** true_exponent) * normalized_mantissa

        return float_value
    
    def encode_to_8bit_floating_point(self, value):
        """
        Encodes a Python float into an 8-bit floating-point number
        with 1-bit sign, 3-bit exponent, and 4-bit mantissa.
        """
        # Handle zero
        if value == 0:
            return 0b00000000  # +0
        if value == -0.0:
            return 0b10000000  # -0

        # Extract the sign
        sign = 1 if value < 0 else 0
        abs_value = abs(value)

        # Normalize the float (find the exponent and mantissa)
        exponent = 0
        while abs_value >= 2.0:
            abs_value /= 2.0
            exponent += 1
        while abs_value < 1.0:
            abs_value *= 2.0
            exponent -= 1

        # Calculate the biased exponent
        bias = 3
        biased_exponent = exponent + bias

        # Handle overflow (biased exponent too large)
        if biased_exponent >= 0b111:
            # Represent as the maximum value (clamp to max exponent)
            return (sign << 7) | (0b111 << 4) | 0b1111

        # Handle underflow (biased exponent too small)
        if biased_exponent <= 0:
            # Denormalized numbers (exponent = 0)
            biased_exponent = 0
            mantissa = int(abs_value * (2 ** 4) + 0.5)  # Scale mantissa for 4 bits
        else:
            # Normalized numbers
            abs_value -= 1.0  # Remove the implicit leading 1
            mantissa = int(abs_value * (2 ** 4) + 0.5)  # Scale mantissa for 4 bits

        # Ensure the mantissa fits into 4 bits
        mantissa &= 0b1111

        # Combine components into an 8-bit value
        return (sign << 7) | (biased_exponent << 4) | mantissa
