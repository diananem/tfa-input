import React, { useState } from 'react';
import { setup, styled } from 'goober';

setup(React.createElement);

const Container = styled('div')`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  position: relative;
  margin-bottom: 5px;
`;

const Number = styled('div')`
  height: 50px;
  width: 35px;
  margin: 0 5px;
  text-align: center;
  font-size: 32px;
  font-weight: 400;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px #ccc inset;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    margin-left: 0px;
  }
  &:last-child {
    margin-right: 0px;
  }
`;

const StyledInput = styled('input')`
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 32px;
  background: transparent;
  border: none;
  outline: none;
  display: block;

  &:focus {
    width: 35px;
    border: 1px solid #23d9d9;
    box-shadow: 0 0 5px #23d9d9 inset;
    border-radius: 3px;
    overflow: hidden;
    height: 50px;
  }
`;

interface TfaInputProps {
  onSubmit: (code: string) => void;
  autoFocus?: boolean;
}

type InputChar = string | undefined;

const EMPTY_NUMBER: InputChar = undefined;

const initialState: InputChar[] = [
  EMPTY_NUMBER,
  EMPTY_NUMBER,
  EMPTY_NUMBER,
  EMPTY_NUMBER,
  EMPTY_NUMBER,
  EMPTY_NUMBER,
];

// Left align for the input
function getInputPosition(firstNullIndex: number) {
  let left = 45 * firstNullIndex;
  // Need to add additional left px if we enter after "-"
  if (firstNullIndex > 2) {
    left += 15;
  }
  return left;
}

const TfaInput: React.FC<TfaInputProps> = ({ onSubmit, autoFocus = false }) => {
  const [code, setCode] = useState<InputChar[]>([...initialState]);
  const [inputValue, setInputValue] = useState('');

  let firstNullIndex = code.findIndex((code) => !code);
  // If all numbers is entered we need allow to delete start
  // From the last number
  if (firstNullIndex === -1) {
    firstNullIndex = 5;
  }
  const inputEl = React.useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Number>{code[0]}</Number>
      <Number>{code[1]}</Number>
      <Number>{code[2]}</Number>
      <span style={{ width: '15px', textAlign: 'center' }}> - </span>
      <Number>{code[3]}</Number>
      <Number>{code[4]}</Number>
      <Number>{code[5]}</Number>
      <StyledInput
        className="tfa-input"
        type="tel"
        autoFocus={autoFocus}
        autoComplete="off"
        style={{
          left: `${getInputPosition(firstNullIndex)}px`,
        }}
        ref={inputEl}
        onChange={async ({ target: { value } }) => {
          if (!/[0-9]/.test(value)) {
            return;
          }
          // If code was copy pasted all at once
          if (value.length === 6) {
            setCode([...value]);
            try {
              if (inputEl && inputEl.current) {
                inputEl.current.blur();
              }
              await onSubmit(value);
            } catch {
              setCode([...initialState]);
              if (inputEl && inputEl.current) {
                inputEl.current.focus();
              }
            }
          } else {
            code[firstNullIndex] = value;
            setCode([...code]);
          }
          const isTheLastNumber = firstNullIndex === 5;
          if (isTheLastNumber) {
            try {
              if (inputEl && inputEl.current) {
                inputEl.current.blur();
              }
              await onSubmit(code.join(''));
            } catch {
              setCode([...initialState]);
              if (inputEl && inputEl.current) {
                inputEl.current.focus();
              }
            }
          }
          setInputValue('');
        }}
        value={inputValue}
        onKeyDown={(e: React.KeyboardEvent) => {
          const { key } = e;

          if (key === 'Backspace' || key === 'Delete') {
            if (firstNullIndex === 0) return;
            if (code[5]) {
              code[5] = EMPTY_NUMBER;
              setCode([...code]);
              return;
            }
            code[firstNullIndex - 1] = EMPTY_NUMBER;
            setCode([...code]);
          }
        }}
      />
    </Container>
  );
};

export default TfaInput;
