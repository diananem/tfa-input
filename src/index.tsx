import React, { useEffect } from 'react';
import { setup, styled } from 'goober';
import * as CSS from 'csstype';

setup(React.createElement);

const Container = styled('div')`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  position: relative;
  margin-bottom: 5px;
  * {
    box-sizing: content-box;
  }
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

const StyledInput = styled('input', React.forwardRef)<{
  left: number;
  focuscolor?: string;
}>`
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
    border: ${({ focuscolor = '#23d9d9' }) => `1px solid ${focuscolor}`};
    box-shadow: ${({ focuscolor = '#23d9d9' }) =>
      `0 0 5px ${focuscolor} inset`};
    border-radius: 3px;
    overflow: hidden;
    height: 48px;
    left: ${({ left = 0 }) => `${left}px`};
  }
`;

type StyleType = string | CSS.Properties;

interface TfaInputProps {
  value?: string | number;
  onSubmit: (code: string) => void;
  autoFocus?: boolean;
  containerStyle?: StyleType;
  cellNumberStyle?: StyleType;
  inputStyle?: StyleType;
  focusColor?: string;
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
  value,
  onSubmit,
  autoFocus = false,
  containerStyle,
  cellNumberStyle,
  inputStyle,
  focusColor,
}) => {
  const [code, setCode] = React.useState<string[]>(
    value ? value.toString().split('', 6) : []
  );
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

  const getStyleProps = (style: StyleType) => {
    const propName = typeof style === 'string' ? 'className' : 'style';
    return { [propName]: style };
  };

  return (
    <Container {...(containerStyle && getStyleProps(containerStyle))}>
      <Number {...(cellNumberStyle && getStyleProps(cellNumberStyle))}>
        {code[0]}
      </Number>
      <Number {...(cellNumberStyle && getStyleProps(cellNumberStyle))}>
        {code[1]}
      </Number>
      <Number {...(cellNumberStyle && getStyleProps(cellNumberStyle))}>
        {code[2]}
      </Number>
      <span style={{ width: '15px', textAlign: 'center' }}> - </span>
      <Number {...(cellNumberStyle && getStyleProps(cellNumberStyle))}>
        {code[3]}
      </Number>
      <Number {...(cellNumberStyle && getStyleProps(cellNumberStyle))}>
        {code[4]}
      </Number>
      <Number {...(cellNumberStyle && getStyleProps(cellNumberStyle))}>
        {code[5]}
      </Number>
      <StyledInput
        focuscolor={focusColor}
        autoComplete="off"
        autoFocus={autoFocus}
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
        {...(inputStyle && getStyleProps(inputStyle))}
      />
    </Container>
  );
};
