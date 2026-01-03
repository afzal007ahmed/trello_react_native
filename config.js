
export const ENV = {

  API_PROFILE: "https://api.trello.com/1/members/me",
  API_BOARDS:"https://api.trello.com/1/members/me/boards",
  API_WORKSPACES : "https://api.trello.com/1/members/me/organizations",
  API_BOARDS_COUNT : "https://api.trello.com/1/organizations",
  API_ADD_BOARD : "https://api.trello.com/1/boards",
  API_GET_LISTS : ( id ) => `https://api.trello.com/1/boards/${id}/lists`,
  API_GET_CARDS : ( id ) => `https://api.trello.com/1/lists/${id}/cards`,
  API_CREATE_CARD : "https://api.trello.com/1/cards" ,
  API_CHECK_CARD : ( id ) => `https://api.trello.com/1/cards/${id}`,
  API_ARCHIVE_BOARD : ( id ) => `https://api.trello.com/1/boards/${id}`,
  API_ARCHIVE_LIST : ( id ) => `https://api.trello.com/1/lists/${id}`,
  API_ADD_LIST :"https://api.trello.com/1/lists",
  API_GET_CARD_DETAILS : ( id ) => `https://api.trello.com/1/cards/${id}`,
  API_CREATE_CHECK_ITEM : ( id ) => `https://api.trello.com/1/checklists/${id}/checkItems`,
  API_CHANGE_CHECK_STATE : (cardId , checkItemId ) => `https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}` ,
  API_DELETE_CHECKLIST : ( id ) => `https://api.trello.com/1/checklists/${id}`,
  API_CHANGE_CHECKLIST_NAME : ( id ) => `https://api.trello.com/1/checklists/${id}`,
  API_CREATE_CHECKLIST : 'https://api.trello.com/1/checklists',
  API_CHANGE_CARD_NAME : (id) => `https://api.trello.com/1/cards/${id}`,
  API_CHANGE_LIST_NAME : (id) => `https://api.trello.com/1/lists/${id}`
  };

