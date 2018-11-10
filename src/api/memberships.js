import * as postgrest from './postgrest';

export const postMembershipReq = membership => {
  return postgrest
    .postJSON('/memberships', membership, { Prefer: 'return=representation' })
    .then(membershipJSON => membershipJSON[0])
    .catch(err => console.log('Error posting membership:', err));
};

export const patchMembershipReq = membership => {
  return postgrest
    .patchJSON(`/memberships?id=eq.${membership.id}`, membership, { Prefer: 'return=representation' })
    .then(membershipJSON => membershipJSON[0])
    .catch(err => console.log('Error patching membership:', err));
};

export const getMembershipsReq = filterOption => {
  const filterKey = Object.keys(filterOption)[0];
  const filterVal = filterOption[filterKey];
  return postgrest
    .getJSON(`/memberships?${filterKey}=eq.${filterVal}&order=created.asc`)
    .then(memberships => {
      const membershipMap = {};
      const rootMembershipIds = [];
      let m, parent, parentKey;
      for (let i = 0; i < memberships.length; i++) {
        m = memberships[i];
        membershipMap[m.id] = m;
        membershipMap[m.id].submember_ids = [];
        if (!m.invited_by) {
          rootMembershipIds.push(m.id);
        } else if (filterKey === 'pursuance_id') {
          // Add self to parent's (inviter's) invitees
          parentKey = m.invited_by + '_' + filterVal;
          parent = membershipMap[parentKey];
          if (parent) {
            parent.submember_ids.push(m.id);
          } else {
            console.log(
              `Membership ${m.id} ("${m.user_username}")'s parent ${parentKey}` +
              ` not found in membershipMap`
            )
          }
        }
      }
      return {
        membershipMap,
        rootMembershipIds,
      };
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
