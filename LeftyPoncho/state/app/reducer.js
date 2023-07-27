
export default function AppReducer(state = {loading: false}, {type, payload}) {

  switch (type) {

    case 'SET_LOADING':
      return {
        loading: payload
      }

    default:
      return state;
  }
}