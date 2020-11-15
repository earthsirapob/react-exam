let initialState = {
  userData: [],
  userCount: 0
}

const formReducer = (state = initialState, { type, userData, userCount, indexArray }) => {
  switch (type) {
    case 'ADD_USER_DATA':
      return {
        ...state,
        userData: state.userData.concat([userData]),
        userCount: state.userCount + 1
      }
    case 'UPDATE_USER_DATA':
      return {
        ...state,
        userData: userData
      }
    case 'UPDATE_USER_COUNT':
      return {
        ...state,
        userCount: userCount
      }
    case 'DELETE_USER_DATA':
      return {
        ...state,
        userData: state.userData.filter((userData) => userData.key !== 0)
      }
    case 'DELETE_SELECT_DATA':
      
      return {
        ...state,
        userData: userData
      }
    default:
      return state
  }
}
export default formReducer