import { combineReducers } from 'redux'
import { usersStore } from './userStore';
import { ethStore } from './ethStore';
import { documentStore } from './documentStore';
import { layoutStore } from './layoutStore';
import { identityStore } from './identityStore';

export default combineReducers({ usersStore, ethStore, documentStore, layoutStore, identityStore })
