const initialState = {
  membershipMap: {},
  rootMembershipIds: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'POST_MEMBERSHIP_PENDING':
      return state;

    case 'POST_MEMBERSHIP_FULFILLED':
      const membership = action.payload;
      return Object.assign({}, state, {
        membershipMap: {
          [membership.id]: membership
        }
      });

    case 'POST_MEMBERSHIP_REJECTED':
      return state;

    case 'GET_MEMBERSHIPS_PENDING':
      return state;

    case 'GET_MEMBERSHIPS_FULFILLED':
      return Object.assign({}, state, action.payload);

    case 'GET_MEMBERSHIPS_REJECTED':
      return state;

    case 'DELETE_MEMBERSHIP_PENDING':
      return state;

    case 'DELETE_MEMBERSHIP_FULFILLED':
      const membershipId = action.payload.id;
      const updatedState = { ...state };
      delete updatedState.membershipMap[membershipId];
      return updatedState;

    case 'DELETE_MEMBERSHIP_REJECTED':
      return state;


    case 'MEMBERSHIP_SET_PERMISSIONS_LEVEL_PENDING': {
      return state;
    }

    case 'MEMBERSHIP_SET_PERMISSIONS_LEVEL_FULFILLED': {
      const membership = action.payload;
      return Object.assign({}, state, {
        membershipMap: Object.assign({}, state.membershipMap, {
          [membership.id]: membership
        })
      });
    }

    case 'MEMBERSHIP_SET_PERMISSIONS_LEVEL_REJECTED': {
      return state;
    }

    case 'ADD_POSTED_SUB_MEMBERSHIP': {
      const membership = action.payload;
      const parentId = membership.invited_by + '_' + membership.pursuance_id;
      const parentMembership = state.membershipMap[parentId];
      return Object.assign({}, state, {
        membershipMap: Object.assign({}, state.membershipMap, {
          [membership.id]: membership,
          [parentId]: Object.assign({}, parentMembership, {
            submembership_ids: [...parentMembership.submembership_ids,
                                membership.id]
          })
        })
      });
    }

    default:
      return state;
  }
}
