import {createContext, useContext, useMemo, useReducer} from 'react';
import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

const Context = createContext({
  state: {},
  actions: {},
});

const globalState = {
  cartOpen: false,
  modal: {children: null, props: {}},
  searchOpen: false,
  emitter,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_CART':
      return {
        ...state,
        cartOpen: true,
        modal: {children: null, props: {}},
        searchOpen: false,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        cartOpen: false,
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        cartOpen: false,
        modal: {
          children: action.payload.children,
          props: {...action.payload.props},
        },
        searchOpen: false,
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: {children: null, props: {}},
      };
    case 'OPEN_SEARCH':
      return {
        ...state,
        cartOpen: false,
        modal: {children: null, props: {}},
        searchOpen: true,
      };
    case 'CLOSE_SEARCH':
      return {
        ...state,
        searchOpen: false,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch) => ({
  openCart: () => {
    dispatch({type: 'OPEN_CART'});
  },
  closeCart: () => {
    dispatch({type: 'CLOSE_CART'});
  },
  openModal: (children, props) => {
    dispatch({type: 'OPEN_MODAL', payload: {children, props}});
  },
  closeModal: () => {
    dispatch({type: 'CLOSE_MODAL'});
  },
  openSearch: () => {
    dispatch({type: 'OPEN_SEARCH'});
  },
  closeSearch: () => {
    dispatch({type: 'CLOSE_SEARCH'});
  },
});

export function GlobalProvider({children}) {
  const [state, dispatch] = useReducer(reducer, {...globalState});

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useGlobalContext = () => useContext(Context);
