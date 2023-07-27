import {extendTheme} from "native-base";

export const theme = extendTheme({
  colors: {
    primary: {
      50: "#a6e9ff",
      100: "#65d8ff",
      200: "#24c8ff",
      300: "#0cb7f0",
      400: "#1596c1"
    },
    secondary: {
      50: "#ffd4d4",
      100: "#ff9393",
      200: "#ff5554",
      300: "#f53636",
      400: "#e61d1d"
    }
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },

  components: {
    Button: {
      // Can simply pass default props to change default behaviour of components.
      baseStyle: {
        rounded: 'md',
        _light: {  },
        _dark: {backgroundColor: '#fff', color: 'blue.300' },
      },
      defaultProps: {
        colorScheme: 'blue',
      },
    },
    Box: {
      baseStyle: (props) => {
        return {
          _light: {  },
          _dark: { backgroundColor: '#11111', color: 'blue.300' },
        };
      }
    },
    View: {
      baseStyle: (props) => {
        return {
          _light: {  },
          _dark: { backgroundColor: '#11111', color: 'blue.300' },
        };
      }
    },
    Input: {
      baseStyle: (props) => {
        return {
          _light: { color: 'red.300' },
          _dark: { color: '#fff' },
        };
      }
    },
    Heading: {
      // Can pass also function, giving you access theming tools
      baseStyle: ({colorMode}) => {
        return {
          color: colorMode === 'dark' ? 'red.300' : 'blue.300',
          fontWeight: 'normal',
        };
      }
    }
  }
});