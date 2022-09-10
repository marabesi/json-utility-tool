import CodeMirror, { BasicSetupOptions } from '@uiw/react-codemirror';
import fullConfig from '../../tailwindResolver';
import { json } from '@codemirror/lang-json';
import { SettingsContext, ThemeContext } from '../../App';
import { CSSProperties, useContext } from 'react';
import { Option, Properties } from './Editor';

type Event = {
  value: string;
};

type EventChange = (event: Event) => void;

interface Props{
  input: string;
  className?: string;
  onChange?: EventChange;
  'data-testid': string;
  contenteditable: boolean;
}

export default function JsonEditor({ input, onChange, className, ...rest }: Props) {
  const theme = useContext(ThemeContext);
  const settings = useContext(SettingsContext);

  const handleChange = (value: string) => {
    if (onChange) {
      onChange({ value });
      return;
    }
  };

  const basicSetup: BasicSetupOptions = {};
  if (settings.options) {
    settings.options.forEach((item: Option) => basicSetup[item.title as keyof BasicSetupOptions] = item.active);
  }

  const style: CSSProperties = {
    backgroundColor: fullConfig.theme.backgroundColor.gray['200'],
    overflowY: 'hidden',
    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
  };

  if (settings.properties) {
    // @ts-ignore
    settings.properties.forEach((item: Properties) => style[item.key] = item.value);
  }

  return (
    <>
      <textarea data-testid={`raw-${rest['data-testid']}`} className="hidden" defaultValue={input}></textarea>
      <CodeMirror
        value={input}
        onChange={handleChange}
        className={[className, 'h-full'].join(' ')}
        style={style}
        height="100%"
        extensions={[json()]}
        theme={theme.darkMode ? 'dark' : 'light'}
        basicSetup={basicSetup}
        {...rest}
      />
    </>
  );
}
