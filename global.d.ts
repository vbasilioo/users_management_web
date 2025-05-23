/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toBeVisible(): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveTextContent(text: string | RegExp): R;
  toHaveValue(value: string | string[] | number): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
  toBeChecked(): R;
  toBeEmpty(): R;
  toHaveFocus(): R;
  toHaveStyle(css: string): R;
  toHaveClass(className: string | string[]): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

export {}; 