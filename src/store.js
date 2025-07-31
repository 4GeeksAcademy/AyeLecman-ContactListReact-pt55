export const initialStore = () => ({
  contacts: [],
  agenda: "AyeLec",
});

const storeReducer = (state, action) => {
  switch (action.type) {
    case "load_contacts":
      return {
        ...state,
        contacts: action.payload,
      };

    default:
      return state;
  }
};

export default storeReducer;
