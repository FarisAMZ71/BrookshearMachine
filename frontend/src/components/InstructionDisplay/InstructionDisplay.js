import "./InstructionDisplay.css";

const InstructionDisplay = () => {
return (
    <div className="instruction-display">
      <h2>Assembler Guide</h2>

        <table class="instruction-table">
        <thead class="instruction-table-head">
            <tr>
            <th class="col-mnemonic">Mnemonic</th>
            <th class="col-pattern">Pattern</th>
            <th class="col-opcode">Op-code</th>
            <th class="col-operand">Operand</th>
            <th class="col-description">Description</th>
            </tr>
        </thead>
        <tbody class="instruction-table-body">
            <tr>
            <td class="col-mnemonic">LEA</td>
            <td class="col-pattern">R{<b>R</b>}, XY</td>
            <td class="col-opcode">1</td>
            <td class="col-operand">XY</td>
            <td class="col-description">
                Load register <b>R</b> with value at memory address <b>XY</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">LDR</td>
            <td class="col-pattern">R{<b>R</b>}, XY</td>
            <td class="col-opcode">2</td>
            <td class="col-operand">RXY</td>
            <td class="col-description">
                Load register <b>R</b> with value <b>XY</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">STR</td>
            <td class="col-pattern">R{<b>R</b>}, XY</td>
            <td class="col-opcode">3</td>
            <td class="col-operand">RXY</td>
            <td class="col-description">
                Store value from register <b>R</b> into memory address <b>XY</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">MOV</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}</td>
            <td class="col-opcode">4</td>
            <td class="col-operand">0RS</td>
            <td class="col-description">
                Move value from register <b>R</b> to register <b>S</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">ADT</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, R{<b>T</b>}</td>
            <td class="col-opcode">5</td>
            <td class="col-operand">RST</td>
            <td class="col-description">
                Add registers <b>S</b> and <b>T</b> (2's complement) into register <b>R</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">ADF</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, R{<b>T</b>}</td>
            <td class="col-opcode">6</td>
            <td class="col-operand">RST</td>
            <td class="col-description">
                Add registers <b>S</b> and <b>T</b> (floating-point) into register <b>R</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">ORR</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, R{<b>T</b>}</td>
            <td class="col-opcode">7</td>
            <td class="col-operand">RST</td>
            <td class="col-description">
                OR registers <b>S</b> and <b>T</b> into register <b>R</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">AND</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, R{<b>T</b>}</td>
            <td class="col-opcode">8</td>
            <td class="col-operand">RST</td>
            <td class="col-description">
                AND registers <b>S</b> and <b>T</b> into register <b>R</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">XOR</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, R{<b>T</b>}</td>
            <td class="col-opcode">9</td>
            <td class="col-operand">RST</td>
            <td class="col-description">
                XOR registers <b>S</b> and <b>T</b> into register <b>R</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">ROT</td>
            <td class="col-pattern">R{<b>R</b>}, 0X</td>
            <td class="col-opcode">A</td>
            <td class="col-operand">R0X</td>
            <td class="col-description">
                Rotate register <b>R</b> right <b>X</b> times.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">JMP</td>
            <td class="col-pattern">R{<b>R</b>}, XY</td>
            <td class="col-opcode">B</td>
            <td class="col-operand">RXY</td>
            <td class="col-description">
                Jump to address <b>XY</b> if register <b>R</b> equals register <b>0</b>.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">HLT</td>
            <td class="col-pattern">—</td>
            <td class="col-opcode">C</td>
            <td class="col-operand">000</td>
            <td class="col-description">
                Halt execution.<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">PSH</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, …</td>
            <td class="col-opcode">D</td>
            <td class="col-operand">R00</td>
            <td class="col-description">
                Push registers <b>R</b>, <b>S</b>, ... onto stack. (Stack mode only).<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">POP</td>
            <td class="col-pattern">R{<b>R</b>}, R{<b>S</b>}, …</td>
            <td class="col-opcode">E</td>
            <td class="col-operand">R00</td>
            <td class="col-description">
                Pop stack into register <b>R</b>, <b>S</b>, ... (Stack mode only).<br/>
                <strong>Note:</strong> `POP <b>PC</b>` returns from branch (Branch mode only).<br/>
            </td>
            </tr>
            <tr>
            <td class="col-mnemonic">CAL</td>
            <td class="col-pattern">FUNC</td>
            <td class="col-opcode">F</td>
            <td class="col-operand">0XY</td>
            <td class="col-description">
                Branch to address <b>XY</b>, save return address. (Branch mode only).<br/>
            </td>
            </tr>
        </tbody>
        </table>

        <h2>Floating Point</h2>
        <p class="floating">The floating point notation used by this machine uses 1 bit for sign
         (0 for positive, 1 for negative),<br/> 3 bits for the exponent (excess notation) and 4 mantissa bits
          (the bits following the first "1" bit).
        </p>
    </div>
  );

};

export default InstructionDisplay;