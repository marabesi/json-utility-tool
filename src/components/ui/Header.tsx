import { FaCoffee, FaRegSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import fullConfig from '../../tailwindResolver';
import { usePersistenceContext } from 'src/PersistenceContext';
import { useThemeContext } from 'src/DarkModeContext';

export default function Header() {
  const { isValidateEnabled, setValidateEnabled } = usePersistenceContext();
  const { onDarkThemeChanged, darkModeEnabled  } = useThemeContext();
  return (
    <div className="bg-blue-900 flex justify-between p-5 dark:bg-gray-700">
      <div className="flex items-center">
        <h2 className="text-yellow-400 font-bold">
          <Link to="/" data-testid="to-home">JSON tool</Link>
        </h2> |
        <a href="https://github.com/marabesi/json-tool" target="_blank" rel="noreferrer">by marabesi</a>
        <div className="ml-10">
          <input type="checkbox" id="is-validate-json" onChange={() => setValidateEnabled(!isValidateEnabled)}
            data-testid="is-validate-json" checked={isValidateEnabled} className="mr-1" />
          <label htmlFor="is-validate-json">validate json</label>
        </div>
      </div>
      <div className="flex items-center">
        <Switch
          onChange={onDarkThemeChanged}
          checked={darkModeEnabled}
          data-testid="dark-mode"
          className="mr-5"
          height={18}
          width={50}
          onColor={fullConfig.theme.backgroundColor.blue['900']}
          offColor={fullConfig.theme.backgroundColor.gray['700']}
          checkedIcon={false}
          uncheckedIcon={false}
        />
        <Link className="flex items-center mr-5" data-testid="settings" to="/settings">
          <FaRegSun />
        </Link>
        <a className="flex items-center" data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">
          <FaCoffee className="mr-2" />
          <span>Buy me a coffee</span>
        </a>
      </div>
    </div>
  );
}
