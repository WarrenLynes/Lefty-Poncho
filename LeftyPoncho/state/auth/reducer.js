
export default function AuthReducer(state = {}, {type, payload}) {

  switch (type) {

    case 'USER_AUTHENTICATED':
      return {
        user: payload.user,
        token: payload.token
      }

    default:
      return state;
  }
}