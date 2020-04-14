import { combineReducers } from 'redux'
import { usersStore } from './userStore';
import { ethStore } from './ethStore';
import { dataStore } from './dataStore';
import { layoutStore } from './layoutStore';
import { identityStore } from './identityStore';

export default combineReducers({ usersStore, ethStore, dataStore, layoutStore, identityStore })
