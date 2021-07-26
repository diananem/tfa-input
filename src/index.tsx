import React, { useEffect } from 'react';
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
`;

const StyledInput = styled('input', React.forwardRef)<{ left: number }>`
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
    width: 31px;
    border: 1px solid #23d9d9;
    box-shadow: 0 0 5px #23d9d9 inset;
    border-radius: 3px;
    overflow: hidden;
    height: 48px;
    left: ${({ left = 0 }) => `${left}px`};
  }
`;

interface TfaInputProps {
  onSubmit: (code: string) => void;
  autoFocus?: boolean;
}

/**
 * This function calculates position of the input.
 * The component uses only 1 input that we're moving through all 6 cells.
 */
function getInputPosition(firstNullIndex: number): number {
  let left = 47 * firstNullIndex;
  // Need to add additional left px if we enter after "-"
  if (firstNullIndex > 2) {
    left += 15;
  }
  return left;
}

export const TfaInput: React.FC<TfaInputProps> = ({
  onSubmit,
  autoFocus = false,
}) => {
  const [code, setCode] = React.useState<string[]>([]);
  const inputEl = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isFullCode = code.length === 6;

    if (isFullCode) {
      try {
        inputEl?.current?.blur();

        onSubmit?.(code.join(''));
      } catch {
        /**
         * In case if submit has triggered an error - we should clean up the input
         * E.g. the API call has returned "incorrect 2fa number"
         */
        setCode([]);
        inputEl?.current?.focus();
      }
    }
  }, [code]);

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
        autoComplete="off"
        autoFocus={autoFocus}
        className="tfa-input"
        left={getInputPosition(code.length > 5 ? 5 : code.length)}
        ref={inputEl}
        type="tel"
        onChange={({ target: { value } }) => {
          const isNumber = /[0-9]/.test(value);
          if (!isNumber) {
            return;
          }

          setCode((prevValue) => {
            const newValue = [...prevValue, ...value.split('')].slice(0, 6);

            return newValue;
          });
        }}
        // We set empty string value to keep input empty during entering the numbers
        value={''}
        onKeyDown={(e: React.KeyboardEvent) => {
          const { key } = e;
          const updatedCode = [...code];

          if (key === 'Backspace' || key === 'Delete') {
            if (code.length === 0) return;

            updatedCode.pop();
            setCode(updatedCode);
          }
        }}
      />
    </Container>
  );
};
