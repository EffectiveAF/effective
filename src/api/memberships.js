import * as postgrest from './postgrest';

export const postMembershipReq = membership => {
  return postgrest
    .postJSON('/memberships', membership, { Prefer: 'return=representation' })
    .then(membershipJSON => membershipJSON[0])
    .catch(err => console.log('Error posting membership:', err));
};

export const getMembershipsReq = filterOption => {
  const filterKey = Object.keys(filterOption)[0];
  const filterVal = filterOption[filterKey];
  return postgrest
    .getJSON(`/memberships?${filterKey}=eq.${filterVal}`)
    .then(memberships => {
      const membershipsMap = {};
      let m;
      for (let i = 0; i < memberships.length; i++) {
        m = memberships[i];
        membershipsMap[m.user_username + '_' + m.pursuance_id] = m;
      }
      return membershipsMap;
    })
    .catch(err => console.log('Error fetching memberships', err));
};

export const deleteMembershipReq = ({ pursuance_id, user_username }) => {
  return postgrest
    .deleteJSON(
      `/memberships?user_username=eq.${user_username}&pursuance_id=eq.${
        pursuance_id
      }`,
      {
        Prefer: 'return=representation'
      }
    )
    .then(membershipJSON => membershipJSON[0])
    .catch(err => console.log('Error deleting membership:', err));
};
