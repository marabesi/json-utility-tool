import { render, act, waitFor, within, screen } from '@testing-library/react';
import App from '../App';
import { customType } from './__testutilities__/customTyping';
import userEvent from '@testing-library/user-event';

function grabCurrentEditor(container: HTMLElement): HTMLElement {
  // eslint-disable-next-line testing-library/no-node-access
  const editor = container.querySelector('[data-testid="json"] .cm-content');
  if (!editor) {
    throw new Error('Could not find editor');
  }
  return editor as HTMLElement;
}

describe('Editors', () => {
  it.each([
    ['{{}', '{}'],
    ['{{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    render(<App />);

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

    await act(async () => {
      await customType(editor, input);
    });

    const result = screen.getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  it('should keep content in the editor when navigating away', async () => {
    render(<App/>);

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
    const json = '{{"random_json":"123"}';

    await act(async () => {
      await customType(editor, json);
    });

    const rawEditor = screen.getByTestId('raw-json');

    await waitFor(() => {
      expect(rawEditor).toHaveValue('{"random_json":"123"}');
    }, { timeout: 10000 });

    await userEvent.click (screen.getByTestId('settings'));

    await waitFor(() => {
      expect( screen.getByText('Settings')).toBeInTheDocument();
    }, { timeout: 10000 });

    await userEvent.click (screen.getByTestId('to-home'));

    await waitFor(() => {
      expect (screen.getByTestId('raw-json')).toHaveValue('{"random_json":"123"}');
      expect (screen.getByTestId('raw-result')).toHaveValue('{\n  "random_json": "123"\n}');
    }, { timeout: 10000 });
  });

  it('should render search element in the json editor', async () => {
    render(<App/>);

    await userEvent.click (screen.getByTestId('search-json'));

    await waitFor(() => expect(within (screen.getByTestId('json')).getByText('×')).toBeInTheDocument());
  });

  it('should render search element in the result editor', async () => {
    render(<App/>);

    await userEvent.click (screen.getByTestId('search-result'));

    await waitFor(() => expect(within (screen.getByTestId('result')).getByText('×')).toBeInTheDocument());
  });

  describe.skip('loading', () => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: true });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render loading when typing', async () => {
      render(<App/>);
      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      const json = '{{"random_json":"123","a":"a"}';

      act(() => {
        customType(editor, json);
      });

      await waitFor(() => {
        expect (screen.getByTestId('loading')).toBeInTheDocument();
      });
    });

    it('should remove loading when typing is finished', async () => {
      render(<App/>);
      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      const json = '{{"random_json":"123"}';

      act(() => {
        customType(editor, json);
      });

      await waitFor(() => {
        expect (screen.getByTestId('loading')).toBeInTheDocument();
      });

      jest.runAllImmediates();

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });
});
