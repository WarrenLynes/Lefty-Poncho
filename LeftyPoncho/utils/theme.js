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
    initialColorMode: 'light',
  },

  components: {
    Text: {
      defaultProps: {
        fontSize: 'xl',
      }
    },
    Button: {
      /*defaultProps: {
        // colorScheme: 'blue',
        backgroundColor: '#fff',
        color: '#111',
        borderColor: '#111111'
      },*/

      baseStyle: () => {
        return {
          rounded: 'md',
          _light: { backgroundColor: '#fff', color: '#111111', borderColor: '#111111'  },
          _dark: { backgroundColor: '#fff', color: 'blue.300' },
        }
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
          _light: { color: 'black' },
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